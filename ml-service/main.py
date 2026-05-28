from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from model import train_model, predict_price

app = FastAPI(title="Real Estate ML Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    superficie: float
    chambres: int
    salles_de_bains: int
    city: str
    state: str
    category: str

class PredictionResponse(BaseModel):
    predicted_price: float
    investment_score: int
    roi_estimation: float
    risk_level: str

@app.on_event("startup")
async def startup_event():
    if not os.path.exists("models/model.pkl"):
        print("🔄 Training model for the first time...")
        result = train_model()
        print(f"✅ Model ready — R²: {result['r2']:.4f}")
    else:
        print("✅ Model already trained, loading existing model")

@app.get("/")
def root():
    return {"message": "Real Estate ML Service is running"}

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    result = predict_price(
        superficie=request.superficie,
        chambres=request.chambres,
        salles_de_bains=request.salles_de_bains,
        city=request.city,
        state=request.state,
        category=request.category
    )
    return result

@app.post("/train")
def train():
    result = train_model()
    return {"message": "Model retrained successfully", "metrics": result}

@app.get("/health")
def health():
    model_exists = os.path.exists("models/model.pkl")
    return {
        "status": "healthy",
        "model_trained": model_exists
    }