import { spawnSync } from 'child_process';
import path from 'path';

const SCRIPT_PATH = path.join(__dirname, 'enable-auto-merge-error-handler.sh');

function runScript(input: string): { stdout: string; exitCode: number } {
  const result = spawnSync('bash', [SCRIPT_PATH], { input, encoding: 'utf8' });
  return { stdout: result.stdout, exitCode: result.status ?? 1 };
}

describe('enable-auto-merge-error-handler.sh', () => {
  test('exits 0 when response has no errors field', () => {
    const input = JSON.stringify({
      data: { enablePullRequestAutoMerge: { clientMutationId: null } },
    });
    const { exitCode, stdout } = runScript(input);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Auto merge enabled successfully');
  });

  test('exits 0 with warning when error type is RATE_LIMIT', () => {
    const input = JSON.stringify({
      errors: [{ message: 'rate limit exceeded', type: 'RATE_LIMIT' }],
    });
    const { exitCode, stdout } = runScript(input);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 0 with warning when error message contains unstable', () => {
    const input = JSON.stringify({
      errors: [
        { message: 'Pull Request is in unstable state', type: 'UNPROCESSABLE' },
      ],
    });
    const { exitCode, stdout } = runScript(input);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 0 with warning when error message indicates already has auto merge enabled', () => {
    const input = JSON.stringify({
      errors: [
        {
          message: 'Pull Request already has auto merge enabled',
          type: 'UNPROCESSABLE',
        },
      ],
    });
    const { exitCode, stdout } = runScript(input);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 0 with warning when error message contains required protected branch', () => {
    const input = JSON.stringify({
      errors: [
        {
          message:
            'Required statuses must pass before merging on a protected branch',
          type: 'UNPROCESSABLE',
        },
      ],
    });
    const { exitCode, stdout } = runScript(input);
    expect(exitCode).toBe(0);
    expect(stdout).toContain('Warning: could not enable auto merge');
  });

  test('exits 1 when error is unrecognized', () => {
    const input = JSON.stringify({
      errors: [{ message: 'something went wrong', type: 'INTERNAL' }],
    });
    const { exitCode, stdout } = runScript(input);
    expect(exitCode).toBe(1);
    expect(stdout).toContain('Failed to enable auto merge');
  });
});
