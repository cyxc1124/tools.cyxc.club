from fastapi import APIRouter

from app.schemas.coordinator import CoordinatorHealthResponse
from app.tools.registry import get_registered_tool_ids

router = APIRouter(tags=["coordinator"])


@router.get(
    "/health",
    response_model=CoordinatorHealthResponse,
    summary="协调服务健康检查",
    description="返回 API 协调层状态及已注册工具列表。",
)
async def coordinator_health() -> CoordinatorHealthResponse:
    return CoordinatorHealthResponse(
        status="ok",
        tools=get_registered_tool_ids(),
    )
