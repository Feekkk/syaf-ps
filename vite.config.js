import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
]

const contentSecurityPolicy = cspDirectives.join('; ')

const metaContentSecurityPolicy = cspDirectives
  .filter((directive) => !directive.startsWith('frame-ancestors'))
  .join('; ')

function contentSecurityPolicyPlugin() {
  return {
    name: 'content-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        if (html.includes('Content-Security-Policy')) return html
        const meta = `    <meta http-equiv="Content-Security-Policy" content="${metaContentSecurityPolicy}" />\n`
        return html.replace('<head>', `<head>\n${meta}`)
      },
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: `/*\n  Content-Security-Policy: ${contentSecurityPolicy}\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), contentSecurityPolicyPlugin()],
  preview: {
    headers: {
      'Content-Security-Policy': contentSecurityPolicy,
    },
  },
})
