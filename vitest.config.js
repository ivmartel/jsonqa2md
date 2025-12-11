import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      './vitest/**/*.test.js'
    ],
    reporters: ['tree', 'json'],
    outputFile: './build/test-results.json'
  }
});
