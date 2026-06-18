import pytest
from httpx import AsyncClient

from app.tools.registry import get_registered_tool_ids


@pytest.mark.asyncio
async def test_probe_health(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_coordinator_health(client: AsyncClient) -> None:
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert set(body["tools"]) == set(get_registered_tool_ids())


@pytest.mark.asyncio
async def test_example_tool_health(client: AsyncClient) -> None:
    response = await client.get("/api/example/v1/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "example"
