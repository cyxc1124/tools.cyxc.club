import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_markitdown_health(client: AsyncClient) -> None:
    response = await client.get("/api/markitdown/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "markitdown"


@pytest.mark.asyncio
async def test_markitdown_formats(client: AsyncClient) -> None:
    response = await client.get("/api/markitdown/v1/formats")
    assert response.status_code == 200
    body = response.json()
    assert ".pdf" in body["formats"]
    assert ".html" in body["formats"]
    assert body["description"]


@pytest.mark.asyncio
async def test_markitdown_convert_html(client: AsyncClient) -> None:
    response = await client.post(
        "/api/markitdown/v1/convert",
        files={"file": ("test.html", "<h1>Hello MarkItDown</h1>", "text/html")},
    )
    assert response.status_code == 200
    body = response.json()
    assert "Hello MarkItDown" in body["markdown"]
    assert body["filename"] == "test.html"


@pytest.mark.asyncio
async def test_markitdown_convert_empty_file(client: AsyncClient) -> None:
    response = await client.post(
        "/api/markitdown/v1/convert",
        files={"file": ("empty.txt", "", "text/plain")},
    )
    assert response.status_code == 400


@pytest.mark.asyncio
async def test_markitdown_convert_url_rejects_non_http(client: AsyncClient) -> None:
    response = await client.post(
        "/api/markitdown/v1/convert-url",
        json={"url": "ftp://example.com/file.pdf"},
    )
    assert response.status_code == 422
