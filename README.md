# Egreen Quanta

## Hybrid Quantum Machine Learning Platform for Early Disease Detection

Egreen Quanta is a research prototype for early disease-detection
research using classical machine learning and experimental hybrid
quantum machine learning techniques. The current implementation focuses
on Alzheimer's disease research using the OASIS-2 longitudinal dataset.

> **Research prototype:** The system is intended for academic
> experimentation and demonstration. It is not a clinically validated
> diagnostic system.

## 1. Project Overview

The platform combines OASIS-2 research data, data preparation, classical
machine learning, experimental quantum machine learning, a FastAPI
backend, and a React + Vite frontend.

The current live inference path uses the classical Random Forest model.
The quantum machine-learning component is maintained as an experimental
research branch and is not connected to the live `/predict` endpoint.

## 2. Features and Prototype Classes

### Features Used

The current machine-learning pipeline uses these OASIS-2 features:

-   `Age` --- participant age
-   `EDUC` --- years of education
-   `SES` --- socioeconomic status
-   `MMSE` --- Mini-Mental State Examination score
-   `eTIV` --- Estimated Total Intracranial Volume
-   `nWBV` --- Normalized Whole Brain Volume
-   `ASF` --- Atlas Scaling Factor
-   `M/F` --- biological sex

The following fields are not used as model features:

-   `Subject ID`
-   `MRI ID`
-   `Visit`
-   `Group`
-   `CDR`

### Prototype Classes

The current prototype uses three research-oriented classes:

-   `Normal`
-   `MCI-like`
-   `AD`

The CDR-based prototype mapping is:

    CDR Prototype label
  ----- -----------------
    0.0 Normal
    0.5 MCI-like
    1.0 AD
    2.0 AD

These are research label mappings used for machine-learning
experimentation. They are not equivalent to clinical diagnostic
criteria.

## 3. Current ML Pipeline

``` text
OASIS-2 Research Data
        ↓
Data Cleaning / Preparation
        ↓
Feature Filtering & Preparation
        ↓
Subject-Level Train/Test Split
        ↓
┌───────────────────────────────┐
│ Classical ML                  │
│ LR / SVM / Random Forest      │
└───────────────────────────────┘
        ↓
Model Evaluation & Comparison
        ↓
Current Best Model: Random Forest
        ↓
FastAPI /predict
        ↓
React Frontend
        ↓
Prediction + Class Probabilities
```

The project also contains a separate experimental QML pipeline for
research comparison.

## 4. Classical Machine Learning

Three classical baselines were evaluated:

-   Logistic Regression
-   Support Vector Machine (SVM)
-   Random Forest

The current model-selection metric is **Macro F1** because the dataset
is class-imbalanced and performance across all classes is important.

### Fixed Subject-Level Holdout

The fixed evaluation split contains:

-   **120 training subjects**
-   **30 testing subjects**
-   **298 training rows**
-   **75 testing rows**

Results:

  Model                     Accuracy   Macro Precision   Macro Recall     Macro F1
  --------------------- ------------ ----------------- -------------- ------------
  Random Forest           **74.67%**            68.64%     **80.37%**   **70.77%**
  SVM                         66.67%            60.26%         73.48%       60.95%
  Logistic Regression         66.67%            57.64%         64.66%       58.97%

**Random Forest is the current selected model and powers the live
prediction API.**

The saved inference model is:

``` text
ml/best_model.joblib
```

## 5. Detailed Evaluation

The fixed holdout classification report for the current Random Forest
was:

  Class        Precision   Recall     F1   Support
  ---------- ----------- -------- ------ ---------
  Normal            0.82     0.82   0.82        40
  MCI-like          0.77     0.59   0.67        29
  AD                0.46     1.00   0.63         6

Confusion matrix:

``` text
                Predicted
              Normal  MCI-like  AD
Actual Normal    33       5      2
       MCI-like   7      17      5
       AD         0       0      6
```

The AD test support is only 6 rows. Therefore, the 100% AD recall on
this particular holdout must **not** be interpreted as evidence of 100%
general AD detection performance.

The generated confusion-matrix artifact is:

``` text
confusion_matrix.png
```

## 6. Subject-Level Cross-Validation

Because OASIS-2 contains multiple visits for the same subjects,
cross-validation was also performed at the subject level.

