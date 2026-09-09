# Egreen Quanta — Classical ML Baseline

This folder contains the first reproducible classical ML prototype for the Egreen Quanta SIH project.

## Objective

Build a data → preprocessing → features → classical ML → prediction pipeline for a prototype using OASIS-2 data.

**This is a research/prototype classifier, not a clinically deployable diagnostic system.**

## Dataset

The current prototype uses OASIS-2 longitudinal data.

The dataset itself is **not included in this repository**. Obtain and use the dataset through the appropriate OASIS access/download process.

## Target definition

The OASIS-2 `CDR` variable is mapped for this prototype as:

- CDR 0 → `Normal`
- CDR 0.5 → `MCI-like`
- CDR 1 or 2 → `AD`

`MCI-like` is intentional terminology. CDR 0.5 is described in the OASIS-2 literature as very mild impairment/very mild AD and is similar to what some studies call MCI. We do not claim that OASIS-2 directly supplies a clinically diagnosed MCI label.

## Features

Initial model features:

- Age
- EDUC
- SES
- MMSE
- eTIV
- nWBV
- ASF
- M/F

The following are excluded from model input:

- CDR — used to construct the target
- Group — diagnostic grouping information
- Subject ID / MRI ID — identifiers
- Visit — excluded from the initial baseline

## Leakage prevention

OASIS-2 is longitudinal. Multiple records can belong to the same subject.

Therefore, the train/test split is performed at the **subject level**, so records from one subject are not deliberately split across training and testing.

## Models

Three classical baselines are trained:

1. Logistic Regression
2. Random Forest
3. SVM

The current best model is selected using **macro-F1**.

## Current result

Using the current fixed split (random_state=42), the Random Forest baseline achieved:

- Accuracy: 0.72
- Macro Precision: 0.65
- Macro Recall: 0.73
- Macro F1: 0.67

Per-class results:

| Class | Precision | Recall | F1 | Support |
|---|---:|---:|---:|---:|
| Normal | 0.79 | 0.85 | 0.82 | 40 |
| MCI-like | 0.71 | 0.52 | 0.60 | 29 |
| AD | 0.45 | 0.83 | 0.59 | 6 |

These numbers are from one fixed subject-level test split and should not be presented as clinical performance.

## Files

- `preprocessing.py` — initial preprocessing work
- `train.py` — reproducible model training
- `evaluate.py` — evaluation
- `predict.py` — prediction interface
- `best_model.joblib` — saved current best model
- `model_comparison.csv` — model comparison
- `class_metrics.csv` — per-class metrics
- `metrics.json` — saved summary metrics
- `confusion_matrix.png` — confusion matrix
- `train_prepared.csv` / `test_prepared.csv` — prepared data outputs

## Install

Create a virtual environment and install:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Train

```bash
python train.py --data /path/to/oasis_longitudinal_demographics.xlsx --output .
```

## Evaluate

```bash
python evaluate.py --data /path/to/oasis_longitudinal_demographics.xlsx --model best_model.joblib
```

## Prediction interface

```python
from predict import predict

result = predict({
    "Age": 74,
    "EDUC": 16,
    "SES": 2,
    "MMSE": 28,
    "eTIV": 1600,
    "nWBV": 0.72,
    "ASF": 1.05,
    "M/F": "F"
})
print(result)
```

The function returns a predicted class and class probabilities.

## Next development

The next team stages can improve the baseline by:

- validating the target definition,
- testing more robust subject-level cross-validation,
- addressing class imbalance,
- comparing alternative feature sets,
- adding appropriate MRI-derived features if available,
- comparing the classical baseline with the QML approach,
- exposing `predict()` through FastAPI.

Do not claim clinical diagnosis from this prototype.
