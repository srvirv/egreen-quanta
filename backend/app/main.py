from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from ml.predict import predict

app = FastAPI(
    title="Egreen Quanta API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PatientData(BaseModel):
    Age: float
    EDUC: float
    SES: float
    MMSE: float
    eTIV: float
    nWBV: float
    ASF: float
    M_F: str


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Egreen Quanta API",
    }


@app.post("/predict")
def prediction(data: PatientData):
    input_data = {
        "Age": data.Age,
        "EDUC": data.EDUC,
        "SES": data.SES,
        "MMSE": data.MMSE,
        "eTIV": data.eTIV,
        "nWBV": data.nWBV,
        "ASF": data.ASF,
        "M/F": data.M_F,
    }

    return predict(input_data)