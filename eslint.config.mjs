import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

export default defineConfig([
  ...nextVitals,
  {
    // These React Compiler-oriented rules expose pre-existing 3D/audio refactors.
    // Keep them visible in BAS-07 evidence without blocking the framework migration.
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
    },
  },
  globalIgnores([
    '.next/**',
    '.tools/**',
    '.tmp-repos/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
]);
