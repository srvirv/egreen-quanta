import React, { useState } from "react";

/*
 * Egreen Quanta - Explainability Page
 * SIH #139
 *
 * IMPORTANT:
 * This is a research-prototype visualization.
 * MRI heatmap and attribution values below are mock/precomputed
 * placeholders and are NOT clinically validated explanations.
 */

const prediction = {
  patientId: "EQ-8832",
  prediction: "MCI-like",
  confidence: 71,
  probabilities: {
    Normal: 12,
    "MCI-like": 71,
    AD: 17,
  },
};

const featureAttributions = [
  {
    feature: "MMSE",
    value: "24",
    contribution: "High",
    description: "Strong model contribution",
  },
  {
    feature: "nWBV",
    value: "0.70",
    contribution: "High",
    description: "Strong model contribution",
  },
  {
    feature: "Age",
    value: "75",
    contribution: "Moderate",
    description: "Moderate model contribution",
  },
  {
    feature: "eTIV",
    value: "1500",
    contribution: "Moderate",
    description: "Moderate model contribution",
  },
  {
    feature: "EDUC",
    value: "14",
    contribution: "Low",
    description: "Lower model contribution",
  },
  {
    feature: "SES",
    value: "2",
    contribution: "Low",
    description: "Lower model contribution",
  },
];

const modelResults = [
  {
    model: "Random Forest",
    accuracy: "74.67%",
    macroF1: "70.77%",
    status: "Best baseline",
  },
  {
    model: "SVM",
    accuracy: "66.67%",
    macroF1: "60.95%",
    status: "Baseline",
  },
  {
    model: "Logistic Regression",
    accuracy: "66.67%",
    macroF1: "58.97%",
    status: "Baseline",
  },
];

const confusionMatrix = [
  [33, 5, 2],
  [7, 17, 5],
  [0, 0, 6],
];

