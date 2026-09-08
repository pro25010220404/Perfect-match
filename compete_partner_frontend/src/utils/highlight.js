const HTML_ESCAPE = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => HTML_ESCAPE[c])
}

// 把文本中命中的关键词包成 <mark>，返回安全的 HTML 字符串（用于 v-html）
export function highlightMatch(text, keyword) {
  if (!text || !keyword) return escapeHtml(text || '')
  const escaped = escapeHtml(text)
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escapedKeyword, 'gi')
  return escaped.replace(regex, (m) => `<mark>${m}</mark>`)
}
