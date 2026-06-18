import type { ComponentType } from 'react'
import { ExampleToolPage } from '@/pages/ExampleTool'

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

/** 由 tool_id 推导 API 前缀，前后端必须一致 */
export function apiPrefixFor(id: string): string {
  return `/api/${id}`
}

export const tools: ToolDefinition[] = [
  {
    id: 'example',
    name: '示例工具',
    description: '演示前后端集成的示例页面，可据此添加新工具。',
    path: '/example',
    Page: ExampleToolPage,
    tags: ['demo'],
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
