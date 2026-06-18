/** API 路径推导（独立模块，避免与 registry 循环依赖） */

export function apiPrefixFor(toolId: string): string {
  return `/api/${toolId}`
}
