from fastapi import APIRouter

from tools_common.schemas import HealthResponse

from app.core.config import SettingsDep

router = APIRouter(tags=["example"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="示例工具健康检查",
)
async def health(settings: SettingsDep) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="example",
        message="示例工具模块运行正常",
    )
