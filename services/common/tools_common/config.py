from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class ApiSettings(BaseSettings):
    """API 协调服务全局配置。环境变量前缀 API_。"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        env_prefix="API_",
        extra="ignore",
    )

    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8080
    cors_origins: list[str] = Field(
        default_factory=list,
        description="允许的 CORS 来源；生产同域部署时通常留空",
    )

    @property
    def api_prefix(self) -> str:
        return "/api"

    @property
    def api_v1_prefix(self) -> str:
        return "/api/v1"
