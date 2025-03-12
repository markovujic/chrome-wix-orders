import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

// Enhanced plugin to copy manifest.json to dist folder
const copyManifest = () => {
  return {
    name: 'copy-manifest',
    // Use closeBundle instead of buildEnd (runs after bundle is complete)
    closeBundle: async () => {
      try {
        const manifestPath = resolve(__dirname, 'manifest.json')
        const destPath = resolve(__dirname, 'dist/manifest.json')
        
        console.log('Checking for manifest.json at:', manifestPath)
        
        if (fs.existsSync(manifestPath)) {
          // Create dist directory if it doesn't exist
          if (!fs.existsSync(resolve(__dirname, 'dist'))) {
            fs.mkdirSync(resolve(__dirname, 'dist'), { recursive: true })
          }
          
          // Copy the file
          fs.copyFileSync(manifestPath, destPath)
          
          // Verify the copy worked
          if (fs.existsSync(destPath)) {
            console.log('✅ manifest.json has been copied to dist folder')
          } else {
            console.error('❌ Copy seemed to succeed but manifest.json not found in dist folder')
          }
        } else {
          console.error('❌ manifest.json not found at:', manifestPath)
        }
      } catch (error) {
        console.error('❌ Error copying manifest.json:', error)
      }
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    copyManifest()
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html'
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`
      }
    }
  }
})