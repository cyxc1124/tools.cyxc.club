# 本地开发

规范与新增工具流程见 **[docs/CONVENTIONS.md](../docs/CONVENTIONS.md)** 第 8 节。

```bash
pip install -r services/api/requirements-dev.txt
cd web && npm install && cd ..
npm run dev
```

- 前端：http://localhost:5173
- API 文档：http://localhost:8080/api/docs

`dev/backends.json` 配置本地 API 端口（默认 `8080`）。

同域无端口访问：`caddy run --config dev/Caddyfile`（需 `/etc/hosts` 指向 `127.0.0.1 tools.cyxc.club`）。
