from collections.abc import AsyncIterator, Callable, Sequence
from contextlib import asynccontextmanager
from dataclasses import dataclass
from typing import Any

from fastapi import APIRouter, FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from tools_common.config import ApiSettings
from tools_common.schemas import ProbeHealthResponse


@dataclass(frozen=True)
class ToolRouter:
    """注册到协调服务中的工具路由模块。"""

    id: str
    router: APIRouter


@asynccontextmanager
async def default_lifespan(_: FastAPI) -> AsyncIterator[None]:
    yield


def _register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(
        _request: Request,
        exc: StarletteHTTPException,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        _request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )


def create_api_app(
    settings: ApiSettings,
    v1_router: APIRouter,
    tool_routers: Sequence[ToolRouter],
    *,
    lifespan: Callable[..., AsyncIterator[None]] | None = None,
    **fastapi_kwargs: Any,
) -> FastAPI:
    """
    创建 tools.cyxc.club 统一 API 协调服务。

    - /health — K8s 探活
    - /api/v1/* — 协调层 API（健康汇总等）
    - /api/{tool_id}/v1/* — 各工具业务 API
    - /api/docs — OpenAPI 文档
    """
    app = FastAPI(
        title="tools.cyxc.club API",
        description="在线工具集统一 API 协调入口",
        debug=settings.debug,
        lifespan=lifespan or default_lifespan,
        docs_url=f"{settings.api_prefix}/docs",
        redoc_url=f"{settings.api_prefix}/redoc",
        openapi_url=f"{settings.api_prefix}/openapi.json",
        **fastapi_kwargs,
    )

    _register_exception_handlers(app)

    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=settings.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    probe_router = APIRouter(tags=["probe"])

    @probe_router.get(
        "/health",
        response_model=ProbeHealthResponse,
        summary="容器探活",
    )
    async def probe_health() -> ProbeHealthResponse:
        return ProbeHealthResponse(status="ok")

    app.include_router(probe_router)
    app.include_router(v1_router, prefix=settings.api_v1_prefix)

    for tool in tool_routers:
        app.include_router(
            tool.router,
            prefix=f"{settings.api_prefix}/{tool.id}/v1",
            tags=[tool.id],
        )

    return app
