import pennylane as qml

dev = qml.device("default.qubit", wires=2)


@qml.qnode(dev)
def circuit(x):
    qml.RY(x[0], wires=0)
    qml.RY(x[1], wires=1)
    qml.CNOT(wires=[0, 1])

    return (
        qml.expval(qml.PauliZ(0)),
        qml.expval(qml.PauliZ(1)),
    )


result = circuit([0.5, 1.0])

print("QUANTUM CIRCUIT OK")
print("Output:", result)