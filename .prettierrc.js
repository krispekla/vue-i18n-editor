module.exports = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'consistent',
  trailingComma: 'es5',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  proseWrap: 'never',
  endOfLine: 'crlf',
  htmlWhitespaceSensitivity: 'strict',
  overrides: [
    {
      files: '*.{service,config}.js',
      options: {
        printWidth: 120,
      },
    },
  ],
}
