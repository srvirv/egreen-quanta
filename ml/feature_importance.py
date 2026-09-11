import pandas as pd
import joblib
import matplotlib.pyplot as plt


MODEL_PATH = "ml/best_model.joblib"


model = joblib.load(MODEL_PATH)


FEATURES = [
    "Age",
    "EDUC",
    "SES",
    "MMSE",
    "eTIV",
    "nWBV",
    "ASF",
    "M/F"
]


# Get the fitted preprocessing step
preprocessor = model.named_steps["preprocessing"]


# Get the Random Forest
random_forest = model.named_steps["model"]


# Get feature names after preprocessing
feature_names = preprocessor.get_feature_names_out()


# Get Random Forest importance
importances = random_forest.feature_importances_


importance_df = pd.DataFrame({
    "Feature": feature_names,
    "Importance": importances
})


# Sort from most important to least important
importance_df = importance_df.sort_values(
    "Importance",
    ascending=False
)


print("\nRANDOM FOREST FEATURE IMPORTANCE")
print("=" * 50)

print(
    importance_df.to_string(
        index=False,
        float_format=lambda x: f"{x:.4f}"
    )
)


# Save results
importance_df.to_csv(
    "ml/feature_importance.csv",
    index=False
)


# Plot
plt.figure(figsize=(9, 6))

plt.barh(
    importance_df["Feature"],
    importance_df["Importance"]
)

plt.xlabel("Importance")
plt.ylabel("Feature")
plt.title("Random Forest Feature Importance")

plt.gca().invert_yaxis()

plt.tight_layout()

plt.savefig(
    "ml/feature_importance.png",
    dpi=200
)

plt.close()


print("\nSaved:")
print("ml/feature_importance.csv")
print("ml/feature_importance.png")