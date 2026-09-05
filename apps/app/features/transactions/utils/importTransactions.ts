import type {
  Account,
  Category,
  FrequencyType,
  TransactionNature,
  TransactionType,
} from "@repo/shared-types";
import type {
  CsvImportMapping,
  CsvImportRow,
  ParsedImportTransaction,
} from "../types/importTransactions.types";

const MAX_IMPORT_ROWS = 500;
const MAX_AMOUNT = 9999999999.99;
const HEADER_ALIASES = {
  date: [
    "date",
    "fecha",
    "fechaoperacion",
    "fechadeoperacion",
    "foperacion",
    "fechamovimiento",
    "fechacontable",
    "fcontable",
    "fechavalor",
    "fechadevalor",
    "fvalor",
    "valor",
  ],
  description: [
    "description",
    "descripcion",
    "concept",
    "concepto",
    "movimiento",
    "detalle",
    "detalles",
    "conceptocomun",
    "conceptopropio",
    "masdatos",
  ],
  amount: ["amount", "importe", "cantidad"],
  type: ["type", "tipo", "tipomovimiento", "debehaber"],
  category: ["category", "categoria"],
  account: ["account", "cuenta"],
  currency: ["currency", "divisa", "moneda"],
  notes: ["notes", "note", "notas"],
  frequencyType: ["frequencytype", "frecuencia"],
  transactionNature: ["transactionnature", "naturaleza"],
} as const;
const FREQUENCY_TYPES = new Set<FrequencyType>([
  "one_time",
  "weekly",
  "monthly",
  "yearly",
]);
const TRANSACTION_NATURES = new Set<TransactionNature>([
  "fixed",
  "variable",
  "rent",
  "subscription",
  "salary",
  "refund",
  "other",
]);

export class CsvImportError extends Error {}

export function parseTransactionsCsv(csv: string): CsvImportRow[] {
  const normalizedCsv = csv.replace(/^\uFEFF/, "");
  const rows = parseCsvRows(normalizedCsv, detectDelimiter(normalizedCsv));
  const headerRowIndex = rows.findIndex(isTransactionHeaderRow);

  if (headerRowIndex < 0) {
    throw new CsvImportError(
      "Could not find transaction columns. Expected date/fecha, description/concepto and amount/importe.",
    );
  }

  const headers = rows[headerRowIndex].map(normalizeHeader);
  const source = isWelmioHeaderRow(headers) ? "welmio" : "bank";
  const dataRows = rows
    .slice(headerRowIndex + 1)
    .filter((row) => row.some((cell) => cell.trim().length > 0));

  if (dataRows.length === 0) {
    throw new CsvImportError("The CSV file does not contain any transactions.");
  }

  if (dataRows.length > MAX_IMPORT_ROWS) {
    throw new CsvImportError(
      `A CSV file can contain at most ${MAX_IMPORT_ROWS} transactions.`,
    );
  }

  return dataRows.map((row, index) => {
    const rowNumber = headerRowIndex + index + 2;
    const value = (field: keyof typeof HEADER_ALIASES) =>
      getAliasedValue(row, headers, HEADER_ALIASES[field]);
    const parsedAmount = parseAmount(value("amount"), rowNumber);
    const explicitType = value("type");
    const type = explicitType
      ? parseType(explicitType, rowNumber)
      : parsedAmount.signedAmount < 0
        ? "expense"
        : "income";
    const description = value("description");
    const notes = value("notes");

    if (!description || description.length > 120) {
      throw new CsvImportError(
        `Description on row ${rowNumber} must contain 1 to 120 characters.`,
      );
    }

    if (notes.length > 500) {
      throw new CsvImportError(
        `Notes on row ${rowNumber} cannot exceed 500 characters.`,
      );
    }

    return {
      source,
      rowNumber,
      amount: parsedAmount.amount,
      currency: (
        value("currency") ||
        parsedAmount.currency ||
        "EUR"
      ).toUpperCase(),
      type,
      description,
      notes: notes || undefined,
      date: parseDate(value("date"), rowNumber),
      categoryName: value("category") || undefined,
      accountName: value("account") || undefined,
      frequencyType: parseFrequency(value("frequencyType"), rowNumber),
      transactionNature: parseNature(value("transactionNature"), rowNumber),
    };
  });
}

