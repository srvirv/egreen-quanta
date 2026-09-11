import pandas as pd

from sklearn.model_selection import StratifiedKFold
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report


FEATURES = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF", "M/F"]
NUMERIC = ["Age", "EDUC", "SES", "MMSE", "eTIV", "nWBV", "ASF"]
CATEGORICAL = ["M/F"]
LABELS = ["Normal", "MCI-like", "AD"]


df = pd.read_excel(
    "data/raw/oasis_longitudinal_demographics-8d83e569fa2e2d30.xlsx"
)

df["target"] = df["CDR"].map({
    0: "Normal",
    0.5: "MCI-like",
    1: "AD",
    2: "AD"
})

df = df.dropna(
    subset=["target", "Subject ID"]
).copy()


def make_preprocessor():
    return ColumnTransformer([
        (
            "num",
            Pipeline([
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler())
            ]),
            NUMERIC
        ),
        (
            "cat",
            Pipeline([
                ("imputer", SimpleImputer(strategy="most_frequent")),
                ("onehot", OneHotEncoder(handle_unknown="ignore"))
            ]),
            CATEGORICAL
        )
    ])


subject_info = (
    df.groupby("Subject ID")["CDR"]
    .max()
    .reset_index(name="max_cdr")
)

subject_info["subject_target"] = subject_info["max_cdr"].map({
    0: "Normal",
    0.5: "MCI-like",
    1: "AD",
    2: "AD"
})


cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


all_scores = {
    "Normal": [],
    "MCI-like": [],
    "AD": []
}


for fold, (train_sub_idx, test_sub_idx) in enumerate(
    cv.split(
        subject_info["Subject ID"],
        subject_info["subject_target"]
    ),
    1
):

    train_ids = set(
        subject_info.iloc[train_sub_idx]["Subject ID"]
    )

    test_ids = set(
        subject_info.iloc[test_sub_idx]["Subject ID"]
    )

    train = df[
        df["Subject ID"].isin(train_ids)
    ]

    test = df[
        df["Subject ID"].isin(test_ids)
    ]


    model = RandomForestClassifier(
        n_estimators=300,
        max_depth=None,
        min_samples_leaf=2,
        max_features="sqrt",
        class_weight="balanced",
        random_state=42
    )


    pipeline = Pipeline([
        ("preprocessing", make_preprocessor()),
        ("model", model)
    ])


    pipeline.fit(
        train[FEATURES],
        train["target"]
    )


    pred = pipeline.predict(
        test[FEATURES]
    )


    report = classification_report(
        test["target"],
        pred,
        labels=LABELS,
        output_dict=True,
        zero_division=0
    )


    for label in LABELS:
        all_scores[label].append(
            report[label]["f1-score"]
        )


    print(f"\nFold {fold}")
    print("-" * 50)

    for label in LABELS:
        print(
            f"{label}: "
            f"F1 = {report[label]['f1-score']:.4f}"
        )


print("\n")
print("TUNED RANDOM FOREST — MEAN CLASS F1")
print("=" * 60)


for label in LABELS:

    mean_f1 = (
        sum(all_scores[label])
        / len(all_scores[label])
    )

    print(
        f"{label}: "
        f"Mean F1 = {mean_f1:.4f}"
    )