Five-fold cross-validation produced the following mean results:

  Model                   Mean Accuracy   Mean Macro F1   Accuracy Std   Macro F1 Std
  --------------------- --------------- --------------- -------------- --------------
  Random Forest                  0.6653      **0.5870**         0.0354         0.0827
  SVM                            0.5931          0.5161         0.0472         0.0286
  Logistic Regression        **0.6768**          0.5756         0.0560         0.0793

Mean per-class F1 for the original Random Forest:

  Class        Mean F1
  ---------- ---------
  Normal        0.7787
  MCI-like      0.5337
  AD            0.4485

The Random Forest remains the preferred model when **Macro F1** is used
as the selection criterion, although Logistic Regression has slightly
higher mean accuracy in cross-validation.

## 7. Feature Importance

Random Forest impurity-based feature importance was also examined.

  Feature           Importance
  --------- ------------------
  MMSE                  27.51%
  nWBV                  17.24%
  Age                   13.59%
  eTIV                  13.14%
  ASF                   12.69%
  EDUC                   7.38%
  SES                    4.23%
  M/F         \~4.22% combined

`MMSE` is the largest individual feature by this importance measure.

The MRI-derived quantitative features `nWBV`, `eTIV`, and `ASF` together
account for about 43.07% of the Random Forest impurity importance. This
is a relative model-importance measure and should not be interpreted as
a percentage of disease causation, diagnostic contribution, or clinical
risk.

Artifacts:

``` text
ml/feature_importance.csv
ml/feature_importance.png
```

## 8. Hyperparameter Tuning

Random Forest hyperparameter tuning was investigated using subject-level
cross-validation.

The investigated tuned configuration was:

``` text
n_estimators = 300
max_depth = None
max_features = sqrt
min_samples_leaf = 2
```

The tuned configuration achieved approximately:

``` text
Mean cross-validation Macro F1 = 0.6160
```

However, it did not improve the fixed holdout:

  Model                      Holdout Accuracy   Holdout Macro F1
  ------------------------ ------------------ ------------------
  Original Random Forest           **74.67%**         **70.77%**
  Tuned Random Forest                  73.33%             69.55%

Therefore, the original Random Forest was retained as the live inference
model.

Research conclusion:

> Hyperparameter tuning was investigated using subject-level
> cross-validation. Although the tuned configuration improved mean
> cross-validation Macro-F1, it did not improve performance on the fixed
> holdout set; therefore, the original Random Forest was retained as the
> current inference model.

## 9. Experimental Progression-Risk Baseline

OASIS-2 is longitudinal, so an additional experimental experiment
investigated whether features from an earlier visit could predict
whether CDR would worsen at the subsequent visit.

The experiment:

-   constructed consecutive visit pairs
-   used features from the earlier visit only
-   defined the target as future CDR \> current CDR
-   kept all visits from a subject in the same train/test partition
-   used a balanced Random Forest baseline

Results on the fixed test split:

  Metric                      Result
  ------------------------- --------
  Accuracy                    76.92%
  Precision for worsening     20.00%
  Recall for worsening        16.67%
  F1 for worsening            18.18%

There were only 6 worsening cases in the test portion.

Therefore, this experiment is **not used for deployment** and should not
be presented as a reliable early-progression predictor.

The experiment is implemented in:

``` text
ml/progression_baseline.py
```

## 10. Quantum Machine Learning

The project contains an experimental quantum machine-learning pipeline
implemented with PennyLane.

### Current QML Architecture

``` text
8 input features
      ↓
M/F → numeric encoding
      ↓
Median imputation
      ↓
StandardScaler
      ↓
PCA → 4 components
      ↓
4 qubits
      ↓
RY data encoding
      ↓
3 trainable Rot layers
      ↓
Neighboring CNOT entanglement
      ↓
Pauli-Z expectation values
      ↓
Classical output layer
      ↓
Softmax class probabilities
```

The QML experiments use the PennyLane `default.qubit` simulator.

The PCA step retains approximately **86.17% of the training variance**
in the four components.

### Hybrid QML Results

The current 40-epoch hybrid QML experiment achieved approximately:

-   Accuracy: **50.67%**
-   Macro F1: approximately **34%**

A 100-epoch experiment was also performed:

-   Accuracy: **46.67%**
-   Macro F1: approximately **37%**

