import type { ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { tools } from '@/tools/registry'

export function MainLayout() {
  const location = useLocation()

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="border-b border-border bg-surface-elevated">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight text-brand-600 hover:text-brand-500 transition-colors"
          >
            tools.cyxc.club
          </Link>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {tools.map((tool) => {
              const active = location.pathname.startsWith(tool.path)
              return (
                <Link
                  key={tool.id}
                  to={tool.path}
                  className={[
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    active
                      ? 'bg-brand-500 text-white'
                      : 'text-muted hover:text-brand-600 hover:bg-surface',
                  ].join(' ')}
                >
                  {tool.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-4 text-center text-sm text-muted">
        <a
          href="https://cyxc.club"
          className="hover:text-brand-600 transition-colors"
          target="_blank"
          rel="noreferrer"
        >
          cyxc.club
        </a>
      </footer>
    </div>
  )
}

export function ToolPage({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-muted max-w-2xl">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}
