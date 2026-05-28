import pandas as pd

df = pd.read_csv("data/houses.csv", sep=",", on_bad_lines='skip')
df.columns = df.columns.str.strip().str.replace('^,', '', regex=True)
df["price"] = pd.to_numeric(df["price"], errors="coerce")
df = df.dropna(subset=["price"])
df = df[df["price"] > 1000]

print("Min price:", df["price"].min())
print("Max price:", df["price"].max())
print("Average price:", df["price"].mean())
print("Sample prices:", df["price"].head(10).tolist())