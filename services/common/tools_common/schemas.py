from pydantic import BaseModel, Field


class ProbeHealthResponse(BaseModel):
    """Kubernetes 探活响应（/health，无业务字段）。"""

    status: str = Field(examples=["ok"])


class HealthResponse(BaseModel):
    """业务健康检查响应（/api/{id}/v1/health）。"""

    status: str = Field(examples=["ok"])
    service: str = Field(description="服务 ID")
    message: str | None = Field(default=None, description="可选说明")
