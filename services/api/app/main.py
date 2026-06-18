from app.api.v1.router import router as v1_router
from app.core.config import get_settings
from app.core.lifespan import lifespan
from app.tools.registry import get_tool_routers
from tools_common.factory import create_api_app

settings = get_settings()

app = create_api_app(
    settings=settings,
    v1_router=v1_router,
    tool_routers=get_tool_routers(),
    lifespan=lifespan,
)
