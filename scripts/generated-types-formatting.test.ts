import { spawnSync } from 'child_process';
import path from 'path';

const REPO_ROOT = path.join(__dirname, '..');

function runPrettierCheck(files: string[]): {
  stdout: string;
  exitCode: number;
} {
  const result = spawnSync('npx', ['prettier', '--check', ...files], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  return {
    stdout: result.stdout + result.stderr,
    exitCode: result.status ?? 1,
  };
}

describe('generated .d.ts files formatting', () => {
  test('types/index.d.ts matches npm run fmt output', () => {
    const { exitCode, stdout } = runPrettierCheck(['types/index.d.ts']);
    expect(exitCode).toBe(0);
    expect(stdout).not.toContain('types/index.d.ts');
  });

  test('types/adapter/entry-points/cli/index.d.ts matches npm run fmt output', () => {
    const { exitCode, stdout } = runPrettierCheck([
      'types/adapter/entry-points/cli/index.d.ts',
    ]);
    expect(exitCode).toBe(0);
    expect(stdout).not.toContain('types/adapter/entry-points/cli/index.d.ts');
  });

  test('npm run fmt produces no further diff for either generated .d.ts file', () => {
    const { exitCode, stdout } = runPrettierCheck([
      'types/index.d.ts',
      'types/adapter/entry-points/cli/index.d.ts',
    ]);
    expect(exitCode).toBe(0);
    expect(stdout).not.toContain('types/index.d.ts');
    expect(stdout).not.toContain('types/adapter/entry-points/cli/index.d.ts');
  });
});
