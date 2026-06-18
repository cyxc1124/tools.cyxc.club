import { Link } from 'react-router-dom'
import { tools } from '@/tools/registry'

export function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold tracking-tight">在线工具集</h1>
        <p className="mt-3 text-muted max-w-2xl">
          统一前端入口，各工具按需对接独立后端服务。所有 API 与页面均通过
          <code className="mx-1 px-1.5 py-0.5 rounded bg-surface text-sm">
            tools.cyxc.club
          </code>
          同域访问。
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="group block rounded-xl border border-border bg-surface-elevated p-5 hover:border-brand-500 hover:shadow-sm transition-all"
          >
            <h2 className="text-lg font-medium group-hover:text-brand-600 transition-colors">
              {tool.name}
            </h2>
            <p className="mt-2 text-sm text-muted">{tool.description}</p>
            {tool.tags && tool.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {tool.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full text-xs bg-surface text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </section>
    </div>
  )
}
