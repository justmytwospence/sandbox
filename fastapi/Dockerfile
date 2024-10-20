FROM python:3.12
WORKDIR /fastapi
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8000
WORKDIR /fastapi/src
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]