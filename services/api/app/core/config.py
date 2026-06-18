from functools import lru_cache
from typing import Annotated

from fastapi import Depends

from tools_common.config import ApiSettings


class Settings(ApiSettings):
    """API 协调服务配置（环境变量前缀 API_）。"""


@lru_cache
def get_settings() -> Settings:
    return Settings()


SettingsDep = Annotated[Settings, Depends(get_settings)]
