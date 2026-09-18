const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
// The app has no test runner; compile this pure utility with the installed compiler.
const source = fs.readFileSync(path.join(__dirname, '../features/transactions/utils/dateRange.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } });
const exported = {};
new Function('exports', compiled.outputText)(exported);
const { presetRange, dateInputValue, parseDateInput, rangeQuery, monthRange } = exported;

test('last month crosses January into the previous year', () => {
  const range = presetRange('lastMonth', new Date(2026, 0, 18));
  assert.equal(dateInputValue(range.startDate), '2025-12-01');
  assert.equal(dateInputValue(range.endDate), '2025-12-31');
});

test('February handles leap and ordinary years', () => {
  assert.equal(dateInputValue(monthRange(2024, 1).endDate), '2024-02-29');
  assert.equal(dateInputValue(monthRange(2025, 1).endDate), '2025-02-28');
  assert.equal(parseDateInput('2025-02-29'), null);
  assert.equal(parseDateInput('2026-13-01'), null);
  assert.equal(parseDateInput('2026-1-01'), null);
  assert.equal(dateInputValue(parseDateInput('2024-02-29')), '2024-02-29');
});

test('inclusive custom end becomes next local midnight across daylight saving', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'Europe/Madrid';
  try {
    const day = parseDateInput('2026-03-29');
    const query = rangeQuery({ startDate: day, endDate: day });
    assert.equal(query.startDate, '2026-03-28T23:00:00.000Z');
    assert.equal(query.endDate, '2026-03-29T22:00:00.000Z');
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});

test('all time has no bounds and year preset includes December 31', () => {
  assert.deepEqual(rangeQuery(presetRange('allTime')), {});
  const range = presetRange('thisYear', new Date(2026, 8, 18));
  assert.equal(dateInputValue(range.startDate), '2026-01-01');
  assert.equal(dateInputValue(range.endDate), '2026-12-31');
});

test('month headings use the same local dates as the filter and transaction rows', () => {
  const previousTZ = process.env.TZ;
  process.env.TZ = 'Europe/Madrid';
  try {
    const groups = exported.groupByLocalMonth([
      { month: '2026-03', items: [{ id: 'later', date: '2026-03-01T01:00:00Z' }] },
      { month: '2026-02', items: [{ id: 'midnight', date: '2026-02-28T23:00:00Z' }] },
    ]);
    assert.equal(groups.length, 1);
    assert.equal(groups[0].month, '2026-03');
    assert.deepEqual(groups[0].items.map((item) => item.id), ['later', 'midnight']);
  } finally {
    if (previousTZ === undefined) delete process.env.TZ;
    else process.env.TZ = previousTZ;
  }
});
