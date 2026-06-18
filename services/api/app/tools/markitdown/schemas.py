from pydantic import BaseModel, Field, HttpUrl


class ConvertResponse(BaseModel):
    markdown: str = Field(description="转换后的 Markdown 文本")
    title: str | None = Field(default=None, description="文档标题（若可识别）")
    filename: str | None = Field(default=None, description="原始文件名")


class ConvertUrlRequest(BaseModel):
    url: HttpUrl = Field(description="要转换的资源 URL（http/https）")


class SupportedFormatsResponse(BaseModel):
    formats: list[str] = Field(description="支持的文件扩展名列表")
    description: str = Field(description="格式说明")
