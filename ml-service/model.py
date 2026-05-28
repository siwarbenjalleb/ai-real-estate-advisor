import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import os

MODEL_PATH = "models/model.pkl"
ENCODERS_PATH = "models/encoders.pkl"

def train_model():
    # Load dataset
    df = pd.read_csv("data/houses.csv", sep="\t")

    print("Columns:", df.columns.tolist())
    print("Shape:", df.shape)
    print(df.head())

    # Drop rows with missing values in key columns
    df = df.dropna(subset=["price", "superficie", "chambres", "salles_de_bains", "city", "state", "category"])

    # Remove non-numeric prices
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df = df.dropna(subset=["price"])

    # Remove outliers
    df = df[df["price"] > 1000]
    df = df[df["superficie"] > 10]

    # Features
    features = ["superficie", "chambres", "salles_de_bains", "city", "state", "category"]
    target = "price"

    # Encode categorical columns
    encoders = {}
    for col in ["city", "state", "category"]:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col].astype(str))
        encoders[col] = le

    X = df[features]
    y = df[target]

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"✅ Model trained successfully")
    print(f"📊 RMSE: {rmse:.2f}")
    print(f"📊 R² Score: {r2:.4f}")

    # Save model and encoders
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODERS_PATH)

    return {"rmse": rmse, "r2": r2}


def load_model():
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODERS_PATH)
    return model, encoders


def predict_price(superficie, chambres, salles_de_bains, city, state, category):
    model, encoders = load_model()

    # Encode inputs
    def encode(col, value):
        le = encoders[col]
        if value in le.classes_:
            return le.transform([value])[0]
        else:
            return 0  # unknown value fallback

    input_data = pd.DataFrame([{
        "superficie": superficie,
        "chambres": chambres,
        "salles_de_bains": salles_de_bains,
        "city": encode("city", city),
        "state": encode("state", state),
        "category": encode("category", category)
    }])

    predicted_price = model.predict(input_data)[0]

    # Calculate investment score (simple formula)
    investment_score = min(100, max(0, int(100 - (predicted_price / 1000000) * 10)))
    roi = round(8.5 - (predicted_price / 1000000), 2)
    risk = "Low" if investment_score > 70 else "Medium" if investment_score > 40 else "High"

    return {
        "predicted_price": round(predicted_price, 2),
        "investment_score": investment_score,
        "roi_estimation": max(roi, 1.0),
        "risk_level": risk
    }