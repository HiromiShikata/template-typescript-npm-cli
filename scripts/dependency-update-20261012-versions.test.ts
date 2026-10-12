import * as fs from 'fs';
import * as path from 'path';

describe('dependency update 20261012 versions', () => {
  test('@semantic-release/npm version is at least 13.2.0', () => {
    const semanticReleaseNpmPackageJsonPath = path.join(
      __dirname,
      '..',
      'node_modules',
      '@semantic-release',
      'npm',
      'package.json',
    );
    const semanticReleaseNpmVersion: string = JSON.parse(
      fs.readFileSync(semanticReleaseNpmPackageJsonPath, 'utf-8'),
    ).version;
    const [major, minor, patch] = semanticReleaseNpmVersion
      .split('.')
      .map(Number);
    const isAtLeastMinimumVersion =
      major > 13 ||
      (major === 13 && minor > 2) ||
      (major === 13 && minor === 2 && patch >= 0);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('@typescript-eslint/eslint-plugin version is at least 8.71.1', () => {
    const typescriptEslintEslintPluginVersion: string =
      require('@typescript-eslint/eslint-plugin/package.json').version;
    const [major, minor, patch] = typescriptEslintEslintPluginVersion
      .split('.')
      .map(Number);
    const isAtLeastMinimumVersion =
      major > 8 ||
      (major === 8 && minor > 71) ||
      (major === 8 && minor === 71 && patch >= 1);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('@typescript-eslint/parser version is at least 8.71.1', () => {
    const typescriptEslintParserVersion: string =
      require('@typescript-eslint/parser/package.json').version;
    const [major, minor, patch] = typescriptEslintParserVersion
      .split('.')
      .map(Number);
    const isAtLeastMinimumVersion =
      major > 8 ||
      (major === 8 && minor > 71) ||
      (major === 8 && minor === 71 && patch >= 1);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('conventional-changelog-conventionalcommits version is at least 10.4.1', () => {
    const conventionalChangelogConventionalcommitsPackageJsonPath = path.join(
      __dirname,
      '..',
      'node_modules',
      'conventional-changelog-conventionalcommits',
      'package.json',
    );
    const conventionalChangelogConventionalcommitsVersion: string = JSON.parse(
      fs.readFileSync(
        conventionalChangelogConventionalcommitsPackageJsonPath,
        'utf-8',
      ),
    ).version;
    const [major, minor, patch] =
      conventionalChangelogConventionalcommitsVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 10 ||
      (major === 10 && minor > 4) ||
      (major === 10 && minor === 4 && patch >= 1);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('dotenv version is at least 18.0.5', () => {
    const dotenvVersion: string = require('dotenv/package.json').version;
    const [major, minor, patch] = dotenvVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 18 ||
      (major === 18 && minor > 0) ||
      (major === 18 && minor === 0 && patch >= 5);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('eslint version is at least 10.12.0', () => {
    const eslintVersion: string = require('eslint/package.json').version;
    const [major, minor, patch] = eslintVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 10 ||
      (major === 10 && minor > 12) ||
      (major === 10 && minor === 12 && patch >= 0);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('prettier version is at least 3.9.9', () => {
    const prettierVersion: string = require('prettier/package.json').version;
    const [major, minor, patch] = prettierVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 3 ||
      (major === 3 && minor > 9) ||
      (major === 3 && minor === 9 && patch >= 9);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('ts-jest version is at least 29.4.14', () => {
    const tsJestVersion: string = require('ts-jest/package.json').version;
    const [major, minor, patch] = tsJestVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 29 ||
      (major === 29 && minor > 4) ||
      (major === 29 && minor === 4 && patch >= 14);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('typescript-eslint version is at least 8.71.1', () => {
    const typescriptEslintVersion: string =
      require('typescript-eslint/package.json').version;
    const [major, minor, patch] = typescriptEslintVersion
      .split('.')
      .map(Number);
    const isAtLeastMinimumVersion =
      major > 8 ||
      (major === 8 && minor > 71) ||
      (major === 8 && minor === 71 && patch >= 1);
    expect(isAtLeastMinimumVersion).toBe(true);
  });
});
