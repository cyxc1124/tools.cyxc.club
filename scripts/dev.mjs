import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const backends = JSON.parse(
  readFileSync(path.join(root, 'dev/backends.json'), 'utf8'),
) as { api?: number }

const apiPort = backends.api ?? 8080
const apiDir = path.join(root, 'services', 'api')
const children = []

function run(name, command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options,
  })
  child.on('error', (err) => {
    console.error(`[${name}] failed to start:`, err.message)
  })
  children.push(child)
  return child
}

console.log('Starting API coordinator (services/api)…')
run(
  'api',
  'uvicorn',
  ['app.main:app', '--reload', '--host', '127.0.0.1', '--port', String(apiPort)],
  { cwd: apiDir },
)

console.log('Starting Vite dev server…')
console.log('')
console.log('  本地访问（任选其一）：')
console.log('    http://localhost:5173')
console.log('    http://tools.cyxc.club:5173  （需 hosts: 127.0.0.1 tools.cyxc.club）')
console.log('')
console.log('  API 协调入口：')
console.log(`    http://localhost:${apiPort}/api/docs`)
console.log('')
console.log('  无端口访问 http://tools.cyxc.club 请额外运行：')
console.log('    caddy run --config dev/Caddyfile')
console.log('')

run('vite', 'npm', ['run', 'dev'], { cwd: path.join(root, 'web') })

function shutdown() {
  for (const child of children) {
    child.kill('SIGTERM')
  }
  process.exit(0)
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
