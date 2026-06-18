# services/

后端代码目录。规范详见 **[docs/CONVENTIONS.md](../docs/CONVENTIONS.md)**。

## 结构

```
services/
├── common/tools_common/   # 共享库：create_api_app、Schema、配置基类
└── api/                   # 唯一对外 API 协调服务
    └── app/tools/         # 各工具模块（新增工具在这里）
```

## 快速开始

```bash
pip install -r api/requirements-dev.txt
cd api && pytest && uvicorn app.main:app --reload --port 8080
```

## 新增工具

1. `api/app/tools/{tool_id}/router.py`
2. `api/app/tools/registry.py` 注册
3. 前端见 `docs/CONVENTIONS.md` 第 5、7 节

**不要**在 `services/` 下创建与 `api` 平级的独立服务目录。
