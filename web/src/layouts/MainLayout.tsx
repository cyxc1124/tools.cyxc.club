import type { ReactNode } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

export function MainLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

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
          {!isHome && (
            <nav>
              <Link
                to="/"
                className="px-3 py-1.5 rounded-md text-sm font-medium text-muted hover:text-brand-600 hover:bg-surface transition-colors"
              >
                返回首页
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-4 px-4 text-center text-sm text-muted space-y-1.5">
        <p>
          遇到问题请
          <a
            href="https://github.com/cyxc1124/tools.cyxc.club/issues"
            className="mx-1 hover:text-brand-600 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            提交 Issue
          </a>
        </p>
        <p className="flex items-center justify-center gap-2 flex-wrap">
          <a
            href="https://github.com/cyxc1124/tools.cyxc.club"
            className="hover:text-brand-600 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            GitHub 仓库
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://cyxc.club"
            className="hover:text-brand-600 transition-colors"
            target="_blank"
            rel="noreferrer"
          >
            cyxc.club
          </a>
        </p>
      </footer>
    </div>
  )
}

export function ToolPage({
  title,
  description,
  meta,
  children,
}: {
  title: string
  description?: string
  meta?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-muted max-w-2xl">{description}</p>
        )}
        {meta && <div className="mt-2">{meta}</div>}
      </div>
      {children}
    </div>
  )
}
