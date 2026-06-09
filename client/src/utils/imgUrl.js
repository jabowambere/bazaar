const API = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function imgUrl(src) {
  if (!src) return ''
  if (src.startsWith('http')) return src
  if (src.startsWith('/uploads')) return '' // old local uploads no longer exist
  return `${API}${src}`
}
