// @ts-nocheck
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Parse allowed hosts from environment variable
// No hardcoded defaults - everything comes from environment
const allowedHostsEnv = process.env.VITE_ALLOWED_HOSTS || ''
const allowedHosts = allowedHostsEnv.split(',').map(host => host.trim()).filter(Boolean)

console.log('Vite allowed hosts:', allowedHosts)

// https://vite.dev/config/
export default defineConfig(async () => {
  let tailwindPlugin: any = null
  try {
    const tailwindModule = await import('@tailwindcss/vite')
    tailwindPlugin = tailwindModule.default()
  } catch (error) {
    console.warn('Tailwind CSS plugin disabled:', error)
  }

  return {
    plugins: [react(), tailwindPlugin].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Expose DEPLOYMENT_MODE to the browser as import.meta.env.DEPLOYMENT_MODE
    define: {
      'import.meta.env.DEPLOYMENT_MODE': JSON.stringify(process.env.DEPLOYMENT_MODE || 'docker'),
    },
    server: {
      host: true,
      allowedHosts,
      watch: {
        usePolling: true,
        interval: 300,
      },
      hmr: {
        host: process.env.APP_DOMAIN || 'localhost',
        protocol: process.env.APP_PROTOCOL === 'https' ? 'wss' : 'ws',
        port: process.env.APP_PROTOCOL === 'https' ? 443 : parseInt(process.env.FRONTEND_PORT || '5173'),
      },
      proxy: {
        '/api': {
          target: 'http://orchestrator:8000',
          changeOrigin: true,
          ws: true,
          configure: (proxy, options) => {
            proxy.on('error', (err) => {
              console.log('proxy error', err)
            })
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('Proxying:', req.method, req.url, '→', options.target + req.url)
            })
            proxy.on('proxyReqWs', (proxyReq, req) => {
              console.log('Proxying WebSocket:', req.url)
            })
          }
        },
        '/ws': {
          target: 'http://orchestrator:8000',
          ws: true,
          changeOrigin: true,
        }
      }
    }
  }
})
