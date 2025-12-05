import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note: javascript-obfuscator applied via build script for better control

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // For local dev, we'll handle API routes differently
        // If using vercel dev, it will handle /api automatically
      }
    }
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace', 'console.warn', 'console.error'],
        passes: 5, // Increased passes
        dead_code: true,
        unused: true,
        collapse_vars: true,
        reduce_vars: true,
        inline: true,
        join_vars: true,
        loops: true,
        booleans: true,
        if_return: true,
        sequences: true,
        properties: true,
        evaluate: true,
        unsafe: false,
        unsafe_comps: false,
        unsafe_math: false,
        unsafe_proto: false,
        unsafe_regexp: false,
        unsafe_undefined: false,
      },
      format: {
        comments: false,
        beautify: false,
        ascii_only: true,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
        toplevel: true,
        reserved: [],
        keep_classnames: false,
        keep_fnames: false,
      },
      keep_classnames: false,
      keep_fnames: false,
    },
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Aggressive code splitting to fragment logic
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('react')) return 'vendor-react';
            return 'vendor-other';
          }
          if (id.includes('utils')) {
            const utilName = id.split('/').pop().replace(/\.(js|jsx)$/, '');
            const hash = utilName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return `util-${hash % 10}`;
          }
          if (id.includes('components')) {
            const componentName = id.split('/').pop().replace(/\.(jsx|js)$/, '');
            const hash = componentName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
            return `comp-${hash % 15}`;
          }
          return 'main';
        },
        // Obfuscate chunk names
        chunkFileNames: 'assets/[hash:12].js',
        entryFileNames: 'assets/[hash:12].js',
        assetFileNames: 'assets/[hash:12].[ext]',
        // Compact output
        compact: true,
      },
    },
  },
  esbuild: {
    legalComments: 'none',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    drop: ['console', 'debugger'],
  },
})
