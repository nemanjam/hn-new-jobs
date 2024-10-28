/** @type {import('prettier').Config} */
module.exports = {
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  importOrder: [
    '^(react/(.*)$)|^(react$)',
    '^(next/(.*)$)|^(next$)',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/config/(.*)$',
    '^@/lib/(.*)$',
    '^@/hooks/(.*)$',
    '^@/components/ui/(.*)$',
    '^@/components/(.*)$',
    '^@/parser/(.*)$',
    '^@/constants/(.*)$',
    '^@/data/(.*)$',
    '^@/styles/(.*)$',
    '^@/assets/(.*)$',
    '^@/app/(.*)$',
    '',
    '^@/types/(.*)$',
    '^types$',
    '',
    '^[./]',
  ],
};