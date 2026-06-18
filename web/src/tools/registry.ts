import type { ComponentType } from 'react'
import { MarkitdownToolPage } from '@/pages/MarkitdownTool'
import { apiPrefixFor } from '@/tools/api-prefix'

export interface ToolDefinition {
  /** 唯一标识，对应 API 路径 /api/{id} */
  id: string
  name: string
  description: string
  /** 前端路由路径，如 /markdown */
  path: string
  /** 页面组件 */
  Page: ComponentType
  icon?: string
  tags?: string[]
}

export { apiPrefixFor }

export const tools: ToolDefinition[] = [
  {
    id: 'markitdown',
    name: 'MarkItDown',
    description: '将 PDF、Word、Excel、PPT、图片等文件转换为 Markdown。',
    path: '/markitdown',
    Page: MarkitdownToolPage,
    tags: ['document', 'convert'],
  },
]

export function getToolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id)
}

export function getToolByPath(path: string): ToolDefinition | undefined {
  return tools.find((t) => path === t.path || path.startsWith(`${t.path}/`))
}

export function getApiPrefix(tool: ToolDefinition): string {
  return apiPrefixFor(tool.id)
}
