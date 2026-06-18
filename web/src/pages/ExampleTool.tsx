import { useEffect, useState } from 'react'
import { createToolClient } from '@/api/client'
import { ToolPage } from '@/layouts/MainLayout'
import { getApiPrefix, getToolById } from '@/tools/registry'

const client = createToolClient(getApiPrefix(getToolById('example')!))

interface HealthResponse {
  status: string
  service: string
  message?: string
}

export function ExampleToolPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await client.get<HealthResponse>('/v1/health')
        if (!cancelled) setHealth(data)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '请求失败')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <ToolPage
      title="示例工具"
      description="调用 /api/example/v1/health 验证前后端连通性。"
    >
      <div className="rounded-xl border border-border bg-surface-elevated p-6">
        {loading && <p className="text-muted">正在连接后端…</p>}
        {error && (
          <p className="text-red-600 text-sm">
            后端不可用：{error}
            <br />
            <span className="text-muted">
              本地开发请运行 <code>npm run dev</code>（根目录，同时启动前端与后端）。
            </span>
          </p>
        )}
        {health && (
          <dl className="grid gap-2 text-sm">
            <div className="flex gap-2">
              <dt className="text-muted">status</dt>
              <dd className="font-mono">{health.status}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted">service</dt>
              <dd className="font-mono">{health.service}</dd>
            </div>
            {health.message && (
              <div className="flex gap-2">
                <dt className="text-muted">message</dt>
                <dd>{health.message}</dd>
              </div>
            )}
          </dl>
        )}
      </div>
    </ToolPage>
  )
}
