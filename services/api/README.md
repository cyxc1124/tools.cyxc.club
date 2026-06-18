# API 协调服务

对外唯一后端入口。完整规范见 **[docs/CONVENTIONS.md](../../docs/CONVENTIONS.md)**。

## 路由

| 路径 | 说明 |
|------|------|
| `GET /health` | K8s 探活 |
| `GET /api/v1/health` | 协调层健康（含已注册工具列表） |
| `GET /api/{tool_id}/v1/*` | 工具业务 API |
| `GET /api/docs` | OpenAPI |

## 新增工具

1. `app/tools/{tool_id}/router.py`
2. `app/tools/registry.py` 注册
3. `tests/test_{tool_id}.py`

```bash
pip install -r requirements-dev.txt
pytest
uvicorn app.main:app --reload --port 8080
```
