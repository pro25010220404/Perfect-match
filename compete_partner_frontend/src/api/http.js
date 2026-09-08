// 统一 HTTP 请求封装：基于后端接口地址（.env 的 VITE_API_BASE_URL）
// 后端契约见 docs/COMPETITION_API.md、docs/CHAT_API.md
// 鉴权：Laravel Sanctum，Authorization: Bearer <token>

const BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

// token 存储 key（与 stores/user.js 登录流程配合）
const TOKEN_KEY = 'saida-token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

function buildUrl(path) {
  // 已带协议或 http.js 未配置 base url 时按相对路径请求（开发环境走 vite 代理）
  if (/^https?:\/\//.test(path)) return path
  return `${BASE_URL}${path}`
}

async function request(path, { method = 'GET', body, headers = {}, ...rest } = {}) {
  const token = getToken()
  const hasBody = body !== undefined

  const res = await fetch(buildUrl(path), {
    method,
    headers: {
      Accept: 'application/json',
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
    ...rest
  })

  const data = res.status === 204 ? null : await res.json().catch(() => null)

  if (!res.ok) {
    const err = new Error(data?.message || `请求失败（${res.status}）`)
    err.status = res.status
    err.data = data
    throw err
  }

  return data
}

export const http = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' })
}

export default http
