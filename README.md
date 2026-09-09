# Egreen Quanta

## Hybrid Quantum Machine Learning Platform for Early Disease Detection

Egreen Quanta is a research prototype for early disease detection using machine learning and experimental hybrid quantum machine learning techniques. The current implementation focuses on Alzheimer's disease research using the OASIS-2 dataset.

## Project Overview

The platform combines OASIS-2 research data, data preprocessing, feature selection, classical machine learning, experimental quantum machine learning, a FastAPI backend, a React frontend, and live model inference.

### Features Used

The current machine-learning pipeline uses the following OASIS-2 features: Age (participant age), EDUC (years of education), SES (socioeconomic status), MMSE (Mini-Mental State Examination score), eTIV (Estimated Total Intracranial Volume), nWBV (Normalized Whole Brain Volume), ASF (Atlas Scaling Factor), and M/F (biological sex).

The following fields are not used as model features: Subject ID, MRI ID, Visit, Group, and CDR.

The dataset is split at the subject level so that different visits from the same subject are not unnecessarily placed in both training and testing sets.

### Prototype Classes

The current prototype predicts three research-oriented classes: Normal, MCI-like, and AD.

The current CDR-based prototype mapping is: CDR 0 → Normal, CDR 0.5 → MCI-like, CDR 1 → AD, and CDR 2 → AD.

> Important: The MCI-like and AD categories are prototype label mappings used for machine-learning experimentation. They should not be interpreted as clinically confirmed diagnoses.

## Current ML Pipeline

OASIS-2 Dataset → Data Preprocessing → Feature Selection → Subject-Level Train/Test Split → Classical ML Models → Random Forest Baseline → FastAPI Prediction API → React Frontend → Prediction + Class Probabilities.

## Machine Learning Models

The project evaluates three classical machine-learning baselines: Logistic Regression, Random Forest, and Support Vector Machine (SVM).

The current best-performing baseline is Random Forest, selected using macro F1 on the held-out test set.

### Current Baseline Performance

| Model | Accuracy | Macro F1 |
|---|---:|---:|
| Random Forest | 74.67% | 70.77% |
| SVM | 66.67% | 60.95% |
| Logistic Regression | 66.67% | 58.97% |

These results are from the current research prototype and should not be interpreted as clinical performance.

## Quantum Machine Learning

The project also contains an experimental QML component using PennyLane. The current experiments include PCA-based dimensionality reduction, 4-qubit quantum circuits, quantum angle encoding, variational quantum circuits, trainable quantum layers, classical output layers, and hybrid quantum-classical experimentation.

The QML component is intended for research comparison with the classical machine-learning baseline. No quantum advantage is claimed.

## Backend

The backend is implemented using FastAPI.

Health endpoint: GET /health

Prediction endpoint: POST /predict

The prediction API accepts the required patient features and returns the predicted class and class probabilities.

## Frontend

The frontend is implemented using React + Vite. The current interface provides patient feature input, demographic information, cognitive feature input, MRI-derived feature input, ML inference, live prediction probabilities, tri-class prediction visualization, research prototype status, and classical ML/QML research presentation.

## Project Architecture

OASIS-2 Data → Preprocessing & Feature Selection → Classical ML / Experimental Hybrid QML → FastAPI Backend → React Frontend.

## Repository Structure

egreen-quanta/
├── backend/
│   └── app/
│       └── main.py
├── frontend/
│   └── src/
│       ├── components/
│       ├── layout/
│       └── pages/
├── ml/
│   ├── train.py
│   ├── predict.py
│   ├── evaluate.py
│   └── qml/
│       ├── quantum_model.py
│       └── hybrid_model.py
├── qml_test.py
├── .gitignore
└── README.md

## Running the Project

### Backend

Start the FastAPI backend with:

python3 -m uvicorn backend.app.main:app --reload

The API will be available locally at http://127.0.0.1:8000.

Swagger API documentation is available at http://127.0.0.1:8000/docs.

### Frontend

From the frontend directory, run:

npm install
npm run dev

The React application will run locally through Vite.

## Dataset

This project currently uses the OASIS-2 longitudinal dataset for research experimentation. The dataset contains longitudinal research data used to develop and evaluate the prototype machine-learning pipeline.

The raw research dataset is intentionally excluded from version control through .gitignore.

## Research Status

Completed: OASIS-2 data preprocessing, subject-level train/test split, classical ML baselines, Random Forest model, prediction function, FastAPI prediction endpoint, React frontend integration, live prediction probabilities, experimental QML pipeline, and research-oriented UI.

Planned: Advanced explainability, further QML experimentation, and final research presentation.

## Technology Stack

Python, scikit-learn, PennyLane, FastAPI, Pydantic, React, Vite, JavaScript, Git, and GitHub.

## Key Design Considerations

The OASIS-2 dataset contains multiple visits for some subjects. The project therefore performs the train/test split at the subject level to reduce the risk of information leakage between training and testing data.

The prototype uses CDR-based research mappings: CDR 0.0 → Normal, CDR 0.5 → MCI-like, CDR 1.0 → AD, and CDR 2.0 → AD. These mappings are intended for research experimentation and are not equivalent to clinical diagnostic criteria.

## Limitations

This project is currently a research and demonstration prototype. The model has not been clinically validated. The dataset is a research dataset and does not represent all patient populations. The current feature-based pipeline does not perform direct end-to-end MRI image classification. Model probabilities should not be interpreted as clinical confidence. The current QML component is experimental. No quantum advantage is claimed. Further validation and larger-scale experimentation are required before any real-world clinical application could be considered.

## Future Work

Potential future improvements include MRI image-based deep learning, more advanced feature extraction, Explainable AI, SHAP-based model interpretation, additional validation strategies, larger and more diverse datasets, improved hybrid quantum-classical architectures, quantum hardware experimentation, model comparison and ablation studies, and improved clinical research evaluation.

## Disclaimer

Egreen Quanta is an academic/research prototype developed for experimentation with machine learning and hybrid quantum machine learning.

It is not intended for medical diagnosis, clinical decision-making, or treatment recommendations.

Model predictions should not be considered medical advice.
