"use client";

import jsPDF from "jspdf";
import { useEffect, useState } from "react";

type PerformanceData = {
  aptitude: number;
  coding: number;
  interview: number;
  resume: number;
};

type ApiResponse = {
  success: boolean;
  performance: PerformanceData;
  overall: number;
  message?: string;
};

export default function PerformancePage() {
  const [performance, setPerformance] =
    useState<PerformanceData | null>(null);

  const [overall, setOverall] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {
    loadPerformance();
  }, []);

  async function loadPerformance() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/performance", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch performance");
      }

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(
          data.message || "Unable to load performance"
        );
      }

      setPerformance(data.performance);
      setOverall(data.overall);
    } catch (err) {
      console.error("Performance loading error:", err);
      setError("Unable to load performance data.");
    } finally {
      setLoading(false);
    }
  }

  function getStatus(value: number) {
    if (value >= 80) return "Excellent";
    if (value >= 60) return "Good";
    if (value >= 40) return "Needs Improvement";
    return "Start Practicing";
  }

  function getStatusClass(value: number) {
    if (value >= 80) return "excellent";
    if (value >= 60) return "good";
    if (value >= 40) return "average";
    return "low";
  }

  function getWeakestModule() {
    if (!performance) return null;

    const modules = [
      {
        name: "Aptitude",
        value: performance.aptitude,
      },
      {
        name: "Coding",
        value: performance.coding,
      },
      {
        name: "Interview",
        value: performance.interview,
      },
      {
        name: "Resume",
        value: performance.resume,
      },
    ];

    return modules.reduce((lowest, current) =>
      current.value < lowest.value
        ? current
        : lowest
    );
  }

  function getStrongestModule() {
    if (!performance) return null;

    const modules = [
      {
        name: "Aptitude",
        value: performance.aptitude,
      },
      {
        name: "Coding",
        value: performance.coding,
      },
      {
        name: "Interview",
        value: performance.interview,
      },
      {
        name: "Resume",
        value: performance.resume,
      },
    ];

    return modules.reduce((highest, current) =>
      current.value > highest.value
        ? current
        : highest
    );
  }

  function generatePDF() {
    if (!performance) return;

    try {
      setGeneratingPdf(true);

      const doc = new jsPDF();

      const strongest = getStrongestModule();
      const weakest = getWeakestModule();

      const date = new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

      // =========================
      // HEADER
      // =========================

      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text(
        "Smart Placement Portal",
        20,
        25
      );

      doc.setFontSize(16);
      doc.text(
        "Performance Report",
        20,
        37
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      doc.text(
        `Generated on: ${date}`,
        20,
        47
      );

      // =========================
      // OVERALL SCORE
      // =========================

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      doc.text(
        "Overall Performance",
        20,
        65
      );

      doc.setFontSize(28);

      doc.text(
        `${overall}%`,
        20,
        80
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      doc.text(
        `Status: ${getStatus(overall)}`,
        20,
        90
      );

      // =========================
      // MODULE PERFORMANCE
      // =========================

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      doc.text(
        "Module Performance",
        20,
        112
      );

      const moduleRows = [
        ["Aptitude", performance.aptitude],
        ["Coding", performance.coding],
        ["Interview", performance.interview],
        ["Resume", performance.resume],
      ];

      let y = 125;

      doc.setFontSize(11);

      moduleRows.forEach(([name, value]) => {
        doc.setFont("helvetica", "bold");

        doc.text(
          String(name),
          25,
          y
        );

        doc.setFont("helvetica", "normal");

        doc.text(
          `${value}%`,
          90,
          y
        );

        doc.text(
          getStatus(Number(value)),
          120,
          y
        );

        y += 14;
      });

      // =========================
      // ANALYSIS
      // =========================

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      doc.text(
        "Performance Analysis",
        20,
        y + 12
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const analysisText =
        strongest && weakest
          ? `Your strongest area is ${strongest.name} with a score of ${strongest.value}%. Your current focus area should be ${weakest.name}, which has a score of ${weakest.value}%.`
          : "Continue practicing all placement preparation modules.";

      const analysisLines =
        doc.splitTextToSize(
          analysisText,
          170
        );

      doc.text(
        analysisLines,
        20,
        y + 25
      );

      // =========================
      // RECOMMENDATIONS
      // =========================

      let recommendationY =
        y + 25 + analysisLines.length * 6 + 15;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);

      doc.text(
        "Recommended Focus",
        20,
        recommendationY
      );

      recommendationY += 12;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);

      const recommendations = [
        "Practice aptitude questions regularly.",
        "Solve coding problems and improve problem-solving skills.",
        "Practice technical and HR interview questions.",
        "Keep your resume updated and ATS-friendly.",
        "Review your weakest module and improve it consistently.",
      ];

      recommendations.forEach(
        (recommendation, index) => {
          const lines =
            doc.splitTextToSize(
              `${index + 1}. ${recommendation}`,
              170
            );

          doc.text(
            lines,
            20,
            recommendationY
          );

          recommendationY +=
            lines.length * 6 + 5;
        }
      );

      // =========================
      // FOOTER
      // =========================

      const pageHeight =
        doc.internal.pageSize.height;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");

      doc.text(
        "Generated by Smart Placement Portal",
        20,
        pageHeight - 15
      );

      doc.text(
        "Keep learning. Keep practicing. Keep improving.",
        20,
        pageHeight - 9
      );

      // =========================
      // DOWNLOAD
      // =========================

      doc.save(
        "Smart-Placement-Performance-Report.pdf"
      );
    } catch (error) {
      console.error(
        "PDF generation error:",
        error
      );

      alert(
        "Unable to generate performance PDF."
      );
    } finally {
      setGeneratingPdf(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <div className="loadingCard">
          <div className="loader"></div>

          <h2>
            Loading Performance...
          </h2>

          <p>
            Please wait while we fetch your
            performance data.
          </p>
        </div>
      </main>
    );
  }

  if (error || !performance) {
    return (
      <main className="page">
        <div className="errorCard">
          <div className="errorIcon">
            !
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error ||
              "Performance data not available."}
          </p>

          <button
            onClick={loadPerformance}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  const modules = [
    {
      name: "Aptitude",
      value: performance.aptitude,
      icon: "🧠",
      description:
        "Logical reasoning & quantitative ability",
    },
    {
      name: "Coding",
      value: performance.coding,
      icon: "💻",
      description:
        "Programming & problem solving",
    },
    {
      name: "Interview",
      value: performance.interview,
      icon: "🎤",
      description:
        "Interview preparation & communication",
    },
    {
      name: "Resume",
      value: performance.resume,
      icon: "📄",
      description:
        "Resume building & profile readiness",
    },
  ];

  return (
    <main className="page">
      <div className="container">

        {/* HEADER */}
        <section className="header">
          <div>
            <p className="eyebrow">
              SMART PLACEMENT PORTAL
            </p>

            <h1>
              Performance Tracking
            </h1>

            <p className="subtitle">
              Track your placement preparation
              progress across all learning
              modules.
            </p>
          </div>

          <div className="headerButtons">

            <button
              className="refreshButton"
              onClick={loadPerformance}
            >
              ↻ Refresh
            </button>

            <button
              className="pdfButton"
              onClick={generatePDF}
              disabled={generatingPdf}
            >
              {generatingPdf
                ? "Generating..."
                : "📄 Download PDF"}
            </button>

          </div>
        </section>

        {/* OVERALL PERFORMANCE */}
        <section className="overallCard">

          <div className="overallLeft">
            <p className="smallTitle">
              OVERALL PERFORMANCE
            </p>

            <h2>
              {overall}%
            </h2>

            <p className="status">
              {getStatus(overall)}
            </p>

            <p className="overallDescription">
              Your overall placement preparation
              score is calculated from all major
              modules.
            </p>
          </div>

          <div className="progressCircle">
            <div
              className="circle"
              style={{
                background: `conic-gradient(
                  #111 ${overall * 3.6}deg,
                  #e5e7eb ${overall * 3.6}deg
                )`,
              }}
            >
              <div className="circleInner">
                <strong>
                  {overall}%
                </strong>

                <span>
                  Overall
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* MODULES */}
        <section className="section">

          <div className="sectionHeader">
            <div>
              <h2>
                Module Performance
              </h2>

              <p>
                Your progress in each placement
                preparation area.
              </p>
            </div>
          </div>

          <div className="moduleGrid">

            {modules.map((module) => (
              <div
                className="moduleCard"
                key={module.name}
              >

                <div className="moduleTop">

                  <div className="moduleIcon">
                    {module.icon}
                  </div>

                  <div className="moduleInfo">
                    <h3>
                      {module.name}
                    </h3>

                    <p>
                      {module.description}
                    </p>
                  </div>

                </div>

                <div className="scoreRow">

                  <strong>
                    {module.value}%
                  </strong>

                  <span
                    className={`badge ${getStatusClass(
                      module.value
                    )}`}
                  >
                    {getStatus(
                      module.value
                    )}
                  </span>

                </div>

                <div className="progressBar">
                  <div
                    className="progressFill"
                    style={{
                      width: `${module.value}%`,
                    }}
                  ></div>
                </div>

              </div>
            ))}

          </div>
        </section>

        {/* SUMMARY */}
        <section className="summaryCard">

          <div>
            <p className="smallTitle">
              PERFORMANCE SUMMARY
            </p>

            <h2>
              Keep improving your skills 🚀
            </h2>

            <p>
              Complete aptitude tests, coding
              challenges, interview preparation
              and resume activities to improve
              your overall performance.
            </p>
          </div>

          <div className="summaryStats">

            <div>
              <strong>4</strong>
              <span>
                Modules
              </span>
            </div>

            <div>
              <strong>
                {overall}%
              </strong>

              <span>
                Overall Score
              </span>
            </div>

          </div>

        </section>

      </div>

      <style jsx>{`

        * {
          box-sizing: border-box;
        }

        .page {
          min-height: 100vh;
          background: #f6f7fb;
          padding: 40px 20px;
        }

        .container {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 30px;
        }

        .headerButtons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .eyebrow {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
          color: #6b7280;
        }

        h1 {
          margin: 0;
          font-size: 34px;
          line-height: 1.2;
          color: #111827;
        }

        .subtitle {
          margin: 10px 0 0;
          color: #6b7280;
          font-size: 15px;
        }

        .refreshButton,
        .pdfButton {
          border: 1px solid #d1d5db;
          background: white;
          color: #111827;
          padding: 11px 18px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .refreshButton:hover {
          background: #f3f4f6;
        }

        .pdfButton {
          background: #111827;
          color: white;
          border-color: #111827;
        }

        .pdfButton:hover {
          background: #374151;
        }

        .pdfButton:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .overallCard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
          margin-bottom: 35px;
        }

        .overallLeft {
          flex: 1;
        }

        .smallTitle {
          margin: 0 0 8px;
          color: #6b7280;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .overallLeft h2 {
          margin: 0;
          font-size: 52px;
          color: #111827;
        }

        .status {
          margin: 5px 0 10px;
          font-size: 15px;
          font-weight: 700;
          color: #111827;
        }

        .overallDescription {
          max-width: 500px;
          margin: 0;
          color: #6b7280;
          line-height: 1.6;
          font-size: 14px;
        }

        .progressCircle {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circle {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circleInner {
          width: 118px;
          height: 118px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }

        .circleInner strong {
          font-size: 28px;
          color: #111827;
        }

        .circleInner span {
          margin-top: 2px;
          font-size: 12px;
          color: #6b7280;
        }

        .section {
          margin-bottom: 35px;
        }

        .sectionHeader {
          margin-bottom: 18px;
        }

        .sectionHeader h2 {
          margin: 0;
          font-size: 22px;
          color: #111827;
        }

        .sectionHeader p {
          margin: 6px 0 0;
          color: #6b7280;
          font-size: 14px;
        }

        .moduleGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px;
        }

        .moduleCard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 22px;
        }

        .moduleTop {
          display: flex;
          gap: 15px;
          align-items: center;
          margin-bottom: 22px;
        }

        .moduleIcon {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 23px;
          flex-shrink: 0;
        }

        .moduleInfo h3 {
          margin: 0;
          font-size: 17px;
          color: #111827;
        }

        .moduleInfo p {
          margin: 4px 0 0;
          color: #6b7280;
          font-size: 12px;
          line-height: 1.4;
        }

        .scoreRow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .scoreRow strong {
          font-size: 22px;
          color: #111827;
        }

        .badge {
          font-size: 11px;
          font-weight: 700;
          padding: 5px 9px;
          border-radius: 20px;
        }

        .excellent {
          background: #dcfce7;
          color: #166534;
        }

        .good {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .average {
          background: #fef3c7;
          color: #92400e;
        }

        .low {
          background: #f3f4f6;
          color: #4b5563;
        }

        .progressBar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 20px;
          overflow: hidden;
        }

        .progressFill {
          height: 100%;
          background: #111827;
          border-radius: 20px;
          transition: width 0.4s ease;
        }

        .summaryCard {
          background: #111827;
          color: white;
          border-radius: 18px;
          padding: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .summaryCard .smallTitle {
          color: #9ca3af;
        }

        .summaryCard h2 {
          margin: 5px 0 8px;
          font-size: 22px;
        }

        .summaryCard p {
          margin: 0;
          max-width: 650px;
          color: #d1d5db;
          font-size: 14px;
          line-height: 1.6;
        }

        .summaryStats {
          display: flex;
          gap: 30px;
          flex-shrink: 0;
        }

        .summaryStats div {
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 70px;
        }

        .summaryStats strong {
          font-size: 24px;
        }

        .summaryStats span {
          margin-top: 4px;
          color: #9ca3af;
          font-size: 12px;
        }

        .loadingCard,
        .errorCard {
          width: 100%;
          max-width: 500px;
          margin: 100px auto;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          padding: 40px;
          text-align: center;
        }

        .loadingCard h2,
        .errorCard h2 {
          margin: 15px 0 8px;
          color: #111827;
        }

        .loadingCard p,
        .errorCard p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .loader {
          width: 42px;
          height: 42px;
          margin: auto;
          border: 4px solid #e5e7eb;
          border-top-color: #111827;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .errorIcon {
          width: 45px;
          height: 45px;
          margin: auto;
          border-radius: 50%;
          background: #fee2e2;
          color: #b91c1c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: bold;
        }

        .errorCard button {
          margin-top: 20px;
          padding: 11px 20px;
          border: none;
          border-radius: 9px;
          background: #111827;
          color: white;
          cursor: pointer;
          font-weight: 600;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {

          .page {
            padding: 25px 15px;
          }

          .header {
            flex-direction: column;
          }

          .headerButtons {
            width: 100%;
            justify-content: stretch;
          }

          .refreshButton,
          .pdfButton {
            flex: 1;
          }

          h1 {
            font-size: 28px;
          }

          .overallCard {
            padding: 22px;
            flex-direction: column;
            align-items: flex-start;
          }

          .progressCircle {
            width: 100%;
          }

          .moduleGrid {
            grid-template-columns: 1fr;
          }

          .summaryCard {
            flex-direction: column;
            align-items: flex-start;
          }

          .summaryStats {
            width: 100%;
            justify-content: space-between;
          }
        }

        @media (max-width: 480px) {

          .page {
            padding: 18px 12px;
          }

          h1 {
            font-size: 25px;
          }

          .subtitle {
            font-size: 13px;
          }

          .headerButtons {
            flex-direction: column;
          }

          .refreshButton,
          .pdfButton {
            width: 100%;
          }

          .overallCard {
            padding: 18px;
            border-radius: 14px;
          }

          .overallLeft h2 {
            font-size: 42px;
          }

          .circle {
            width: 125px;
            height: 125px;
          }

          .circleInner {
            width: 98px;
            height: 98px;
          }

          .circleInner strong {
            font-size: 23px;
          }

          .moduleCard {
            padding: 18px;
          }

          .summaryCard {
            padding: 20px;
          }

          .summaryStats {
            gap: 15px;
          }

          .loadingCard,
          .errorCard {
            margin: 50px auto;
            padding: 25px 18px;
          }
        }

      `}</style>
    </main>
  );
}