import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type GlobFunction = (
  pattern: string,
  options: { cwd: string; dot?: boolean; ignore?: string[] },
) => string[];

type TestExcludeOptions = {
  cwd: string;
  include: string[];
  exclude: string[];
  extension: string[];
};

type TestExcludeInstance = {
  globSync: (cwd: string) => string[];
  shouldInstrument: (filename: string) => boolean;
};

type MinimatchModule = {
  Minimatch: unknown;
  GLOBSTAR: unknown;
  escape: unknown;
  unescape: unknown;
};

const fixtureFiles: readonly string[] = [
  'src/index.ts',
  'src/util/format.ts',
  'src/util/format.test.ts',
  'src/deep/a/b/c.ts',
  'lib/index.js',
  '.hidden/secret.ts',
  'README.md',
];

const globDirectory = path.dirname(require.resolve('glob/package.json'));
const testExcludeDirectory = path.dirname(
  require.resolve('test-exclude/package.json'),
);

const createFixtureDirectory = (): string => {
  const fixtureDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'minimatch-override-compatibility-'),
  );
  for (const relativePath of fixtureFiles) {
    const absolutePath = path.join(fixtureDirectory, relativePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, '');
  }
  return fixtureDirectory;
};

describe('forced minimatch compatibility for glob and test-exclude', () => {
  let fixtureDirectory: string;

  beforeAll(() => {
    fixtureDirectory = createFixtureDirectory();
  });

  afterAll(() => {
    fs.rmSync(fixtureDirectory, { recursive: true, force: true });
  });

  test('glob runtime imports resolve to the forced minimatch and export the symbols glob uses', () => {
    const minimatchPath = require.resolve('minimatch', {
      paths: [globDirectory],
    });
    expect(
      minimatchPath.startsWith(
        path.join(globDirectory, 'node_modules', 'minimatch') + path.sep,
      ),
    ).toBe(true);
    const minimatch = require(minimatchPath) as MinimatchModule;
    expect(typeof minimatch.Minimatch).toBe('function');
    expect(typeof minimatch.GLOBSTAR).toBe('symbol');
    expect(typeof minimatch.escape).toBe('function');
    expect(typeof minimatch.unescape).toBe('function');
  });

  test('glob 13 (root copy) returns the expected file lists under the forced minimatch', () => {
    const { globSync } = require('glob') as { globSync: GlobFunction };
    const cases: Array<{
      pattern: string;
      options: { dot?: boolean; ignore?: string[] };
      expected: string[];
    }> = [
      {
        pattern: '**/*.ts',
        options: {},
        expected: [
          'src/deep/a/b/c.ts',
          'src/index.ts',
          'src/util/format.test.ts',
          'src/util/format.ts',
        ],
      },
      {
        pattern: '**/*.ts',
        options: { dot: true },
        expected: [
          '.hidden/secret.ts',
          'src/deep/a/b/c.ts',
          'src/index.ts',
          'src/util/format.test.ts',
          'src/util/format.ts',
        ],
      },
      {
        pattern: 'src/{util,deep}/**/*.ts',
        options: {},
        expected: [
          'src/deep/a/b/c.ts',
          'src/util/format.test.ts',
          'src/util/format.ts',
        ],
      },
      {
        pattern: '**/*.{js,md}',
        options: {},
        expected: ['README.md', 'lib/index.js'],
      },
      {
        pattern: '**/*.ts',
        options: { ignore: ['**/*.test.ts'] },
        expected: ['src/deep/a/b/c.ts', 'src/index.ts', 'src/util/format.ts'],
      },
    ];
    for (const testCase of cases) {
      const actual = globSync(testCase.pattern, {
        cwd: fixtureDirectory,
        ...testCase.options,
      });
      expect({
        pattern: testCase.pattern,
        options: testCase.options,
        files: [...actual].sort(),
      }).toEqual({
        pattern: testCase.pattern,
        options: testCase.options,
        files: testCase.expected,
      });
    }
  });

  test('test-exclude glob matching under the forced minimatch returns the expected file lists', () => {
    const TestExclude = require('test-exclude') as new (
      options: TestExcludeOptions,
    ) => TestExcludeInstance;
    const cases: Array<{
      include: string[];
      exclude: string[];
      expected: string[];
    }> = [
      {
        include: ['src/**'],
        exclude: ['**/*.test.ts'],
        expected: ['src/deep/a/b/c.ts', 'src/index.ts', 'src/util/format.ts'],
      },
      {
        include: ['src/**'],
        exclude: [],
        expected: [
          'src/deep/a/b/c.ts',
          'src/index.ts',
          'src/util/format.test.ts',
          'src/util/format.ts',
        ],
      },
    ];
    for (const testCase of cases) {
      const testExclude = new TestExclude({
        cwd: fixtureDirectory,
        include: testCase.include,
        exclude: testCase.exclude,
        extension: ['.ts'],
      });
      const actual = testExclude.globSync(fixtureDirectory);
      expect({
        include: testCase.include,
        exclude: testCase.exclude,
        files: [...actual].sort(),
      }).toEqual({
        include: testCase.include,
        exclude: testCase.exclude,
        files: testCase.expected,
      });
    }
  });

  test('test-exclude shouldInstrument decisions under the forced minimatch', () => {
    const TestExclude = require('test-exclude') as new (
      options: TestExcludeOptions,
    ) => TestExcludeInstance;
    const testExclude = new TestExclude({
      cwd: fixtureDirectory,
      include: ['src/**'],
      exclude: ['**/*.test.ts'],
      extension: ['.ts'],
    });
    const cases: Array<{ relativePath: string; expected: boolean }> = [
      { relativePath: 'src/index.ts', expected: true },
      { relativePath: 'src/util/format.test.ts', expected: false },
      { relativePath: 'lib/index.js', expected: false },
    ];
    for (const testCase of cases) {
      expect({
        relativePath: testCase.relativePath,
        instrument: testExclude.shouldInstrument(
          path.join(fixtureDirectory, testCase.relativePath),
        ),
      }).toEqual({
        relativePath: testCase.relativePath,
        instrument: testCase.expected,
      });
    }
  });

  test('test-exclude resolves glob to the same copy the glob 13 tests exercise, on the forced minimatch', () => {
    const testExcludeGlobDirectory = path.dirname(
      require.resolve('glob/package.json', { paths: [testExcludeDirectory] }),
    );
    const testExcludeMinimatchPath = require.resolve('minimatch', {
      paths: [testExcludeDirectory],
    });
    const globMinimatchPath = require.resolve('minimatch', {
      paths: [testExcludeGlobDirectory],
    });
    expect({
      testExcludeGlobIsRootGlob: testExcludeGlobDirectory === globDirectory,
      testExcludeMinimatch: testExcludeMinimatchPath.startsWith(
        path.join(testExcludeDirectory, 'node_modules', 'minimatch') + path.sep,
      ),
      globMinimatch: globMinimatchPath.startsWith(
        path.join(globDirectory, 'node_modules', 'minimatch') + path.sep,
      ),
    }).toEqual({
      testExcludeGlobIsRootGlob: true,
      testExcludeMinimatch: true,
      globMinimatch: true,
    });
  });
});