export function mapImportedTransactions(
  rows: CsvImportRow[],
  categories: Category[],
  accounts: Account[],
  mapping?: CsvImportMapping,
): ParsedImportTransaction[] {
  const categoriesByName = createUniqueNameMap(categories, "category");
  const accountsByName = createUniqueNameMap(accounts, "account");
  const categoriesById = new Map(
    categories.map((category) => [category.id, category]),
  );
  const accountsById = new Map(
    accounts.map((account) => [account.id, account]),
  );

  return rows.map((row, index) => {
    const useCsvMappings = row.source === "welmio";
    const category =
      useCsvMappings && row.categoryName
        ? categoriesByName.get(normalizeName(row.categoryName))
        : categoriesById.get(
            row.type === "income"
              ? (mapping?.incomeCategoryId ?? "")
              : (mapping?.expenseCategoryId ?? ""),
          );
    const account =
      useCsvMappings && row.accountName
        ? accountsByName.get(normalizeName(row.accountName))
        : accountsById.get(mapping?.accountId ?? "");

    if (!category) {
      throw new CsvImportError(
        row.categoryName
          ? `Unknown category "${row.categoryName}" on row ${row.rowNumber}.`
          : `Select a ${row.type} category for this bank CSV.`,
      );
    }

    if (category.type !== row.type) {
      throw new CsvImportError(
        `Category "${category.name}" does not match the transaction type on row ${row.rowNumber}.`,
      );
    }

    if (!account) {
      throw new CsvImportError(
        row.accountName
          ? `Unknown account "${row.accountName}" on row ${row.rowNumber}.`
          : "Select the Welmio account for this bank CSV.",
      );
    }

    if (!/^[A-Z]{3}$/.test(row.currency)) {
      throw new CsvImportError(
        `Currency on row ${row.rowNumber} must be a 3-letter code.`,
      );
    }

    const payload = {
      amount: row.amount,
      currency: row.currency,
      type: row.type,
      description: row.description,
      notes: row.notes,
      date: row.date,
      categoryId: category.id,
      accountId: account.id,
      frequencyType: row.frequencyType,
      transactionNature: row.transactionNature,
    };

    return {
      payload,
      preview: {
        id: `csv-preview-${index}`,
        description: row.description,
        notes: row.notes ?? null,
        amount: row.amount.toFixed(2),
        currency: row.currency,
        type: row.type,
        date: row.date,
        frequencyType: row.frequencyType,
        transactionNature: row.transactionNature,
        category,
        account,
      },
    };
  });
}

export function needsImportMapping(rows: CsvImportRow[]) {
  return rows.some(
    (row) => row.source === "bank" || !row.accountName || !row.categoryName,
  );
}

function isTransactionHeaderRow(row: string[]) {
  const headers = row.map(normalizeHeader);

  return (["date", "description", "amount"] as const).every((field) =>
    HEADER_ALIASES[field].some((alias) => headers.includes(alias)),
  );
}

function isWelmioHeaderRow(headers: string[]) {
  return ["date", "description", "amount", "type", "category", "account"].every(
    (header) => headers.includes(header),
  );
}

function getAliasedValue(
  row: string[],
  headers: string[],
  aliases: readonly string[],
) {
  for (const alias of aliases) {
    const index = headers.indexOf(alias);
    const value = index >= 0 ? (row[index]?.trim() ?? "") : "";

    if (value) return value;
  }

  return "";
}

