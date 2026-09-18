const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { I18n } = require('i18n-js');
const locales = ['en', 'es', 'ca'];
const translations = Object.fromEntries(locales.map((locale) => {
  const file = path.join(__dirname, `../lib/i18n/locales/${locale}.ts`);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } });
  const exported = {};
  new Function('exports', compiled.outputText)(exported);
  return [locale, exported.default];
}));
const i18n = new I18n(translations, { enableFallback: false });

for (const locale of locales) {
  test(`${locale} resolves every browsing label without fallback`, () => {
    assert.ok(translations[locale].transactions.browse);
    assert.deepEqual(Object.keys(translations[locale].transactions.browse).sort(), Object.keys(translations.en.transactions.browse).sort());
    for (const key of Object.keys(translations.en.transactions.browse)) {
      const value = i18n.t(`transactions.browse.${key}`, { locale, from: 1, to: 25, total: 42, page: 1, totalPages: 2 });
      assert.ok(value.length > 0 && !value.startsWith('[missing'), `${locale}: ${key}`);
      assert.ok(!value.includes('%{'), `${locale}: unresolved interpolation in ${key}`);
    }
    const count = i18n.t('transactions.browse.resultCount', { locale, from: 1, to: 25, total: 42 });
    assert.match(count, /1.*25.*42/);
  });
}

test('all literal browsing keys referenced by the UI exist in every language', () => {
  const files = [
    'screens/TransactionsScreen.tsx',
    'components/calendar-filter-modal/CalendarFilterModal.tsx',
    'components/transaction-pagination/TransactionPagination.tsx',
  ];
  for (const file of files) {
    const source = fs.readFileSync(path.join(__dirname, '../features/transactions', file), 'utf8');
    for (const match of source.matchAll(/transactions\.browse\.(\w+)/g)) {
      for (const locale of locales) assert.equal(typeof translations[locale].transactions.browse[match[1]], 'string', `${locale}: ${match[1]}`);
    }
  }
});