Although training loss continued to decrease with more epochs, test
performance did not improve materially.

### Simple Quantum Feature Extractor Baseline

A simpler quantum feature-extractor experiment was also evaluated:

-   Accuracy: **37.33%**
-   Macro F1: **33%**

### Same-PCA Classical Comparison

A classical Logistic Regression model using the same PCA(4)
representation achieved:

-   Accuracy: **66.67%**
-   Macro F1: **58.97%**

This comparison indicates that the current QML circuit/training setup is
the main experimental bottleneck rather than PCA compression alone.

**No quantum advantage is claimed.** The QML component is research-only
and is not connected to the live prediction API.

## 11. Explainability

The frontend includes a research-oriented explainability view for the
live Random Forest prediction.

The current explanation method is a **local baseline-replacement
sensitivity analysis**:

1.  Obtain the original predicted-class probability.
2.  Replace one feature at a time with a fitted preprocessing baseline.
3.  Recalculate the predicted-class probability.
4.  Use the probability change as the local feature contribution.

Interpretation:

-   Positive contribution: replacing the feature with its baseline
    decreases the predicted-class probability, so the original feature
    supported the prediction.
-   Negative contribution: replacing the feature with its baseline
    increases the predicted-class probability, so the original feature
    opposed the prediction.

These values are **not causal effects, calibrated confidence values, or
additive feature attributions**. The implementation is not SHAP.

Advanced methods such as SHAP-based interpretation remain future work.

## 12. Backend

The backend uses FastAPI.

### Endpoints

Health check:

``` text
GET /health
```

Prediction:

``` text
POST /predict
```

The prediction endpoint accepts:

``` text
Age
EDUC
SES
MMSE
eTIV
nWBV
ASF
M_F
```

and returns:

-   predicted prototype class
-   class probabilities
-   local feature contributions

The live inference path is:

``` text
React → FastAPI /predict → ml/predict.py → Random Forest → response
```

The QML experiments are not part of this live path.

## 13. Frontend

The frontend uses React + Vite.

Current research-oriented pages include:

-   Clinical Hub
-   Benchmarks
-   Quantum Circuit
-   Explainability

The interface presents:

-   patient feature inputs
-   live Random Forest inference
-   class probabilities
-   prototype class visualization
-   model benchmark results
-   experimental QML architecture
-   local feature-contribution research output
-   research/prototype status and limitations

## 14. Project Architecture

``` text
                    OASIS-2
                       ↓
              Data Preparation
                       ↓
        Feature Filtering & Preparation
                       ↓
             Subject-Level Split
                       ↓
          ┌────────────┴────────────┐
          ↓                         ↓
   Classical ML              Experimental QML
   LR / SVM / RF             StandardScaler
          ↓                   PCA → 4 components
   Model Evaluation           4-qubit VQC
          ↓                         ↓
   Current Best: RF          Research Comparison
          ↓
      FastAPI
          ↓
       React UI
          ↓
Prediction / Probabilities / Explainability
```

## 15. Repository Structure

``` text
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
│   ├── cv_evaluate.py
│   ├── feature_importance.py
│   ├── compare_tuned_rf.py
│   ├── progression_baseline.py
│   ├── tune_rf.py
│   └── qml/
│       ├── quantum_model.py
│       ├── hybrid_model.py
│       └── qml_training_test.py
├── qml_test.py
├── .gitignore
└── README.md
```

Generated evaluation artifacts such as `confusion_matrix.png` and
feature-importance files may be kept locally depending on the intended
repository presentation.

## 16. Running the Project

### Dataset

Place the OASIS-2 research dataset in the local raw-data directory. The
raw dataset is intentionally excluded from version control.

Example:

``` text
data/raw/oasis_longitudinal_demographics.xlsx
```

### Train the Classical Models

From the repository root:

``` bash
python3 ml/train.py \
  --data data/raw/oasis_longitudinal_demographics.xlsx \
  --output ml
```

This evaluates the classical baselines and saves the selected model as:

``` text
ml/best_model.joblib
```

### Evaluate the Saved Model

``` bash
python3 ml/evaluate.py \
  --data data/raw/oasis_longitudinal_demographics.xlsx \
  --model ml/best_model.joblib
```

### Run the Experimental QML Model

``` bash
python3 ml/qml/quantum_model.py
```

