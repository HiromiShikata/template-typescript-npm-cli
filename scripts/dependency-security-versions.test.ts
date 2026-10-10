describe('dependency security versions', () => {
  test('brace-expansion version is at least 5.0.12', () => {
    const braceExpansionVersion: string =
      require('brace-expansion/package.json').version;
    const [major, minor, patch] = braceExpansionVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 5 ||
      (major === 5 && minor > 0) ||
      (major === 5 && minor === 0 && patch >= 12);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('undici version is at least 6.28.1', () => {
    const undiciVersion: string = require('undici/package.json').version;
    const [major, minor, patch] = undiciVersion.split('.').map(Number);
    const isAtLeastMinimumVersion =
      major > 6 ||
      (major === 6 && minor > 28) ||
      (major === 6 && minor === 28 && patch >= 1);
    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('handlebars version is at least 4.7.10', () => {
    const handlebarsVersion: string =
      require('handlebars/package.json').version;
    const [major, minor, patch] = handlebarsVersion.split('.').map(Number);

    const isAtLeastMinimumVersion =
      major > 4 ||
      (major === 4 && minor > 7) ||
      (major === 4 && minor === 7 && patch >= 10);

    expect(isAtLeastMinimumVersion).toBe(true);
  });

  test('@semantic-release/npm is listed under devDependencies and not dependencies', () => {
    const rootPackageJson: {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    } = require('../package.json');

    expect(rootPackageJson.dependencies).not.toHaveProperty(
      '@semantic-release/npm',
    );
    expect(rootPackageJson.devDependencies).toHaveProperty(
      '@semantic-release/npm',
    );
  });
});
