import pandas as pd
import pennylane as qml
from pennylane import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

FEATURES = [
    "Age",
    "EDUC",
    "SES",
    "MMSE",
    "eTIV",
    "nWBV",
    "ASF",
    "M/F",
]


# ---------------------------------
# Feature preparation
# ---------------------------------

def fit_preprocessor(csv_path):
    df = pd.read_csv(csv_path)

    X = df[FEATURES].copy()
    X["M/F"] = X["M/F"].map({"M": 1, "F": 0})

    # Calculate missing-value statistics ONLY from training data.
    medians = X.median()
    X = X.fillna(medians)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    pca = PCA(n_components=4, random_state=42)
    X_pca = pca.fit_transform(X_scaled)

    return X_pca, scaler, pca, medians


def transform_features(csv_path, scaler, pca, medians):
    df = pd.read_csv(csv_path)

    X = df[FEATURES].copy()
    X["M/F"] = X["M/F"].map({"M": 1, "F": 0})

    # Use ONLY the training-set medians.
    X = X.fillna(medians)

    X_scaled = scaler.transform(X)
    X_pca = pca.transform(X_scaled)

    return X_pca


# ---------------------------------
# Quantum circuit
# ---------------------------------

dev = qml.device("default.qubit", wires=4)


@qml.qnode(dev)
def quantum_circuit(x):

    for i in range(4):
        qml.RY(x[i], wires=i)

    for i in range(3):
        qml.CNOT(wires=[i, i + 1])

    return [
        qml.expval(qml.PauliZ(i))
        for i in range(4)
    ]


def quantum_features(X):
    outputs = []

    for sample in X:
        # Scale PCA features into a stable quantum rotation range.
        angles = np.tanh(sample) * np.pi

        result = quantum_circuit(
            np.array(angles, requires_grad=False)
        )

        outputs.append([float(value) for value in result])

    return np.array(outputs)


# ---------------------------------
# QML pipeline test
# ---------------------------------

if __name__ == "__main__":

    train_df = pd.read_csv("ml/train_prepared.csv")

    # Fit preprocessing ONLY on training data.
    X_train_pca, scaler, pca, medians = fit_preprocessor(
        "ml/train_prepared.csv"
    )

    # Transform test data using the SAME fitted preprocessing.
    X_test_pca = transform_features(
        "ml/test_prepared.csv",
        scaler,
        pca,
        medians,
)

    y_train = train_df["target"].values
    test_df = pd.read_csv("ml/test_prepared.csv")
    y_test = test_df["target"].values

    # Convert classical features into quantum features.
    X_train_quantum = quantum_features(X_train_pca)
    X_test_quantum = quantum_features(X_test_pca)

    # First classical classifier on top of quantum features.
    classifier = LogisticRegression(
        max_iter=2000,
        class_weight="balanced",
        random_state=42,
    )

    classifier.fit(X_train_quantum, y_train)

    predictions = classifier.predict(X_test_quantum)

    accuracy = accuracy_score(y_test, predictions)

    print("\n=== QML EVALUATION ===")
    print(f"Accuracy: {accuracy:.4f}")

    print("\nClassification Report:")
    print(
        classification_report(
            y_test,
            predictions,
            labels=["Normal", "MCI-like", "AD"],
            zero_division=0,
        )
    )

    print("Confusion Matrix:")
    print(
        confusion_matrix(
            y_test,
            predictions,
            labels=["Normal", "MCI-like", "AD"],
        )
    )

    print("QML CLASSIFIER TRAINING OK")
    print("Training quantum samples:", len(X_train_quantum))
    print("Test quantum samples:", len(X_test_quantum))
    print("Predictions:", predictions[:10])