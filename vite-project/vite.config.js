import { defineConfig } from 'vite';

export default defineConfig({
  // ...other configuration options
  build: {
    outDir: 'dist', // Output directory
    assetsDir: 'assets', // Directory for assets like JS files
  },
  // Copy the enterprise.glb file to the build assets directory
  assetsInclude: ['**/*.glb'],
});
