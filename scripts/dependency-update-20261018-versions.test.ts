import * as fs from 'fs';
import * as path from 'path';

type PackageMinimumVersion = {
  packageName: string;
  minimumVersion: string;
};

type PackageLockFile = {
  packages: Record<string, { version: string } | undefined>;
};

type InstalledPackageManifest = {
  version: string;
};

const packageMinimumVersions: PackageMinimumVersion[] = [
  { packageName: 'dotenv', minimumVersion: '18.0.7' },
  { packageName: 'prettier', minimumVersion: '3.9.10' },
];

const repositoryRootPath = path.join(__dirname, '..');

const parseVersionSegments = (version: string): number[] =>
  version.split('.').map(Number);

const isVersionAtLeast = (version: string, minimumVersion: string): boolean => {
  const versionSegments = parseVersionSegments(version);
  const minimumVersionSegments = parseVersionSegments(minimumVersion);
  for (let index = 0; index < minimumVersionSegments.length; index++) {
    const segmentDifference =
      (versionSegments[index] ?? 0) - minimumVersionSegments[index];
    if (segmentDifference !== 0) {
      return segmentDifference > 0;
    }
  }
  return true;
};

describe('dependency update 20261018 versions', () => {
  test('version comparison treats segments as numbers, not text', () => {
    const comparisonCases: {
      version: string;
      minimumVersion: string;
      isAtLeast: boolean;
    }[] = [
      { version: '18.0.7', minimumVersion: '18.0.7', isAtLeast: true },
      { version: '18.0.6', minimumVersion: '18.0.7', isAtLeast: false },
      { version: '18.1.0', minimumVersion: '18.0.7', isAtLeast: true },
      { version: '19.0.0', minimumVersion: '18.0.7', isAtLeast: true },
      { version: '17.9.9', minimumVersion: '18.0.7', isAtLeast: false },
      { version: '3.9.9', minimumVersion: '3.9.10', isAtLeast: false },
      { version: '3.9.10', minimumVersion: '3.9.10', isAtLeast: true },
      { version: '3.10.0', minimumVersion: '3.9.10', isAtLeast: true },
    ];

    const actualComparisons = comparisonCases.map(
      ({ version, minimumVersion }) => ({
        version,
        minimumVersion,
        isAtLeast: isVersionAtLeast(version, minimumVersion),
      }),
    );

    expect(actualComparisons).toEqual(comparisonCases);
  });

  test('package-lock.json resolves dotenv and prettier at or above their updated versions', () => {
    const packageLockFile: PackageLockFile = JSON.parse(
      fs.readFileSync(
        path.join(repositoryRootPath, 'package-lock.json'),
        'utf-8',
      ),
    );

    const packagesBelowMinimumVersion = packageMinimumVersions
      .map(({ packageName, minimumVersion }) => ({
        packageName,
        minimumVersion,
        resolvedVersion:
          packageLockFile.packages[`node_modules/${packageName}`]?.version ??
          null,
      }))
      .filter(
        ({ minimumVersion, resolvedVersion }) =>
          resolvedVersion === null ||
          !isVersionAtLeast(resolvedVersion, minimumVersion),
      );

    expect(packagesBelowMinimumVersion).toEqual([]);
  });

  test('installed dotenv and prettier are at or above their updated versions', () => {
    const packagesBelowMinimumVersion = packageMinimumVersions
      .map(({ packageName, minimumVersion }) => {
        const installedPackageManifest: InstalledPackageManifest = JSON.parse(
          fs.readFileSync(
            path.join(
              repositoryRootPath,
              'node_modules',
              packageName,
              'package.json',
            ),
            'utf-8',
          ),
        );
        return {
          packageName,
          minimumVersion,
          installedVersion: installedPackageManifest.version,
        };
      })
      .filter(
        ({ minimumVersion, installedVersion }) =>
          !isVersionAtLeast(installedVersion, minimumVersion),
      );

    expect(packagesBelowMinimumVersion).toEqual([]);
  });
});
