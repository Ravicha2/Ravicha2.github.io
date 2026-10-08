import { defineConfig, configDefaults } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    passWithNoTests: true,
    // Linked git worktrees live under .claude/worktrees/ inside the repo, so the
    // default glob collects their test files too and runs a second copy of the
    // suite against whichever checkout the worktree holds. Exclude them: this
    // run should answer for this working tree and nothing else.
    exclude: [...configDefaults.exclude, '**/.claude/**'],
  },
});
