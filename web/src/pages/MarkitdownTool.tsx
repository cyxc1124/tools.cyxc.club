import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError, apiFetch } from '@/api/client'
import { ToolPage } from '@/layouts/MainLayout'
import { apiPrefixFor } from '@/tools/api-prefix'

const API_PREFIX = apiPrefixFor('markitdown')
const MAX_FILE_SIZE = 50 * 1024 * 1024

interface ConvertResponse {
  markdown: string
  title?: string | null
  filename?: string | null
}

interface SupportedFormatsResponse {
  formats: string[]
  description: string
  library_name: string
  library_version: string
  library_url: string
}

async function convertFile(file: File): Promise<ConvertResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return apiFetch<ConvertResponse>(`${API_PREFIX}/v1/convert`, {
    method: 'POST',
    body: formData,
  })
}

async function convertUrl(url: string): Promise<ConvertResponse> {
  return apiFetch<ConvertResponse>(`${API_PREFIX}/v1/convert-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
}

function formatError(error: unknown): string {
  if (error instanceof ApiError) {
    const body = error.body as { detail?: string | unknown[] } | undefined
    if (typeof body?.detail === 'string') return body.detail
    if (Array.isArray(body?.detail)) {
      return body.detail.map((item) => JSON.stringify(item)).join('; ')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return '请求失败'
}

export function MarkitdownToolPage() {
  const [formats, setFormats] = useState<SupportedFormatsResponse | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [result, setResult] = useState<ConvertResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    apiFetch<SupportedFormatsResponse>(`${API_PREFIX}/v1/formats`)
      .then((data) => {
        if (!cancelled) setFormats(data)
      })
      .catch(() => {
        /* 格式列表非关键路径 */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return `文件大小超过限制（最大 ${MAX_FILE_SIZE / (1024 * 1024)} MB）`
    }
    return null
  }, [])

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
      setSelectedFile(file)
      setError(null)
      setResult(null)
    },
    [validateFile],
  )

  const handleConvertFile = async () => {
    if (!selectedFile) return
    setLoading(true)
    setError(null)
    try {
      const data = await convertFile(selectedFile)
      setResult(data)
    } catch (e) {
      setError(formatError(e))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleConvertUrl = async () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    try {
      const data = await convertUrl(trimmed)
      setResult(data)
    } catch (e) {
      setError(formatError(e))
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result?.markdown) return
    await navigator.clipboard.writeText(result.markdown)
  }

  const handleDownload = () => {
    if (!result?.markdown) return
    const baseName =
      result.filename?.replace(/\.[^.]+$/, '') ||
      result.title ||
      'converted'
    const blob = new Blob([result.markdown], { type: 'text/markdown' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${baseName}.md`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  return (
    <ToolPage
      title="MarkItDown"
      description="将 PDF、Word、Excel、PPT、图片等文件转换为 Markdown，也可通过 URL 转换网页或在线资源。"
      meta={
        formats && (
          <p className="text-sm text-muted">
            基于开源项目{' '}
            <a
              href={formats.library_url}
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 hover:text-brand-500 transition-colors"
            >
              {formats.library_name}
            </a>
            {' '}
            <span className="font-mono">v{formats.library_version}</span>
          </p>
        )
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左侧：输入区 */}
        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
            className={[
              'rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
              dragOver
                ? 'border-brand-500 bg-brand-500/5'
                : 'border-border hover:border-brand-500/50 hover:bg-surface-elevated',
            ].join(' ')}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileSelect(file)
                e.target.value = ''
              }}
            />
            <p className="text-sm font-medium">点击或拖拽文件到此处</p>
            <p className="mt-1 text-xs text-muted">
              最大 {MAX_FILE_SIZE / (1024 * 1024)} MB
            </p>
            {selectedFile && (
              <p className="mt-3 text-sm text-brand-600 font-mono">
                {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!selectedFile || loading}
            onClick={handleConvertFile}
            className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading && selectedFile ? '转换中…' : '转换文件'}
          </button>

          <div className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3">
            <p className="text-sm font-medium">通过 URL 转换</p>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/page.html"
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <button
              type="button"
              disabled={!urlInput.trim() || loading}
              onClick={handleConvertUrl}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && urlInput.trim() ? '转换中…' : '转换 URL'}
            </button>
          </div>

          {formats && (
            <div className="rounded-xl border border-border bg-surface-elevated p-4">
              <p className="text-sm font-medium mb-2">支持格式</p>
              <p className="text-xs text-muted mb-3">{formats.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {formats.formats.map((ext) => (
                  <span
                    key={ext}
                    className="rounded-md bg-surface px-2 py-0.5 text-xs font-mono text-muted"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 右侧：结果区 */}
        <div className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface-elevated overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {result?.title || result?.filename || '转换结果'}
                </p>
                {result && (
                  <p className="text-xs text-muted">
                    {result.markdown.length.toLocaleString()} 字符
                  </p>
                )}
              </div>
              {result && (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-surface transition-colors"
                  >
                    复制
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="rounded-md bg-brand-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-600 transition-colors"
                  >
                    下载 .md
                  </button>
                </div>
              )}
            </div>
            <div className="p-4">
              {loading && (
                <p className="text-sm text-muted">正在转换，请稍候…</p>
              )}
              {!loading && !result && !error && (
                <p className="text-sm text-muted">
                  上传文件或输入 URL 后，Markdown 结果将显示在这里。
                </p>
              )}
              {result && (
                <pre
                  className="max-h-[32rem] overflow-auto text-sm font-mono whitespace-pre-wrap break-words"
                >
                  {result.markdown}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolPage>
  )
}
