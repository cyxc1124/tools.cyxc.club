import io
import os
from functools import lru_cache

from markitdown import MarkItDown, StreamInfo
from markitdown._exceptions import (
    FileConversionException,
    UnsupportedFormatException,
)

SUPPORTED_EXTENSIONS = [
    ".pdf",
    ".docx",
    ".doc",
    ".pptx",
    ".ppt",
    ".xlsx",
    ".xls",
    ".csv",
    ".html",
    ".htm",
    ".xml",
    ".json",
    ".txt",
    ".md",
    ".rtf",
    ".epub",
    ".msg",
    ".zip",
    ".ipynb",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".tiff",
    ".wav",
    ".mp3",
    ".m4a",
]

FORMATS_DESCRIPTION = (
    "支持 PDF、Word、PowerPoint、Excel、图片、音频、HTML、CSV、JSON、"
    "ZIP、EPUB、Outlook 邮件等常见格式。"
)


@lru_cache(maxsize=1)
def get_markitdown() -> MarkItDown:
    return MarkItDown()


def convert_bytes(content: bytes, filename: str) -> tuple[str, str | None]:
    extension = os.path.splitext(filename)[1].lower()
    stream_info = StreamInfo(
        filename=filename,
        extension=extension,
    )
    stream = io.BytesIO(content)
    try:
        result = get_markitdown().convert_stream(stream, stream_info=stream_info)
    except UnsupportedFormatException as exc:
        raise ValueError(f"不支持的文件格式：{extension or '未知'}") from exc
    except FileConversionException as exc:
        raise ValueError(str(exc)) from exc
    return result.markdown, result.title


def convert_url(url: str) -> tuple[str, str | None]:
    try:
        result = get_markitdown().convert_uri(url)
    except UnsupportedFormatException as exc:
        raise ValueError("无法识别或转换该 URL 指向的资源") from exc
    except FileConversionException as exc:
        raise ValueError(str(exc)) from exc
    return result.markdown, result.title
