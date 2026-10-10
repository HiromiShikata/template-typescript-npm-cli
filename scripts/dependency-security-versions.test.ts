describe('dependency security versions', () => {
  test('brace-expansion version is at least 5.0.12', () => {
    const braceExpansionVersion: string = require('brace-expansion/package.json').version;
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
});
