import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 读取 .env，让代理和代码里的 VITE_API_BASE_URL 保持一致（单一数据源）
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_API_BASE_URL || 'http://j5ca696f.natappfree.cc'

  return {
    plugins: [vue()],
    server: {
      port: 3000,
      open: true,
      proxy: {
        // 开发环境：前端请求 /api/* 时转发到后端，避免跨域
        '/api': {
          target: apiTarget,
          changeOrigin: true
        }
      }
    }
  }
})