The hybrid QML implementation is in:

``` text
ml/qml/hybrid_model.py
```

### Start the Backend

From the repository root:

``` bash
python3 -m uvicorn backend.app.main:app --reload
```

The API will be available at:

``` text
http://127.0.0.1:8000
```

FastAPI documentation:

``` text
http://127.0.0.1:8000/docs
```

### Start the Frontend

``` bash
cd frontend
npm install
npm run dev
```

Vite will provide the local frontend URL in the terminal, normally:

``` text
http://localhost:5173
```

## 17. Dataset

The project currently uses the **OASIS-2 longitudinal dataset** for
research experimentation.

The dataset contains multiple visits for subjects, which is why
subject-level partitioning is used to reduce the risk of placing
different visits from the same subject into both training and testing
sets.

The raw research dataset is intentionally excluded from version control
through `.gitignore`.

## 18. Research Status

### Completed

-   OASIS-2 data preparation
-   CDR-based prototype label mapping
-   subject-level train/test splitting
-   classical ML baseline comparison
-   Random Forest model selection
-   fixed-holdout evaluation
-   confusion-matrix evaluation
-   subject-level cross-validation
-   Random Forest feature-importance analysis
-   Random Forest hyperparameter-tuning experiment
-   experimental progression-risk baseline
-   experimental QML pipeline
-   QML epoch comparison
-   same-PCA classical comparison
-   FastAPI prediction endpoint
-   React frontend integration
-   live class probabilities
-   research-oriented explainability
-   research benchmark UI
-   quantum-circuit research UI

### Current Live Model

**Random Forest** is the current live inference model.

### Experimental Research Components

-   Hybrid QML
-   progression-risk prediction
-   local feature-contribution analysis

These components are not presented as clinically validated systems.

## 19. Technology Stack

-   Python
-   pandas
-   scikit-learn
-   PennyLane
-   FastAPI
-   Pydantic
-   React
-   Vite
-   JavaScript
-   Git
-   GitHub

## 20. Key Design Considerations

### Subject-Level Splitting

OASIS-2 contains repeated visits from the same subjects. Train/test and
cross-validation partitions are therefore made at the subject level to
reduce information leakage.

### Feature Preparation

The classical pipeline uses:

-   median imputation for numeric features
-   StandardScaler for numeric features
-   most-frequent imputation for `M/F`
-   one-hot encoding for `M/F`

The project uses **feature filtering & preparation**, not a formal
automated feature-selection algorithm.

### Class Imbalance

Macro F1 is used as the primary model-selection metric so that
performance across the three prototype classes is considered rather than
relying only on overall accuracy.

## 21. Limitations

This project is currently a research and demonstration prototype.

Important limitations include:

-   The model has not been clinically validated.
-   OASIS-2 is a research dataset and does not represent all
    populations.
-   The prototype labels are based on CDR mappings and are not
    equivalent to clinical diagnostic criteria.
-   The current feature-based pipeline does not perform direct
    end-to-end MRI image classification.
-   Model probabilities should not be interpreted as clinical
    confidence.
-   The fixed holdout contains only 6 AD rows.
-   The progression experiment has very few positive worsening cases and
    performed poorly on worsening recall/F1.
-   The QML component is experimental and currently underperforms the
    classical Random Forest baseline.
-   No quantum advantage has been demonstrated.
-   Larger, more diverse datasets and independent validation are
    required.
-   The current explainability method is local sensitivity analysis
    rather than a formal causal or SHAP attribution method.

## 22. Future Work

Potential future improvements include:

-   MRI image-based deep learning
-   advanced MRI feature extraction
-   SHAP-based model interpretation
-   stronger explainability methods
-   additional validation strategies
-   larger and more diverse datasets
-   external validation
-   improved hybrid quantum-classical architectures
-   QML ablation studies
-   quantum hardware experimentation
-   progression modeling with substantially more longitudinal data
-   calibration and uncertainty analysis
-   model comparison across additional algorithms
-   improved clinical research evaluation

## 23. Disclaimer

Egreen Quanta is an academic/research prototype developed for
experimentation with machine learning and hybrid quantum machine
learning.

It is **not intended for medical diagnosis, clinical decision-making, or
treatment recommendations**.

Model predictions and probabilities should not be considered medical
advice or clinical confidence.
