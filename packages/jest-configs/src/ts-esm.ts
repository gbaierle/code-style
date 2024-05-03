import type { JestConfigWithTsJest } from 'ts-jest';
import { config as base } from './base';

export const config: JestConfigWithTsJest = {
  ...base,
  preset: 'ts-jest/presets/default-esm',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
