# syntax=docker/dockerfile:1

FROM python:3.14-slim

WORKDIR /app

COPY common /deps/common
COPY api/requirements.txt .
RUN pip install --no-cache-dir /deps/common \
    && pip install --no-cache-dir -r requirements.txt

COPY api/app ./app

ENV PYTHONUNBUFFERED=1
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