function ProbabilityBar({ label, value }) {
  return (
    <div style={styles.probabilityRow}>
      <div style={styles.probabilityHeader}>
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>

      <div style={styles.progressBackground}>
        <div
          style={{
            ...styles.progressFill,
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
}

function AttributionBadge({ contribution }) {
  let className = "low";

  if (contribution === "High") {
    className = "high";
  }

  if (contribution === "Moderate") {
    className = "moderate";
  }

  return (
    <span style={styles[`badge_${className}`]}>
      {contribution}
    </span>
  );
}

function BrainVisualization({ view }) {
  return (
    <div style={styles.brainContainer}>
      <div style={styles.brainHeader}>
        <div>
          <span style={styles.smallLabel}>MRI VIEW</span>

          <h3 style={styles.brainTitle}>
            {view}
          </h3>
        </div>

        <span style={styles.prototypeBadge}>
          RESEARCH PROTOTYPE
        </span>
      </div>

      <div style={styles.brainImage}>
        <div
          style={{
            ...styles.brainShape,
            borderRadius:
              view === "Coronal"
                ? "50% 50% 45% 45%"
                : "48% 52% 42% 58%",
          }}
        >
          <div style={styles.brainInner} />

          <div style={styles.hotspotOne} />

          <div style={styles.hotspotTwo} />

          <div style={styles.hotspotThree} />

          <div style={styles.scanLine} />
        </div>

        <div style={styles.legend}>
          <span>
            <i style={styles.orangeDot} />
            Higher model influence
          </span>

          <span>
            <i style={styles.grayDot} />
            Lower model influence
          </span>
        </div>
      </div>

      <p style={styles.imageNote}>
        Prototype visualization using a precomputed/mock attention
        overlay. This is not a clinically validated MRI explanation.
      </p>
    </div>
  );
}

export default function Explainability() {
  const [view, setView] = useState("Coronal");

  return (
    <div style={styles.page}>
      {/* PAGE HEADER */}

      <div style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>
            EGREEN QUANTA
          </p>

          <h1 style={styles.title}>
            Explainability
          </h1>

          <p style={styles.subtitle}>
            Understand which features and regions influenced the
            research model's prediction.
          </p>
        </div>

        <div style={styles.researchBadge}>
          Research Prototype
        </div>
      </div>

      {/* DISCLAIMER */}

      <div style={styles.disclaimer}>
        <div style={styles.disclaimerIcon}>
          !
        </div>

        <div>
          <strong>
            Research prototype — not a clinical diagnosis
          </strong>

          <p>
            Model probabilities and visual explanations are intended
            for research demonstration only and have not been
            clinically validated.
          </p>
        </div>
      </div>

      {/* PREDICTION SUMMARY */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              PREDICTION SUMMARY
            </p>

            <h2 style={styles.sectionTitle}>
              Patient #{prediction.patientId}
            </h2>
          </div>

          <div style={styles.predictionBadge}>
            {prediction.prediction}
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.confidenceCard}>
            <span style={styles.cardLabel}>
              Model Prediction
            </span>

            <div style={styles.predictionText}>
              {prediction.prediction}
            </div>

            <div style={styles.confidenceValue}>
              {prediction.confidence}%
            </div>

            <span style={styles.confidenceLabel}>
              Top-class probability
            </span>
          </div>

          <div style={styles.probabilityCard}>
            <div style={styles.cardTitle}>
              Class Probabilities
            </div>

            <ProbabilityBar
              label="Normal"
              value={prediction.probabilities.Normal}
            />

            <ProbabilityBar
              label="MCI-like"
              value={prediction.probabilities["MCI-like"]}
            />

            <ProbabilityBar
              label="AD"
              value={prediction.probabilities.AD}
            />
          </div>
        </div>
      </section>

      {/* MRI VISUAL EXPLANATION */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              VISUAL EXPLANATION
            </p>

            <h2 style={styles.sectionTitle}>
              MRI Attention Visualization
            </h2>

            <p style={styles.sectionDescription}>
              Prototype visualization of regions that may be
              associated with the model's prediction.
            </p>
          </div>

          <div style={styles.viewToggle}>
            <button
              type="button"
              onClick={() => setView("Coronal")}
              style={{
                ...styles.toggleButton,
                ...(view === "Coronal"
                  ? styles.toggleActive
                  : {}),
              }}
            >
              Coronal
            </button>

            <button
              type="button"
              onClick={() => setView("Sagittal")}
              style={{
                ...styles.toggleButton,
                ...(view === "Sagittal"
                  ? styles.toggleActive
                  : {}),
              }}
            >
              Sagittal
            </button>
          </div>
        </div>

        <BrainVisualization view={view} />
      </section>

      {/* FEATURE ATTRIBUTION */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              MODEL ATTRIBUTION
            </p>

            <h2 style={styles.sectionTitle}>
              Feature Contributions
            </h2>

            <p style={styles.sectionDescription}>
              Prototype attribution view for the current Random
              Forest prediction.
            </p>
          </div>
        </div>

        <div style={styles.attributionGrid}>
          {featureAttributions.map((item) => (
            <div
              key={item.feature}
              style={styles.attributionCard}
            >
              <div style={styles.attributionTop}>
                <div>
                  <span style={styles.featureName}>
                    {item.feature}
                  </span>

                  <span style={styles.featureValue}>
                    {item.value}
                  </span>
                </div>

                <AttributionBadge
                  contribution={item.contribution}
                />
              </div>

              <div style={styles.attributionLine}>
                <div
                  style={{
                    ...styles.attributionFill,
                    width:
                      item.contribution === "High"
                        ? "85%"
                        : item.contribution === "Moderate"
                        ? "58%"
                        : "30%",
                  }}
                />
              </div>

              <p style={styles.attributionDescription}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* MODEL PERFORMANCE */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              MODEL PERFORMANCE
            </p>

            <h2 style={styles.sectionTitle}>
              Classical ML Comparison
            </h2>
          </div>
        </div>

        <div style={styles.modelTable}>
          <div style={styles.tableHeader}>
            <span>Model</span>
            <span>Accuracy</span>
            <span>Macro-F1</span>
            <span>Status</span>
          </div>

          {modelResults.map((model) => (
            <div
              key={model.model}
              style={styles.tableRow}
            >
              <strong>
                {model.model}
              </strong>

              <span>
                {model.accuracy}
              </span>

              <span>
                {model.macroF1}
              </span>

              <span
                style={
                  model.status === "Best baseline"
                    ? styles.bestStatus
                    : styles.normalStatus
                }
              >
                {model.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CONFUSION MATRIX */}

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionEyebrow}>
              EVALUATION
            </p>

            <h2 style={styles.sectionTitle}>
              Random Forest Confusion Matrix
            </h2>

            <p style={styles.sectionDescription}>
              Actual classes are rows and predicted classes are
              columns.
            </p>
          </div>
        </div>

        <div style={styles.matrixWrapper}>
          <div style={styles.matrixLabelsTop}>
            <span />
            <span>Normal</span>
            <span>MCI-like</span>
            <span>AD</span>
          </div>

          {confusionMatrix.map((row, rowIndex) => (
            <div
              style={styles.matrixRow}
              key={rowIndex}
            >
              <strong>
                {["Normal", "MCI-like", "AD"][rowIndex]}
              </strong>

              {row.map((value, colIndex) => (
                <div
                  key={colIndex}
                  style={{
                    ...styles.matrixCell,
                    opacity:
                      value === 0
                        ? 0.35
                        : Math.min(
                            1,
                            0.35 + value / 40
                          ),
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p style={styles.matrixNote}>
          Note: AD test-set support is small, so these results
          should not be interpreted as clinical validation.
        </p>
      </section>

      {/* METHODOLOGY */}

      <section style={styles.methodology}>
        <div style={styles.methodIcon}>
          !
        </div>

        <div>
          <h3 style={styles.methodTitle}>
            How explainability will evolve
          </h3>

          <p style={styles.methodText}>
            This interface is designed to consume actual model
            explanation outputs in future iterations. Feature
            attribution can later be connected to methods such as
            SHAP, while image-based explanations can use an
            appropriate saliency method when an authorized MRI
            model is available.
          </p>
        </div>
      </section>

      {/* FOOTER */}

      <div style={styles.footerNote}>
        Egreen Quanta • SIH #139 • Explainability Module •
        Research Prototype
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "32px",
    background: "#f6f7f9",
    color: "#17191c",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  },

  pageHeader: {
    maxWidth: "1200px",
    margin: "0 auto 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },

  eyebrow: {
    margin: 0,
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "2px",
    opacity: 0.55,
  },

  title: {
    margin: "6px 0",
    fontSize: "34px",
    lineHeight: 1.1,
    fontWeight: 800,
  },

  subtitle: {
    margin: 0,
    color: "#6c7178",
    fontSize: "14px",
    maxWidth: "600px",
  },

  researchBadge: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ffffff",
    border: "1px solid #e1e4e8",
    fontSize: "12px",
    fontWeight: 700,
    whiteSpace: "nowrap",
  },

  disclaimer: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
    padding: "16px 18px",
    display: "flex",
    gap: "12px",
    background: "#fffdf5",
    border: "1px solid #ece4c9",
    borderRadius: "14px",
  },

  disclaimerIcon: {
    fontSize: "20px",
    fontWeight: 800,
  },

  section: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
    padding: "24px",
    background: "#ffffff",
    border: "1px solid #e3e6ea",
    borderRadius: "18px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "22px",
  },

  sectionEyebrow: {
    margin: 0,
    fontSize: "10px",
    letterSpacing: "1.7px",
    fontWeight: 800,
    color: "#777d84",
  },

  sectionTitle: {
    margin: "5px 0 5px",
    fontSize: "21px",
    fontWeight: 800,
  },

  sectionDescription: {
    margin: 0,
    fontSize: "13px",
    color: "#747a81",
  },

  predictionBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#f1f3f5",
    border: "1px solid #dfe2e6",
    fontSize: "12px",
    fontWeight: 800,
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(220px, 0.8fr) minmax(320px, 1.5fr)",
    gap: "18px",
  },

  confidenceCard: {
    padding: "24px",
    borderRadius: "15px",
    background: "#f7f8fa",
    border: "1px solid #e5e7ea",
  },

  cardLabel: {
    display: "block",
    color: "#747980",
    fontSize: "12px",
    marginBottom: "10px",
  },

  predictionText: {
    fontSize: "25px",
    fontWeight: 800,
  },

  confidenceValue: {
    marginTop: "18px",
    fontSize: "42px",
    fontWeight: 900,
  },

  confidenceLabel: {
    fontSize: "11px",
    color: "#777d83",
  },

  probabilityCard: {
    padding: "24px",
    borderRadius: "15px",
    border: "1px solid #e5e7ea",
  },

  cardTitle: {
    marginBottom: "18px",
    fontWeight: 800,
    fontSize: "14px",
  },

  probabilityRow: {
    marginBottom: "17px",
  },

  probabilityHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "7px",
    fontSize: "13px",
  },

  progressBackground: {
    height: "9px",
    borderRadius: "999px",
    background: "#e9ebee",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: "999px",
    background: "#25282d",
    transition: "width 0.5s ease",
  },

  viewToggle: {
    display: "flex",
    padding: "4px",
    borderRadius: "10px",
    background: "#f1f2f4",
  },

  toggleButton: {
    border: "none",
    background: "transparent",
    padding: "8px 14px",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "12px",
  },

  toggleActive: {
    background: "#ffffff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },

  brainContainer: {
    borderRadius: "15px",
    border: "1px solid #e1e4e8",
    overflow: "hidden",
  },

  brainHeader: {
    padding: "16px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e7e9eb",
  },

  smallLabel: {
    display: "block",
    fontSize: "9px",
    letterSpacing: "1.5px",
    fontWeight: 800,
    color: "#858b91",
  },

  brainTitle: {
    margin: "3px 0 0",
    fontSize: "17px",
  },

  prototypeBadge: {
    fontSize: "9px",
    fontWeight: 800,
    letterSpacing: "1px",
    padding: "6px 9px",
    borderRadius: "999px",
    background: "#f1f2f4",
    color: "#6e7379",
  },

  brainImage: {
    minHeight: "410px",
    background:
      "radial-gradient(circle at center, #30343a 0%, #17191c 55%, #0c0e10 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },

  brainShape: {
    width: "285px",
    height: "310px",
    background:
      "radial-gradient(circle at 40% 40%, #c7cbd0 0%, #7c8289 35%, #41464c 68%, #202328 100%)",
    position: "relative",
    boxShadow:
      "0 0 45px rgba(255,255,255,0.12), inset 0 0 30px rgba(0,0,0,0.45)",
    overflow: "hidden",
  },

  brainInner: {
    position: "absolute",
    inset: "25px",
    borderRadius: "48%",
    border: "2px solid rgba(255,255,255,0.14)",
  },

  hotspotOne: {
    position: "absolute",
    width: "75px",
    height: "55px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,90,50,0.85), rgba(255,120,40,0.25), transparent 70%)",
    top: "82px",
    left: "62px",
    filter: "blur(5px)",
  },

  hotspotTwo: {
    position: "absolute",
    width: "70px",
    height: "80px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,150,60,0.8), rgba(255,100,40,0.15), transparent 70%)",
    bottom: "75px",
    right: "53px",
    filter: "blur(7px)",
  },

  hotspotThree: {
    position: "absolute",
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(255,75,40,0.7), transparent 70%)",
    top: "140px",
    right: "90px",
    filter: "blur(5px)",
  },

  scanLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "48%",
    height: "1px",
    background: "rgba(255,255,255,0.22)",
  },

  legend: {
    position: "absolute",
    bottom: "18px",
    display: "flex",
    gap: "18px",
    color: "#d5d8dc",
    fontSize: "11px",
  },

  orangeDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#ff7448",
    marginRight: "6px",
  },

  grayDot: {
    display: "inline-block",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#aeb3b9",
    marginRight: "6px",
  },

  imageNote: {
    margin: 0,
    padding: "12px 16px",
    fontSize: "11px",
    color: "#777d84",
    background: "#fafbfc",
    borderTop: "1px solid #e6e8ea",
  },

  attributionGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "12px",
  },

  attributionCard: {
    padding: "17px",
    border: "1px solid #e4e6e9",
    borderRadius: "13px",
  },

  attributionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
  },

  featureName: {
    display: "block",
    fontWeight: 800,
    fontSize: "14px",
  },

  featureValue: {
    display: "block",
    marginTop: "3px",
    fontSize: "11px",
    color: "#777d84",
  },

  attributionLine: {
    height: "7px",
    background: "#eceef0",
    borderRadius: "999px",
    marginTop: "15px",
    overflow: "hidden",
  },

  attributionFill: {
    height: "100%",
    background: "#34383e",
    borderRadius: "999px",
  },

  attributionDescription: {
    margin: "10px 0 0",
    fontSize: "11px",
    color: "#7b8086",
  },

  badge_high: {
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#eeeeef",
    fontSize: "10px",
    fontWeight: 800,
  },

  badge_moderate: {
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#f4f4f4",
    fontSize: "10px",
    fontWeight: 800,
  },

  badge_low: {
    padding: "5px 8px",
    borderRadius: "999px",
    background: "#fafafa",
    border: "1px solid #e4e4e4",
    fontSize: "10px",
    fontWeight: 800,
  },

  modelTable: {
    border: "1px solid #e2e5e8",
    borderRadius: "13px",
    overflow: "hidden",
  },

  tableHeader: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.3fr",
    padding: "13px 16px",
    background: "#f5f6f7",
    fontSize: "10px",
    fontWeight: 800,
    textTransform: "uppercase",
    color: "#747a81",
  },

  tableRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr 1.3fr",
    padding: "15px 16px",
    borderTop: "1px solid #e7e9eb",
    fontSize: "13px",
    alignItems: "center",
  },

  bestStatus: {
    fontWeight: 800,
  },

  normalStatus: {
    color: "#7a8086",
  },

  matrixWrapper: {
    maxWidth: "600px",
    display: "grid",
    gap: "5px",
  },

  matrixLabelsTop: {
    display: "grid",
    gridTemplateColumns: "110px repeat(3, 80px)",
    gap: "5px",
    textAlign: "center",
    fontSize: "10px",
    fontWeight: 800,
    color: "#737980",
  },

  matrixRow: {
    display: "grid",
    gridTemplateColumns: "110px repeat(3, 80px)",
    gap: "5px",
    alignItems: "center",
  },

  matrixCell: {
    height: "65px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#30343a",
    color: "#ffffff",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: 800,
  },

  matrixNote: {
    margin: "15px 0 0",
    fontSize: "11px",
    color: "#777d84",
  },

  methodology: {
    maxWidth: "1200px",
    margin: "0 auto 20px",
    padding: "20px",
    display: "flex",
    gap: "15px",
    background: "#ffffff",
    border: "1px solid #e2e5e8",
    borderRadius: "16px",
  },

  methodIcon: {
    fontSize: "25px",
    fontWeight: 800,
  },

  methodTitle: {
    margin: 0,
    fontSize: "15px",
  },

  methodText: {
    margin: "7px 0 0",
    fontSize: "12px",
    lineHeight: 1.6,
    color: "#737980",
  },

  footerNote: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "15px 0",
    textAlign: "center",
    fontSize: "10px",
    color: "#8a8f95",
  },
};