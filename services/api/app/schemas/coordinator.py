from pydantic import BaseModel, Field


class CoordinatorHealthResponse(BaseModel):
    status: str = Field(examples=["ok"])
    tools: list[str] = Field(description="已注册的工具 ID 列表")
