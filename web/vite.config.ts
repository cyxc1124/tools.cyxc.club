import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** 将 /api 代理到本地 API 协调服务（端口见 dev/backends.json） */
function loadDevProxy(): Record<string, { target: string; changeOrigin: boolean }> {
  const backendsPath = resolve(__dirname, '../dev/backends.json')
  let port = 8080
  try {
    const backends = JSON.parse(readFileSync(backendsPath, 'utf8')) as {
      api?: number
    }
    port = backends.api ?? 8080
  } catch {
    // 默认端口
  }
  return {
    '/api': {
      target: `http://127.0.0.1:${port}`,
      changeOrigin: true,
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    allowedHosts: ['tools.cyxc.club', 'localhost', '127.0.0.1'],
    proxy: loadDevProxy(),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
