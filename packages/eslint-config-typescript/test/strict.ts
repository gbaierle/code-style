import { describe, it } from 'node:test';
import { join } from 'node:path';
import { initESLint } from '@code-style/utils/testing/eslint';
import {
  testNoFail,
  testRuleFail,
} from '@code-style/utils/testing/eslint/tests';
import { defaultTestSet } from '@code-style/utils/testing/eslint/default-test-sets';

const linter = initESLint(
  {
    extends: [
      '@code-style/eslint-config',
      '@code-style/eslint-config-esmodule',
      '@code-style/eslint-config-typescript',
    ],
  },
  { cwd: join(__dirname, 'fixture') },
);

void describe('eslint-config-typescript strict', () => {
  defaultTestSet(linter);

  void describe('passes', () => {
    void it(`should parse typescript`, () =>
      testNoFail({
        linter,
        files: [
          {
            code: `((a: string): string[] => a.split(''))()\n`,
            ts: true,
          },
        ],
      }));

    void it(`should not give eslint error on use before define`, () =>
      testNoFail({
        linter,
        files: [{ code: `Number(a);\nconst a = 10;\n`, ts: true }],
      }));

    void it(`should import`, () =>
      testNoFail({
        linter,
        files: [
          { code: `import { a } from './utils';\n\na();\n`, ts: true },
          {
            code: `export function a () {\n  return 1;\n}\n`,
            path: 'utils.ts',
          },
        ],
      }));
  });

  void describe('fails', () => {
    void it(`should fail radix`, async () =>
      testRuleFail({
        linter,
        ruleId: 'radix',
        files: [{ code: `parseInt('10');\n`, ts: true }],
      }));

    void it(`should fail @typescript-eslint/strict-boolean-expressions string`, async () =>
      testRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: `let foo = 'foo';\nfoo = 'bar';\nif (foo) Number();\n`,
            ts: true,
          },
        ],
      }));

    void it(`should fail @typescript-eslint/strict-boolean-expressions unknown`, async () =>
      testRuleFail({
        linter,
        ruleId: '@typescript-eslint/strict-boolean-expressions',
        files: [
          {
            code: `let foo: unknown = 'foo';\nfoo = 'bar';\nif (foo) Number();\n`,
            ts: true,
          },
        ],
      }));
  });
});