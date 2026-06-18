from fastapi import APIRouter, File, HTTPException, UploadFile, status

from tools_common.schemas import HealthResponse

from app.tools.markitdown.schemas import (
    ConvertResponse,
    ConvertUrlRequest,
    SupportedFormatsResponse,
)
from app.tools.markitdown.service import (
    FORMATS_DESCRIPTION,
    SUPPORTED_EXTENSIONS,
    convert_bytes,
    convert_url,
)

router = APIRouter(tags=["markitdown"])

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="MarkItDown 工具健康检查",
)
async def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service="markitdown",
        message="MarkItDown 转换模块运行正常",
    )


@router.get(
    "/formats",
    response_model=SupportedFormatsResponse,
    summary="列出支持的文件格式",
)
async def formats() -> SupportedFormatsResponse:
    return SupportedFormatsResponse(
        formats=SUPPORTED_EXTENSIONS,
        description=FORMATS_DESCRIPTION,
    )


@router.post(
    "/convert",
    response_model=ConvertResponse,
    summary="上传文件并转换为 Markdown",
)
async def convert_file(
    file: UploadFile = File(..., description="待转换的文件"),
) -> ConvertResponse:
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="文件名不能为空",
        )

    content = await file.read()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="文件内容为空",
        )
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_CONTENT_TOO_LARGE,
            detail=f"文件大小超过限制（最大 {MAX_FILE_SIZE // (1024 * 1024)} MB）",
        )

    try:
        markdown, title = convert_bytes(content, file.filename)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return ConvertResponse(
        markdown=markdown,
        title=title,
        filename=file.filename,
    )


@router.post(
    "/convert-url",
    response_model=ConvertResponse,
    summary="通过 URL 转换资源为 Markdown",
)
async def convert_from_url(body: ConvertUrlRequest) -> ConvertResponse:
    url = str(body.url)
    if not url.startswith(("http://", "https://")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="仅支持 http 或 https URL",
        )

    try:
        markdown, title = convert_url(url)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    return ConvertResponse(
        markdown=markdown,
        title=title,
        filename=None,
    )
