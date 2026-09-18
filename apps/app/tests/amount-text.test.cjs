const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { I18n } = require('i18n-js');

function loadSource(relativePath, overrides = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {};
  new Function('require', 'exports', compiled.outputText)(
    (name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name), exports,
  );
  return exports;
}

const translations = Object.fromEntries(['en', 'es', 'ca'].map(locale =>
  [locale, loadSource(`lib/i18n/locales/${locale}.ts`).default],
));
const i18n = new I18n(translations, { enableFallback: false });
const { formatCurrency } = loadSource('utils/formatCurrency.ts');
const { AmountText } = loadSource('components/ui/amount-text/AmountText.tsx', {
  'react-native': require('react-native-web'),
  '@/lib/i18n': { t: i18n.t.bind(i18n) },
});
const { formatSignedAmount } = loadSource('features/transactions/utils/formatters.ts', {
  '@/utils/formatCurrency': { formatCurrency },
  '@/lib/i18n': { default: i18n, t: i18n.t.bind(i18n) },
});

function render(formatValue) {
  return renderToStaticMarkup(React.createElement(AmountText, { formatValue }));
}

test('abbreviated balances expose the original cents and a keyboard-accessible control', () => {
  for (const [amount, currency, exact] of [
    ['10000.01', 'EUR', '€10,000.01'],
    ['19999.99', 'EUR', '€19,999.99'],
    ['1234567.89', 'USD', '$1,234,567.89'],
    ['-1234567.89', 'GBP', '-£1,234,567.89'],
  ]) {
    const markup = render(compact => formatCurrency(amount, currency, { compact }));
    assert.ok(markup.includes(`aria-label="${exact}"`));
    assert.match(markup, /role="button"/);
    assert.match(markup, /tabindex="0"/);
    assert.ok(markup.includes(formatCurrency(amount, currency)));
  }
});

test('full amounts and unavailable balances remain plain text', () => {
  for (const amount of ['9999.99', '-9999.99', 0, null]) {
    const markup = render(compact => formatCurrency(amount, 'EUR', { compact }));
    assert.doesNotMatch(markup, /role="button"/);
    assert.doesNotMatch(markup, /tabindex="0"/);
  }
  assert.doesNotMatch(render(() => '—'), /role="button"/);
});

test('expense and income labels preserve their original sign and currency', () => {
  const expense = render(compact => formatSignedAmount('12345.67', 'expense', 'USD', compact));
  const income = render(compact => formatSignedAmount('12345.67', 'income', 'USD', compact));
  assert.match(expense, /aria-label="-\$12,345\.67"/);
  assert.match(income, /aria-label="\$12,345\.67"/);
});

for (const locale of ['en', 'es', 'ca']) {
  test(`${locale} localizes the tooltip controls and reveals both amounts in goal summaries`, () => {
    i18n.locale = locale;
    for (const key of ['exactAmount', 'showExactAmount', 'close']) {
      assert.equal(typeof translations[locale].common[key], 'string');
      assert.ok(!i18n.t(`common.${key}`).startsWith('[missing'));
    }
    const markup = render(compact => i18n.t('goals.quickGoals.savedOf', {
      saved: formatCurrency('12345.67', 'EUR', { compact }),
      target: formatCurrency('1234567.89', 'EUR', { compact }),
    }));
    assert.ok(markup.includes('€12,345.67'));
    assert.ok(markup.includes('€1,234,567.89'));
    assert.match(markup, /role="button"/);
  });
}

const chartNumberFormat = loadSource('features/analytics/utils/format.ts');
const { getChartYAxisLabels } = loadSource('features/analytics/utils/chart.ts', {
  './format': chartNumberFormat,
  '@/utils/formatCurrency': { formatCurrency },
});

test('chart tooltips use the actual tick value instead of expanding a rounded label', () => {
  const compact = getChartYAxisLabels(1234567.89);
  const exact = getChartYAxisLabels(1234567.89, false);
  assert.deepEqual(exact, ['€2,000,000.00', '€1,500,000.00', '€1,000,000.00', '€500,000.00']);
  const markup = render(useCompact => useCompact ? compact[1] : exact[1]);
  assert.match(markup, /aria-label="€1,500,000\.00"/);
});
