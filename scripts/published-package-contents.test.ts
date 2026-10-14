import { spawnSync } from 'child_process';
import path from 'path';

const REPO_ROOT = path.join(__dirname, '..');

function runNpmPackDryRun(): {
  combinedOutput: string;
  exitCode: number;
} {
  const result = spawnSync('npm', ['pack', '--dry-run'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return {
    combinedOutput: result.stdout + result.stderr,
    exitCode: result.status ?? 1,
  };
}

function extractTypesPackagePaths(combinedOutput: string): string[] {
  const matches = combinedOutput.match(/types\/\S+/g);
  return matches ?? [];
}

describe('published package contents', () => {
  test('npm pack --dry-run lists no types/src/ path and exactly the four built types/ files', () => {
    const { exitCode, combinedOutput } = runNpmPackDryRun();
    expect(exitCode).toBe(0);

    const typesPackagePaths = extractTypesPackagePaths(combinedOutput);
    const typesSrcPackagePaths = typesPackagePaths.filter((packagePath) =>
      packagePath.startsWith('types/src/'),
    );
    expect(typesSrcPackagePaths).toEqual([]);

    const expectedBuiltTypesPackagePaths = [
      'types/adapter/entry-points/cli/index.d.ts',
      'types/adapter/entry-points/cli/index.d.ts.map',
      'types/index.d.ts',
      'types/index.d.ts.map',
    ];
    expect([...typesPackagePaths].sort()).toEqual(
      [...expectedBuiltTypesPackagePaths].sort(),
    );
  });
});
