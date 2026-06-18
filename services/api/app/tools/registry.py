from tools_common.factory import ToolRouter

from app.tools.example.router import router as example_router


def get_tool_routers() -> list[ToolRouter]:
    """注册所有工具路由模块。新增工具时在此追加。"""
    return [
        ToolRouter(id="example", router=example_router),
    ]


def get_registered_tool_ids() -> list[str]:
    return [tool.id for tool in get_tool_routers()]
