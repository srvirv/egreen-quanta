import pandas as pd
import pennylane as qml
from pennylane import numpy as np

from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
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

CLASSES = ["Normal", "MCI-like", "AD"]

N_QUBITS = 4
N_LAYERS = 3


# ---------------------------------
# Data preparation
# ---------------------------------

def prepare_data(train_path, test_path):

    train_df = pd.read_csv(train_path)
    test_df = pd.read_csv(test_path)

    X_train = train_df[FEATURES].copy()
    X_test = test_df[FEATURES].copy()

    X_train["M/F"] = X_train["M/F"].map({"M": 1, "F": 0})
    X_test["M/F"] = X_test["M/F"].map({"M": 1, "F": 0})

    # Training statistics are used for both datasets.
    medians = X_train.median()

    X_train = X_train.fillna(medians)
    X_test = X_test.fillna(medians)

    scaler = StandardScaler()

    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Compress 8 classical features into 4 quantum inputs.
    pca = PCA(
        n_components=N_QUBITS,
        random_state=42
    )

    X_train_pca = pca.fit_transform(X_train_scaled)
    X_test_pca = pca.transform(X_test_scaled)

    # Map inputs to a stable rotation range.
    X_train_pca = np.tanh(X_train_pca) * np.pi
    X_test_pca = np.tanh(X_test_pca) * np.pi

    y_train = train_df["target"].values
    y_test = test_df["target"].values

    return X_train_pca, X_test_pca, y_train, y_test


# ---------------------------------
# Quantum device
# ---------------------------------

dev = qml.device(
    "default.qubit",
    wires=N_QUBITS
)


# ---------------------------------
# Variational Quantum Circuit
# ---------------------------------

@qml.qnode(dev)
def quantum_circuit(inputs, weights):

    # Encode classical features.
    for i in range(N_QUBITS):
        qml.RY(
            inputs[i],
            wires=i
        )

    # Trainable variational layers.
    for layer in range(N_LAYERS):

        for i in range(N_QUBITS):

            qml.Rot(
                weights[layer, i, 0],
                weights[layer, i, 1],
                weights[layer, i, 2],
                wires=i
            )

        # Entangle neighbouring qubits.
        for i in range(N_QUBITS - 1):

            qml.CNOT(
                wires=[i, i + 1]
            )

    return [
        qml.expval(qml.PauliZ(i))
        for i in range(N_QUBITS)
    ]


# ---------------------------------
# Classical output layer
# ---------------------------------

def model_logits(
    inputs,
    quantum_weights,
    output_weights,
    output_bias
):

    quantum_output = quantum_circuit(
        inputs,
        quantum_weights
    )

    quantum_output = np.stack(
        quantum_output
    )

    logits = (
        np.dot(
            output_weights,
            quantum_output
        )
        + output_bias
    )

    return logits


# ---------------------------------
# Softmax
# ---------------------------------

def softmax(logits):

    shifted = logits - np.max(logits)

    exp_values = np.exp(shifted)

    return exp_values / np.sum(exp_values)


# ---------------------------------
# Class-weighted loss
# ---------------------------------

def loss_function(
    X,
    y,
    quantum_weights,
    output_weights,
    output_bias
):

    class_weights = {
        "Normal": 1.0,
        "MCI-like": 1.5,
        "AD": 3.0,
    }

    total_loss = 0.0

    for inputs, label in zip(X, y):

        logits = model_logits(
            inputs,
            quantum_weights,
            output_weights,
            output_bias
        )

        probabilities = softmax(logits)

        class_index = CLASSES.index(label)

        sample_loss = -np.log(
            probabilities[class_index] + 1e-8
        )

        total_loss += (
            class_weights[label]
            * sample_loss
        )

    return total_loss / len(X)


# ---------------------------------
# Train model
# ---------------------------------

def train_model(
    X_train,
    y_train,
    epochs=40,
    learning_rate=0.03
):

    rng = np.random.default_rng(42)

    quantum_weights = np.array(
        rng.normal(
            0,
            0.1,
            size=(
                N_LAYERS,
                N_QUBITS,
                3
            )
        ),
        requires_grad=True
    )

    output_weights = np.array(
        rng.normal(
            0,
            0.1,
            size=(
                len(CLASSES),
                N_QUBITS
            )
        ),
        requires_grad=True
    )

    output_bias = np.array(
        np.zeros(
            len(CLASSES)
        ),
        requires_grad=True
    )

    optimizer = qml.AdamOptimizer(
        stepsize=learning_rate
    )

    print("\n=== TRAINING VARIATIONAL QML ===")

    for epoch in range(epochs):

        def objective(
            quantum_weights,
            output_weights,
            output_bias
        ):

            return loss_function(
                X_train,
                y_train,
                quantum_weights,
                output_weights,
                output_bias
            )

        (
            quantum_weights,
            output_weights,
            output_bias
        ), current_loss = optimizer.step_and_cost(
            objective,
            quantum_weights,
            output_weights,
            output_bias
        )

        if (epoch + 1) % 5 == 0:

            print(
                f"Epoch {epoch + 1:02d}/{epochs} "
                f"- Loss: {float(current_loss):.4f}"
            )

    return (
        quantum_weights,
        output_weights,
        output_bias
    )


# ---------------------------------
# Prediction
# ---------------------------------

def predict_dataset(
    X,
    quantum_weights,
    output_weights,
    output_bias
):

    predictions = []

    probability_list = []

    for inputs in X:

        logits = model_logits(
            inputs,
            quantum_weights,
            output_weights,
            output_bias
        )

        probabilities = softmax(
            logits
        )

        predicted_index = int(
            np.argmax(probabilities)
        )

        predictions.append(
            CLASSES[predicted_index]
        )

        probability_list.append(
            [
                float(p)
                for p in probabilities
            ]
        )

    return predictions, probability_list


# ---------------------------------
# Main experiment
# ---------------------------------

if __name__ == "__main__":

    (
        X_train,
        X_test,
        y_train,
        y_test
    ) = prepare_data(
        "ml/train_prepared.csv",
        "ml/test_prepared.csv"
    )

    print("=== VARIATIONAL QML DATA ===")
    print(
        "Training samples:",
        len(X_train)
    )
    print(
        "Test samples:",
        len(X_test)
    )
    print(
        "Quantum inputs:",
        X_train.shape[1]
    )
    print(
        "Quantum layers:",
        N_LAYERS
    )

    (
        quantum_weights,
        output_weights,
        output_bias
    ) = train_model(
        X_train,
        y_train
    )

    predictions, probabilities = predict_dataset(
        X_test,
        quantum_weights,
        output_weights,
        output_bias
    )

    accuracy = accuracy_score(
        y_test,
        predictions
    )

    print("\n=== VARIATIONAL QML EVALUATION ===")

    print(
        f"Accuracy: {accuracy:.4f}"
    )

    print("\nClassification Report:")

    print(
        classification_report(
            y_test,
            predictions,
            labels=CLASSES,
            zero_division=0
        )
    )

    print("Confusion Matrix:")

    print(
        confusion_matrix(
            y_test,
            predictions,
            labels=CLASSES
        )
    )

    print(
        "\nVARIATIONAL QML TRAINING COMPLETE"
    )