function parseCsvRows(csv: string, delimiter: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let isQuoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const nextCharacter = csv[index + 1];

    if (character === '"') {
      if (isQuoted && nextCharacter === '"') {
        cell += '"';
        index += 1;
      } else {
        isQuoted = !isQuoted;
      }
    } else if (character === delimiter && !isQuoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !isQuoted) {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";

      if (character === "\r" && nextCharacter === "\n") index += 1;
    } else {
      cell += character;
    }
  }

  if (isQuoted) {
    throw new CsvImportError("The CSV file contains an unclosed quoted value.");
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function detectDelimiter(csv: string) {
  const candidateLines = csv.split(/\r?\n/).slice(0, 10);
  let commaCount = 0;
  let semicolonCount = 0;

  for (const line of candidateLines) {
    commaCount = Math.max(commaCount, countOutsideQuotes(line, ","));
    semicolonCount = Math.max(semicolonCount, countOutsideQuotes(line, ";"));
  }

  return semicolonCount > commaCount ? ";" : ",";
}

function countOutsideQuotes(value: string, characterToCount: string) {
  let count = 0;
  let isQuoted = false;

  for (const character of value) {
    if (character === '"') isQuoted = !isQuoted;
    if (!isQuoted && character === characterToCount) count += 1;
  }

  return count;
}

function normalizeHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function normalizeName(value: string) {
  return value.trim().toLocaleLowerCase();
}

function createUniqueNameMap<T extends { name: string }>(
  items: T[],
  label: string,
) {
  const result = new Map<string, T>();

  for (const item of items) {
    const normalizedName = normalizeName(item.name);

    if (result.has(normalizedName)) {
      throw new CsvImportError(
        `Multiple ${label}s are named "${item.name}". Rename them before importing.`,
      );
    }

    result.set(normalizedName, item);
  }

  return result;
}

function parseType(value: string, rowNumber: number): TransactionType {
  const normalized = normalizeHeader(value);
  const incomeTypes = new Set([
    "income",
    "ingreso",
    "ingresos",
    "abono",
    "haber",
    "h",
    "credito",
  ]);
  const expenseTypes = new Set([
    "expense",
    "gasto",
    "gastos",
    "cargo",
    "debe",
    "d",
    "debito",
  ]);

  if (incomeTypes.has(normalized)) return "income";
  if (expenseTypes.has(normalized)) return "expense";

  throw new CsvImportError(
    `Type on row ${rowNumber} must identify income/ingreso or expense/gasto.`,
  );
}

function parseAmount(value: string, rowNumber: number) {
  const currency = value.match(/[A-Za-z]{3}/)?.[0]?.toUpperCase();
  const isParenthesized = /^\s*\(.*\)\s*$/.test(value);
  const hasTrailingMinus = /-\s*(?:[A-Za-z]{3})?\s*$/.test(value);
  const numericValue = value.replace(/[^\d.,+-]/g, "").replace(/-$/, "");
  const lastComma = numericValue.lastIndexOf(",");
  const lastDot = numericValue.lastIndexOf(".");
  const decimalSeparator = lastComma > lastDot ? "," : ".";
  const thousandsSeparator = decimalSeparator === "," ? "." : ",";
  const normalized = numericValue
    .replaceAll(thousandsSeparator, "")
    .replace(decimalSeparator, ".");
  const parsedNumber = Number(normalized);
  const signedAmount =
    isParenthesized || hasTrailingMinus
      ? -Math.abs(parsedNumber)
      : parsedNumber;
  const amount = Math.abs(signedAmount);
  const decimalPlaces = normalized.split(".")[1]?.length ?? 0;

  if (
    !Number.isFinite(signedAmount) ||
    amount <= 0 ||
    amount > MAX_AMOUNT ||
    decimalPlaces > 2
  ) {
    throw new CsvImportError(`Invalid amount on row ${rowNumber}.`);
  }

  return { amount, currency, signedAmount };
}

function parseDate(value: string, rowNumber: number) {
  const localDateMatch = value.match(/^(\d{2})[/-](\d{2})[/-](\d{4})$/);

  if (localDateMatch) {
    const [, day, month, year] = localDateMatch;
    const date = new Date(
      Date.UTC(Number(year), Number(month) - 1, Number(day), 12),
    );

    if (
      date.getUTCFullYear() !== Number(year) ||
      date.getUTCMonth() !== Number(month) - 1 ||
      date.getUTCDate() !== Number(day)
    ) {
      throw new CsvImportError(`Invalid date on row ${rowNumber}.`);
    }

    return date.toISOString();
  }

  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) {
    throw new CsvImportError(`Invalid date on row ${rowNumber}.`);
  }

  return date.toISOString();
}

function parseFrequency(value: string, rowNumber: number): FrequencyType {
  const normalized = (value || "one_time").toLowerCase() as FrequencyType;

  if (!FREQUENCY_TYPES.has(normalized)) {
    throw new CsvImportError(`Invalid frequencyType on row ${rowNumber}.`);
  }

  return normalized;
}

function parseNature(value: string, rowNumber: number): TransactionNature {
  const normalized = (value || "other").toLowerCase() as TransactionNature;

  if (!TRANSACTION_NATURES.has(normalized)) {
    throw new CsvImportError(`Invalid transactionNature on row ${rowNumber}.`);
  }

  return normalized;
}
