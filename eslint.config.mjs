import eslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import importX from 'eslint-plugin-import-x';
import unusedImports from 'eslint-plugin-unused-imports';
import { readFileSync } from 'fs';

const gitignorePatterns = readFileSync('.gitignore', 'utf8')
  .split('\n')
  .filter(Boolean);

export default tsEslint.config(
  { ignores: gitignorePatterns },
  eslint.configs.recommended,
  tsEslint.configs.recommendedTypeChecked,
  {
    plugins: {
      'import-x': importX,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            { target: './src/domain', from: './src/adapter' },
            { target: './src/domain/entities', from: './src/domain/usecases' },
            {
              target: './src/adapter/repositories',
              from: './src/adapter/entry-points',
            },
          ],
        },
      ],
      'unused-imports/no-unused-imports': 'error',
    },
  },
);
