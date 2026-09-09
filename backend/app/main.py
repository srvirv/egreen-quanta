from fastapi import FastAPI

app = FastAPI(
    title="Egreen Quanta API",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Egreen Quanta API",
    }