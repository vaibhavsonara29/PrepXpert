"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useEffect, useMemo, useState } from "react";

type Experience = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

type Education = {
  degree: string;
  institute: string;
  duration: string;
  score: string;
};

type Project = {
  name: string;
  tech: string;
  description: string;
  link: string;
};

type Profile = {
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
};

type Analysis = {
  score: number;
  atsScore: number;
  overallAssessment: string;
  strengths: string[];
  weakAreas: string[];
  missingSkills: string[];
  atsSuggestions: string[];
  sectionSuggestions: {
    summary: string;
    skills: string;
    experience: string;
    education: string;
    projects: string;
  };
  recommendedActions: string[];
  priority: string;
  placementReadiness: string;
};

const STORAGE_KEY = "prepxpert-resume";

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [template, setTemplate] = useState("modern");
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [linkedinImporting, setLinkedinImporting] =
    useState(false);

  const [linkedinMessage, setLinkedinMessage] =
    useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);
  const [analysisError, setAnalysisError] =
    useState("");

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] =
    useState("");

  const [downloading, setDownloading] =
    useState(false);

  const [uploadedResume, setUploadedResume] =
    useState<{
      name: string;
      type: string;
      size: number;
      text: string;
    } | null>(null);

  const [profile, setProfile] = useState<Profile>({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    website: "",
    summary: "",
  });

  const [skills, setSkills] = useState<string[]>([]);

  const [skillInput, setSkillInput] =
    useState("");

  const [experience, setExperience] =
    useState<Experience[]>([
      {
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ]);

  const [education, setEducation] =
    useState<Education[]>([
      {
        degree: "",
        institute: "",
        duration: "",
        score: "",
      },
    ]);

  const [projects, setProjects] =
    useState<Project[]>([
      {
        name: "",
        tech: "",
        description: "",
        link: "",
      },
    ]);

  useEffect(() => {
    try {
      const savedResume =
        localStorage.getItem(STORAGE_KEY);

      if (!savedResume) return;

      const data = JSON.parse(savedResume);

      if (data.profile) {
        setProfile(data.profile);
      }

      if (data.skills) {
        setSkills(data.skills);
      }

      if (data.experience) {
        setExperience(data.experience);
      }

      if (data.education) {
        setEducation(data.education);
      }

      if (data.projects) {
        setProjects(data.projects);
      }

      if (data.template) {
        setTemplate(data.template);
      }
    } catch (error) {
      console.error(
        "Unable to load saved resume:",
        error
      );
    }
  }, []);

  useEffect(() => {
    try {
      const savedUpload =
        localStorage.getItem(
          "prepxpert-uploaded-resume"
        );

      if (savedUpload) {
        setUploadedResume(
          JSON.parse(savedUpload)
        );
      }
    } catch (error) {
      console.error(
        "Unable to load uploaded resume:",
        error
      );
    }
  }, []);

  const completion = useMemo(() => {
    const fields = [
      profile.name,
      profile.role,
      profile.email,
      profile.phone,
      profile.linkedin,
      profile.github,
      profile.summary,
      education[0]?.degree,
      education[0]?.institute,
      skills.length > 0 ? "yes" : "",
      projects[0]?.name,
    ];

    const completed =
      fields.filter(Boolean).length;

    return Math.round(
      (completed / fields.length) * 100
    );
  }, [
    profile,
    education,
    skills,
    projects,
  ]);

  function updateProfile(
    field: keyof Profile,
    value: string
  ) {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function importLinkedInProfile() {
    try {
      setLinkedinImporting(true);
      setLinkedinMessage("");

      const response = await fetch(
        "/api/linkedin/profile",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to import LinkedIn profile."
        );
      }

      const linkedinProfile = data.profile;

      setProfile((prev) => ({
        ...prev,
        name:
          linkedinProfile?.name ||
          prev.name,
        email:
          linkedinProfile?.email ||
          prev.email,
      }));

      setLinkedinMessage(
        "✓ LinkedIn profile imported successfully."
      );
    } catch (error) {
      console.error(
        "LinkedIn resume import error:",
        error
      );

      setLinkedinMessage(
        error instanceof Error
          ? error.message
          : "Failed to import LinkedIn profile."
      );
    } finally {
      setLinkedinImporting(false);
    }
  }

  function addSkill() {
    const skill = skillInput.trim();

    if (!skill) return;

    if (!skills.includes(skill)) {
      setSkills((prev) => [
        ...prev,
        skill,
      ]);
    }

    setSkillInput("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) =>
      prev.filter(
        (item) => item !== skill
      )
    );
  }

  function updateExperience(
    index: number,
    field: keyof Experience,
    value: string
  ) {
    setExperience((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  }

  function updateEducation(
    index: number,
    field: keyof Education,
    value: string
  ) {
    setEducation((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  }

  function updateProject(
    index: number,
    field: keyof Project,
    value: string
  ) {
    setProjects((prev) => {
      const updated = [...prev];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return updated;
    });
  }

  function addExperience() {
    setExperience((prev) => [
      ...prev,
      {
        company: "",
        role: "",
        duration: "",
        description: "",
      },
    ]);
  }

  function addEducation() {
    setEducation((prev) => [
      ...prev,
      {
        degree: "",
        institute: "",
        duration: "",
        score: "",
      },
    ]);
  }

  function addProject() {
    setProjects((prev) => [
      ...prev,
      {
        name: "",
        tech: "",
        description: "",
        link: "",
      },
    ]);
  }

  function saveDraft() {
    try {
      const resumeData = {
        profile,
        skills,
        experience,
        education,
        projects,
        template,
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(resumeData)
      );

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Unable to save resume:",
        error
      );

      alert(
        "Unable to save resume."
      );
    }
  }

  async function analyzeResume() {
    try {
      setAnalyzing(true);
      setAnalysisError("");
      setAnalysis(null);

      const resumeData = {
        profile,
        skills,
        experience,
        education,
        projects,
      };

      const response = await fetch(
        "/api/resume/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            resumeData
          ),
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Resume analysis failed"
        );
      }

      setAnalysis(data.analysis);

      localStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(
          data.analysis
        )
      );
    } catch (error) {
      console.error(
        "Resume analysis error:",
        error
      );

      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Failed to analyze resume"
      );
    } finally {
      setAnalyzing(false);
    }
  }

  async function uploadResume(
    file: File
  ) {
    try {
      setUploading(true);
      setUploadError("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response = await fetch(
        "/api/resume/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Resume upload failed"
        );
      }

      const uploaded = {
        name: data.file.name,
        type: data.file.type,
        size: data.file.size,
        text: data.text,
      };

      setUploadedResume(
        uploaded
      );

      localStorage.setItem(
        "prepxpert-uploaded-resume",
        JSON.stringify(uploaded)
      );
    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      setUploadError(
        error instanceof Error
          ? error.message
          : "Failed to upload resume"
      );
    } finally {
      setUploading(false);
    }
  }

  function normalizeUrl(value: string) {
    const trimmed = value.trim();

    if (!trimmed) return "";

    if (
      trimmed.startsWith("http://") ||
      trimmed.startsWith("https://")
    ) {
      return trimmed;
    }

    return `https://${trimmed}`;
  }

  function handleResumeFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    uploadResume(file);

    event.target.value = "";
  }

  /*
   * ========================================================
   * PDF DOWNLOAD
   * ========================================================
   *
   * Only .resume-paper is converted into PDF.
   *
   * If the resume fits on one A4 page:
   *       -> exactly ONE PDF page
   *
   * If the resume is longer:
   *       -> additional pages are created only when needed.
   *
   * Website footer/header/editor are never captured.
   */

  async function downloadPDF() {
    if (!showPreview) {
      setShowPreview(true);
      return;
    }

    const resumeElement =
      document.querySelector(
        ".resume-paper"
      ) as HTMLElement | null;

    if (!resumeElement) {
      alert(
        "Resume preview not found."
      );

      return;
    }

    try {
      setDownloading(true);

      /*
       * Temporarily create a fixed A4-width
       * capture area.
       */
      const originalWidth =
        resumeElement.style.width;

      const originalMaxWidth =
        resumeElement.style.maxWidth;

      const originalMinHeight =
        resumeElement.style.minHeight;

      const originalBoxShadow =
        resumeElement.style.boxShadow;

      resumeElement.style.width =
        "794px";

      resumeElement.style.maxWidth =
        "794px";

      resumeElement.style.minHeight =
        "auto";

      resumeElement.style.boxShadow =
        "none";

      /*
       * Wait for browser layout.
       */
      await new Promise((resolve) =>
        setTimeout(resolve, 300)
      );

      /*
       * Get the actual content height.
       *
       * This is important because we don't want
       * an artificially forced 1123px height to
       * create an unnecessary second page.
       */
      const contentHeight =
        resumeElement.scrollHeight;

      const canvas =
        await html2canvas(
          resumeElement,
          {
            scale: 2,
            useCORS: true,
            backgroundColor:
              "#ffffff",
            logging: false,
            scrollX: 0,
            scrollY: 0,
            width: 794,
            height: contentHeight,
            windowWidth: 794,
            windowHeight:
              Math.max(
                contentHeight,
                1123
              ),
          }
        );

      /*
       * Restore preview styles.
       */
      resumeElement.style.width =
        originalWidth;

      resumeElement.style.maxWidth =
        originalMaxWidth;

      resumeElement.style.minHeight =
        originalMinHeight;

      resumeElement.style.boxShadow =
        originalBoxShadow;

      const pdf =
        new jsPDF({
          orientation:
            "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });

      const pageWidth = 210;
      const pageHeight = 297;

      /*
       * Convert canvas pixels to A4 mm.
       */
      const pxPerMm =
        canvas.width /
        pageWidth;

      /*
       * A4 page height in canvas pixels.
       */
      const pageHeightPx =
        Math.floor(
          pageHeight * pxPerMm
        );

      /*
       * If content is already smaller than
       * one A4 page, add it once only.
       */
      if (
        canvas.height <=
        pageHeightPx
      ) {
        const imgData =
          canvas.toDataURL(
            "image/png",
            1.0
          );

        const imgHeight =
          (canvas.height *
            pageWidth) /
          canvas.width;

        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pageWidth,
          imgHeight,
          undefined,
          "FAST"
        );
      } else {
        /*
         * Long resume:
         * split the canvas into exact A4-height
         * sections.
         */
        let sourceY = 0;
        let pageNumber = 0;

        while (
          sourceY <
          canvas.height
        ) {
          const remainingHeight =
            canvas.height -
            sourceY;

          const currentHeight =
            Math.min(
              pageHeightPx,
              remainingHeight
            );

          const pageCanvas =
            document.createElement(
              "canvas"
            );

          pageCanvas.width =
            canvas.width;

          pageCanvas.height =
            currentHeight;

          const context =
            pageCanvas.getContext(
              "2d"
            );

          if (!context) {
            throw new Error(
              "Unable to create PDF canvas."
            );
          }

          context.fillStyle =
            "#ffffff";

          context.fillRect(
            0,
            0,
            pageCanvas.width,
            pageCanvas.height
          );

          context.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            currentHeight,
            0,
            0,
            canvas.width,
            currentHeight
          );

          const pageImage =
            pageCanvas.toDataURL(
              "image/png",
              1.0
            );

          const pageImageHeight =
            (currentHeight *
              pageWidth) /
            canvas.width;

          /*
           * Only add a new page if this is
           * not the first page.
           */
          if (pageNumber > 0) {
            pdf.addPage();
          }

          pdf.addImage(
            pageImage,
            "PNG",
            0,
            0,
            pageWidth,
            pageImageHeight,
            undefined,
            "FAST"
          );

          addProjectPdfLinksForPage(
            pdf,
            resumeElement,
            canvas,
            pageWidth,
            pageHeightPx,
            sourceY,
            currentHeight
          );

          sourceY +=
            currentHeight;

          pageNumber++;
        }
      }

      /*
       * Clean filename.
       */
      const safeName =
        profile.name
          .trim()
          .replace(
            /[^a-zA-Z0-9]+/g,
            "_"
          )
          .replace(
            /^_+|_+$/g,
            ""
          ) ||
        "Resume";

      pdf.save(
        `${safeName}_Resume.pdf`
      );
    } catch (error) {
      console.error(
        "PDF DOWNLOAD ERROR:",
        error
      );

      alert(
        "Unable to generate PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="resume-page">
      <header className="topbar">
        <div>
          <div className="brand">
            Prep
            <span>Xpert</span>
          </div>

          <div className="page-title">
            Resume Studio
          </div>
        </div>

        <div className="top-actions">
          <label className="upload-btn">
            {uploading
              ? "Uploading..."
              : "📄 Upload Resume"}

            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={
                handleResumeFileChange
              }
              disabled={
                uploading
              }
            />
          </label>

          <button
            className="ghost-btn"
            onClick={() => {
              setShowPreview(true);
              setTimeout(() => {
                document
                  .getElementById("resume-preview-panel")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }, 100);
            }}
          >
            Preview Resume
          </button>

          <button
            className="ghost-btn"
            onClick={saveDraft}
          >
            {saved
              ? "✓ Saved"
              : "Save Draft"}
          </button>

          <button
            className="download-btn"
            onClick={downloadPDF}
            disabled={downloading || !showPreview}
            title={
              !showPreview
                ? "Preview your resume first"
                : "Download resume as PDF"
            }
          >
            {downloading
              ? "Generating PDF..."
              : "Download PDF"}
          </button>
        </div>
      </header>

      <div className="workspace">
        <aside className="editor-panel">
          <div className="completion-card">
            <div className="completion-header">
              <div>
                <strong>
                  Resume strength
                </strong>

                <small>
                  {completion >= 80
                    ? "Excellent"
                    : completion >=
                      50
                    ? "Good progress"
                    : "Keep building"}
                </small>
              </div>

              <strong>
                {completion}%
              </strong>
            </div>

            <div className="progress">
              <div
                style={{
                  width: `${completion}%`,
                }}
              />
            </div>
          </div>

          <div className="upload-card">
            <div>
              <strong>
                {uploadedResume
                  ? "Existing Resume Imported"
                  : "Import Existing Resume"}
              </strong>

              <p>
                {uploadedResume
                  ? `${uploadedResume.name} • ${uploadedResume.type.toUpperCase()}`
                  : "Upload a PDF or DOCX resume to extract its content."}
              </p>
            </div>

            {uploadedResume && (
              <button
                className="view-upload-btn"
                onClick={() =>
                  document
                    .getElementById(
                      "uploaded-resume-text"
                    )
                    ?.scrollIntoView(
                      {
                        behavior:
                          "smooth",
                        block:
                          "center",
                      }
                    )
                }
              >
                View Extracted Text
              </button>
            )}

            {uploadError && (
              <div className="upload-error">
                {uploadError}
              </div>
            )}
          </div>

          {uploadedResume && (
            <div
              id="uploaded-resume-text"
              className="uploaded-text-card"
            >
              <strong>
                Extracted Resume
                Content
              </strong>

              <p>
                The uploaded resume was
                read successfully.
              </p>

              <textarea
                value={
                  uploadedResume.text
                }
                readOnly
                rows={10}
              />
            </div>
          )}

          <div className="section-tabs">
            <button
              className={
                activeSection ===
                "profile"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "profile"
                )
              }
            >
              👤 Profile
            </button>

            <button
              className={
                activeSection ===
                "experience"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "experience"
                )
              }
            >
              💼 Experience
            </button>

            <button
              className={
                activeSection ===
                "education"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "education"
                )
              }
            >
              🎓 Education
            </button>

            <button
              className={
                activeSection ===
                "projects"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "projects"
                )
              }
            >
              🚀 Projects
            </button>

            <button
              className={
                activeSection ===
                "skills"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "skills"
                )
              }
            >
              ⚡ Skills
            </button>

            <button
              className={
                activeSection ===
                "design"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveSection(
                  "design"
                )
              }
            >
              🎨 Design
            </button>
          </div>

          <div className="form-area">
            {activeSection ===
              "profile" && (
              <section>
                <SectionHeading
                  title="Personal Information"
                  description="Build a strong professional identity."
                />

                <div className="linkedin-import-card">
                  <div>
                    <strong>
                      🔗 Import from LinkedIn
                    </strong>

                    <p>
                      Your LinkedIn account is connected.
                      Import your basic profile information
                      into the resume.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="linkedin-import-btn"
                    onClick={importLinkedInProfile}
                    disabled={linkedinImporting}
                  >
                    {linkedinImporting
                      ? "Importing..."
                      : "Import LinkedIn Profile"}
                  </button>

                  {linkedinMessage && (
                    <div className="linkedin-import-message">
                      {linkedinMessage}
                    </div>
                  )}
                </div>

                <Input
                  label="Full Name"
                  placeholder="e.g. Your Name"
                  value={
                    profile.name
                  }
                  onChange={(
                    value
                  ) =>
                    updateProfile(
                      "name",
                      value
                    )
                  }
                />

                <Input
                  label="Professional Title"
                  placeholder="e.g. Full Stack Developer"
                  value={
                    profile.role
                  }
                  onChange={(
                    value
                  ) =>
                    updateProfile(
                      "role",
                      value
                    )
                  }
                />

                <div className="two-col">
                  <Input
                    label="Email"
                    placeholder="you@email.com"
                    value={
                      profile.email
                    }
                    onChange={(
                      value
                    ) =>
                      updateProfile(
                        "email",
                        value
                      )
                    }
                  />

                  <Input
                    label="Phone"
                    placeholder="+91 XXXXX XXXXX"
                    value={
                      profile.phone
                    }
                    onChange={(
                      value
                    ) =>
                      updateProfile(
                        "phone",
                        value
                      )
                    }
                  />
                </div>

                <Input
                  label="Location"
                  placeholder="Ahmedabad, India"
                  value={
                    profile.location
                  }
                  onChange={(
                    value
                  ) =>
                    updateProfile(
                      "location",
                      value
                    )
                  }
                />

                <Input
                  label="LinkedIn"
                  placeholder="linkedin.com/in/username"
                  value={
                    profile.linkedin
                  }
                  onChange={(
                    value
                  ) =>
                    updateProfile(
                      "linkedin",
                      value
                    )
                  }
                />

                <Input
                  label="GitHub"
                  placeholder="github.com/username"
                  value={
                    profile.github
                  }
                  onChange={(
                    value
                  ) =>
                    updateProfile(
                      "github",
                      value
                    )
                  }
                />

                <Input
                  label="Portfolio"
                  placeholder="yourportfolio.com"
                  value={
                    profile.website
                  }
                  onChange={(
                    value
                  ) =>
                    updateProfile(
                      "website",
                      value
                    )
                  }
                />

                <div className="textarea-wrap">
                  <label>
                    Professional Summary
                  </label>

                  <textarea
                    rows={6}
                    placeholder="Write a concise summary highlighting your skills, experience and career goals..."
                    value={
                      profile.summary
                    }
                    onChange={(
                      e
                    ) =>
                      updateProfile(
                        "summary",
                        e.target
                          .value
                      )
                    }
                  />
                </div>
              </section>
            )}

            {activeSection ===
              "skills" && (
              <section>
                <SectionHeading
                  title="Skills"
                  description="Add technologies and skills recruiters search for."
                />

                <div className="skill-input">
                  <input
                    placeholder="Type a skill..."
                    value={
                      skillInput
                    }
                    onChange={(
                      e
                    ) =>
                      setSkillInput(
                        e.target
                          .value
                      )
                    }
                    onKeyDown={(
                      e
                    ) => {
                      if (
                        e.key ===
                        "Enter"
                      ) {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />

                  <button
                    onClick={
                      addSkill
                    }
                  >
                    Add
                  </button>
                </div>

                <div className="skill-list">
                  {skills.map(
                    (
                      skill
                    ) => (
                      <span
                        key={
                          skill
                        }
                      >
                        {skill}

                        <button
                          onClick={() =>
                            removeSkill(
                              skill
                            )
                          }
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>

                <div className="ai-card">
                  <div className="ai-icon">
                    ✨
                  </div>

                  <div className="ai-content">
                    <strong>
                      AI Resume
                      Analyzer
                    </strong>

                    <p>
                      Analyze your resume
                      with AI to identify
                      strengths, weak
                      areas, missing skills
                      and ATS improvements.
                    </p>

                    <button
                      className="analyze-btn"
                      onClick={
                        analyzeResume
                      }
                      disabled={
                        analyzing
                      }
                    >
                      {analyzing
                        ? "Analyzing..."
                        : "✨ Analyze Resume"}
                    </button>
                  </div>
                </div>

                {analysisError && (
                  <div className="analysis-error">
                    {analysisError}
                  </div>
                )}

                {analysis && (
                  <div className="analysis-result">
                    <div className="analysis-title">
                      <div>
                        <strong>
                          AI Resume Analysis
                        </strong>

                        <p>
                          Personalized
                          placement-focused
                          feedback.
                        </p>
                      </div>

                      <div className="score-box">
                        <strong>
                          {
                            analysis.score
                          }
                        </strong>

                        <span>
                          Resume Score
                        </span>
                      </div>
                    </div>

                    <div className="analysis-stats">
                      <div>
                        <strong>
                          {
                            analysis.atsScore
                          }
                        </strong>

                        <span>
                          ATS Score
                        </span>
                      </div>

                      <div>
                        <strong>
                          {
                            analysis.priority
                          }
                        </strong>

                        <span>
                          Priority
                        </span>
                      </div>
                    </div>

                    <AnalysisList
                      title="Overall Assessment"
                      items={[
                        analysis.overallAssessment,
                      ]}
                    />

                    <AnalysisList
                      title="Strengths"
                      items={
                        analysis.strengths
                      }
                    />

                    <AnalysisList
                      title="Weak Areas"
                      items={
                        analysis.weakAreas
                      }
                    />

                    <AnalysisList
                      title="Missing Skills"
                      items={
                        analysis.missingSkills
                      }
                    />

                    <AnalysisList
                      title="ATS Suggestions"
                      items={
                        analysis.atsSuggestions
                      }
                    />

                    <AnalysisList
                      title="Recommended Actions"
                      items={
                        analysis.recommendedActions
                      }
                    />

                    <div className="placement-box">
                      <strong>
                        Placement Readiness
                      </strong>

                      <p>
                        {
                          analysis.placementReadiness
                        }
                      </p>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection ===
              "experience" && (
              <section>
                <SectionHeading
                  title="Experience"
                  description="Showcase internships and professional experience."
                />

                {experience.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="repeat-card"
                      key={
                        index
                      }
                    >
                      <Input
                        label="Company"
                        placeholder="Company name"
                        value={
                          item.company
                        }
                        onChange={(
                          value
                        ) =>
                          updateExperience(
                            index,
                            "company",
                            value
                          )
                        }
                      />

                      <Input
                        label="Role"
                        placeholder="Software Developer Intern"
                        value={
                          item.role
                        }
                        onChange={(
                          value
                        ) =>
                          updateExperience(
                            index,
                            "role",
                            value
                          )
                        }
                      />

                      <Input
                        label="Duration"
                        placeholder="Jun 2025 – Aug 2025"
                        value={
                          item.duration
                        }
                        onChange={(
                          value
                        ) =>
                          updateExperience(
                            index,
                            "duration",
                            value
                          )
                        }
                      />

                      <div className="textarea-wrap">
                        <label>
                          Responsibilities
                        </label>

                        <textarea
                          rows={5}
                          value={
                            item.description
                          }
                          onChange={(
                            e
                          ) =>
                            updateExperience(
                              index,
                              "description",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                )}

                <button
                  className="add-btn"
                  onClick={
                    addExperience
                  }
                >
                  + Add Experience
                </button>
              </section>
            )}

            {activeSection ===
              "education" && (
              <section>
                <SectionHeading
                  title="Education"
                  description="Add your academic qualifications."
                />

                {education.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="repeat-card"
                      key={
                        index
                      }
                    >
                      <Input
                        label="Degree"
                        placeholder="B.Tech Computer Science"
                        value={
                          item.degree
                        }
                        onChange={(
                          value
                        ) =>
                          updateEducation(
                            index,
                            "degree",
                            value
                          )
                        }
                      />

                      <Input
                        label="Institute"
                        placeholder="University / College"
                        value={
                          item.institute
                        }
                        onChange={(
                          value
                        ) =>
                          updateEducation(
                            index,
                            "institute",
                            value
                          )
                        }
                      />

                      <div className="two-col">
                        <Input
                          label="Duration"
                          placeholder="2023 – 2027"
                          value={
                            item.duration
                          }
                          onChange={(
                            value
                          ) =>
                            updateEducation(
                              index,
                              "duration",
                              value
                            )
                          }
                        />

                        <Input
                          label="CGPA / Score"
                          placeholder="8.5 CGPA"
                          value={
                            item.score
                          }
                          onChange={(
                            value
                          ) =>
                            updateEducation(
                              index,
                              "score",
                              value
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                )}

                <button
                  className="add-btn"
                  onClick={
                    addEducation
                  }
                >
                  + Add Education
                </button>
              </section>
            )}

            {activeSection ===
              "projects" && (
              <section>
                <SectionHeading
                  title="Projects"
                  description="Highlight projects that demonstrate your abilities."
                />

                {projects.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      className="repeat-card"
                      key={
                        index
                      }
                    >
                      <Input
                        label="Project Name"
                        placeholder="PrepXpert"
                        value={
                          item.name
                        }
                        onChange={(
                          value
                        ) =>
                          updateProject(
                            index,
                            "name",
                            value
                          )
                        }
                      />

                      <Input
                        label="Technologies"
                        placeholder="Next.js, MongoDB, AI"
                        value={
                          item.tech
                        }
                        onChange={(
                          value
                        ) =>
                          updateProject(
                            index,
                            "tech",
                            value
                          )
                        }
                      />

                      <Input
                        label="Project Link"
                        placeholder="https://github.com/username/project"
                        value={
                          item.link
                        }
                        onChange={(
                          value
                        ) =>
                          updateProject(
                            index,
                            "link",
                            value
                          )
                        }
                      />

                      <div className="textarea-wrap">
                        <label>
                          Description
                        </label>

                        <textarea
                          rows={5}
                          placeholder="Describe what you built and the impact..."
                          value={
                            item.description
                          }
                          onChange={(
                            e
                          ) =>
                            updateProject(
                              index,
                              "description",
                              e.target
                                .value
                            )
                          }
                        />
                      </div>
                    </div>
                  )
                )}

                <button
                  className="add-btn"
                  onClick={
                    addProject
                  }
                >
                  + Add Project
                </button>
              </section>
            )}

            {activeSection ===
              "design" && (
              <section>
                <SectionHeading
                  title="Resume Design"
                  description="Choose the look that matches your professional profile."
                />

                <div className="template-grid">
                  {[
                    "modern",
                    "classic",
                    "minimal",
                  ].map(
                    (item) => (
                      <button
                        key={
                          item
                        }
                        className={
                          template ===
                          item
                            ? "template active"
                            : "template"
                        }
                        onClick={() =>
                          setTemplate(
                            item
                          )
                        }
                      >
                        <div className="template-preview">
                          <div />
                          <div />
                          <div />
                          <div />
                        </div>

                        <strong>
                          {item
                            .charAt(
                              0
                            )
                            .toUpperCase() +
                            item.slice(
                              1
                            )}
                        </strong>
                      </button>
                    )
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="editor-bottom-actions">
            <button
              type="button"
              className="preview-resume-btn"
              onClick={() => {
                setShowPreview(true);
                setTimeout(() => {
                  document
                    .getElementById("resume-preview-panel")
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }, 100);
              }}
            >
              Preview Resume →
            </button>
          </div>
        </aside>

        {showPreview && (
        <section id="resume-preview-panel" className="preview-panel">
          <div className="preview-toolbar">
            <div className="preview-toolbar-left">
              <button
                type="button"
                className="edit-resume-btn"
                onClick={() => setShowPreview(false)}
              >
                ← Edit Resume
              </button>

              <span>
                Resume Preview
              </span>
            </div>

            <span className="ats">
              ✓ ATS Friendly
            </span>
          </div>

          {/* ==================================================
              ONLY THIS DIV IS USED FOR PDF GENERATION
             ================================================== */}

          <div
            className={`resume-paper ${template}`}
          >
            <header className="resume-header">
              <h1>
                {profile.name ||
                  "Your Name"}
              </h1>

              <h2>
                {profile.role ||
                  "Professional Title"}
              </h2>

              <p>
                {profile.email ||
                  "email@example.com"}

                {profile.phone &&
                  `  •  ${profile.phone}`}

                {profile.location &&
                  `  •  ${profile.location}`}
              </p>

              {(profile.linkedin ||
                profile.github ||
                profile.website) && (
                <p>
                  {profile.linkedin}

                  {profile.github &&
                    `  •  ${profile.github}`}

                  {profile.website &&
                    `  •  ${profile.website}`}
                </p>
              )}
            </header>

            {profile.summary && (
              <ResumeSection title="PROFILE">
                <p>
                  {profile.summary}
                </p>
              </ResumeSection>
            )}

            {skills.length > 0 && (
              <ResumeSection title="SKILLS">
                <div className="resume-skills">
                  {skills.map(
                    (skill) => (
                      <span
                        key={
                          skill
                        }
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              </ResumeSection>
            )}

            {experience.some(
              (item) =>
                item.company
            ) && (
              <ResumeSection title="EXPERIENCE">
                {experience.map(
                  (
                    item,
                    index
                  ) =>
                    item.company && (
                      <div
                        className="resume-item"
                        key={
                          index
                        }
                      >
                        <div className="resume-item-top">
                          <strong>
                            {
                              item.role
                            }
                          </strong>

                          <span>
                            {
                              item.duration
                            }
                          </span>
                        </div>

                        <b>
                          {
                            item.company
                          }
                        </b>

                        {item.description && (
                          <p>
                            {
                              item.description
                            }
                          </p>
                        )}
                      </div>
                    )
                )}
              </ResumeSection>
            )}

            {education.some(
              (item) =>
                item.degree
            ) && (
              <ResumeSection title="EDUCATION">
                {education.map(
                  (
                    item,
                    index
                  ) =>
                    item.degree && (
                      <div
                        className="resume-item"
                        key={
                          index
                        }
                      >
                        <div className="resume-item-top">
                          <strong>
                            {
                              item.degree
                            }
                          </strong>

                          <span>
                            {
                              item.duration
                            }
                          </span>
                        </div>

                        <b>
                          {
                            item.institute
                          }
                        </b>

                        {item.score && (
                          <p>
                            {
                              item.score
                            }
                          </p>
                        )}
                      </div>
                    )
                )}
              </ResumeSection>
            )}

            {projects.some(
              (item) =>
                item.name
            ) && (
              <ResumeSection title="PROJECTS">
                {projects.map(
                  (
                    item,
                    index
                  ) =>
                    item.name && (
                      <div
                        className="resume-item"
                        key={
                          index
                        }
                      >
                        <strong>
                          {
                            item.name
                          }
                        </strong>

                        {item.tech && (
                          <p>
                            <b>
                              {
                                item.tech
                              }
                            </b>
                          </p>
                        )}

                        {item.description && (
                          <p>
                            {
                              item.description
                            }
                          </p>
                        )}

                        {item.link && (
                          <p className="project-link">
                            <a
                              href={normalizeUrl(item.link)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {item.link}
                            </a>
                          </p>
                        )}
                      </div>
                    )
                )}
              </ResumeSection>
            )}
          </div>
        </section>
        )}
      </div>

      <style jsx>{`
        :global(html),
        :global(body) {
          margin: 0;
          padding: 0;
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
        }

        .resume-page {
          min-height: 100vh;
          width: 100%;
          background: #f5f6f8;
          color: #151515;
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        }

        .resume-page *,
        .resume-page *::before,
        .resume-page *::after {
          box-sizing: border-box;
        }

        .topbar {
          min-height: 72px;
          width: 100%;
          padding: 12px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          background: rgba(
            255,
            255,
            255,
            0.96
          );
          border-bottom: 1px solid #e8e8e8;
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(12px);
        }

        .brand {
          font-size: 22px;
          font-weight: 800;
          white-space: nowrap;
        }

        .brand span {
          color: #e8b400;
        }

        .page-title {
          font-size: 12px;
          color: #777;
          margin-top: 2px;
        }

        .top-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
        }

        button {
          font-family: inherit;
        }

        .ghost-btn,
        .download-btn {
          border: 0;
          padding: 10px 16px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 600;
          white-space: nowrap;
        }

        .ghost-btn {
          background: #f0f0f0;
          color: #222;
        }

        .download-btn {
          background: #f3c623;
          color: #161616;
        }

        .download-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .upload-btn {
          border: 1px solid #ddd;
          background: #fff;
          color: #222;
          padding: 10px 16px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .upload-btn input {
          display: none;
        }

        .workspace {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 460px minmax(
            0,
            1fr
          );
          min-height: calc(
            100vh - 72px
          );
        }

        .editor-panel {
          min-width: 0;
          background: #fff;
          border-right: 1px solid #e5e5e5;
        }

        .completion-card {
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }

        .completion-header {
          display: flex;
          justify-content: space-between;
          gap: 12px;
        }

        .completion-header small {
          display: block;
          color: #888;
          margin-top: 3px;
        }

        .progress {
          height: 7px;
          background: #eee;
          border-radius: 20px;
          overflow: hidden;
          margin-top: 12px;
        }

        .progress div {
          height: 100%;
          background: #f3c623;
          transition: width 0.4s ease;
        }

        .section-tabs {
          display: flex;
          gap: 5px;
          padding: 12px;
          overflow-x: auto;
          border-bottom: 1px solid #eee;
        }

        .section-tabs button {
          flex: 0 0 auto;
          border: 0;
          background: transparent;
          padding: 9px 11px;
          border-radius: 8px;
          cursor: pointer;
          white-space: nowrap;
          color: #777;
        }

        .section-tabs button.active {
          background: #fff3b9;
          color: #111;
          font-weight: 700;
        }

        .form-area {
          width: 100%;
          padding: 26px;
          overflow: hidden;
        }

        .form-area section {
          width: 100%;
        }

        .two-col {
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          gap: 12px;
        }

        .input-wrap,
        .textarea-wrap {
          width: 100%;
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 6px;
          color: #555;
        }

        input,
        textarea {
          width: 100%;
          max-width: 100%;
          border: 1px solid #ddd;
          border-radius: 9px;
          padding: 11px 12px;
          outline: none;
          font-size: 14px;
          background: #fff;
        }

        input:focus,
        textarea:focus {
          border-color: #e4b500;
          box-shadow:
            0 0 0 3px
            #fff6ca;
        }

        textarea {
          resize: vertical;
          font-family: inherit;
        }

        .linkedin-import-card {
          margin-bottom: 20px;
          padding: 15px;
          border: 1px solid #e7d98f;
          background: #fffdf0;
          border-radius: 11px;
        }

        .linkedin-import-card strong {
          display: block;
          font-size: 14px;
          margin-bottom: 5px;
        }

        .linkedin-import-card p {
          margin: 0;
          color: #777;
          font-size: 12px;
          line-height: 1.5;
        }

        .linkedin-import-btn {
          margin-top: 13px;
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          background: #0a66c2;
          color: #fff;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
        }

        .linkedin-import-btn:hover {
          background: #084f96;
        }

        .linkedin-import-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .linkedin-import-message {
          margin-top: 9px;
          font-size: 12px;
          font-weight: 700;
          color: #18723a;
        }

        .upload-card {
          margin: 18px 24px 0;
          padding: 14px;
          border: 1px solid #eee1a5;
          background: #fffdf2;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .upload-card p {
          margin: 4px 0 0;
          color: #777;
          font-size: 12px;
        }

        .view-upload-btn {
          border: 0;
          background: #151515;
          color: #fff;
          padding: 8px 11px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
        }

        .upload-error {
          flex-basis: 100%;
          padding: 9px;
          background: #fee2e2;
          color: #b91c1c;
          border-radius: 7px;
          font-size: 12px;
        }

        .uploaded-text-card {
          margin: 15px 24px 0;
          padding: 14px;
          border: 1px solid #e5e5e5;
          border-radius: 11px;
          background: #fff;
        }

        .uploaded-text-card p {
          margin: 5px 0 10px;
          color: #777;
          font-size: 12px;
        }

        .uploaded-text-card textarea {
          background: #fafafa;
          font-size: 12px;
          line-height: 1.5;
        }

        .skill-input {
          display: flex;
          gap: 8px;
        }

        .skill-input input {
          flex: 1;
          min-width: 0;
        }

        .skill-input button,
        .add-btn {
          border: 0;
          background: #151515;
          color: white;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
        }

        .skill-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .skill-list span {
          background: #fff2b0;
          padding: 7px 10px;
          border-radius: 20px;
          font-size: 13px;
        }

        .skill-list button {
          border: 0;
          background: transparent;
          cursor: pointer;
          margin-left: 5px;
          font-size: 16px;
        }

        .ai-card {
          display: flex;
          gap: 13px;
          padding: 16px;
          margin-top: 25px;
          border: 1px solid #f1df85;
          background: #fffbed;
          border-radius: 12px;
        }

        .ai-icon {
          font-size: 22px;
        }

        .ai-content {
          min-width: 0;
          flex: 1;
        }

        .ai-card p {
          color: #777;
          font-size: 13px;
          line-height: 1.5;
        }

        .analyze-btn {
          margin-top: 8px;
          border: 0;
          background: #151515;
          color: white;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .analyze-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .analysis-error {
          margin-top: 15px;
          padding: 12px;
          background: #fee2e2;
          color: #b91c1c;
          border-radius: 9px;
          font-size: 13px;
        }

        .analysis-result {
          margin-top: 20px;
          padding: 18px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          background: #fff;
        }

        .analysis-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .analysis-title p {
          margin: 4px 0 0;
          font-size: 12px;
          color: #777;
        }

        .score-box {
          min-width: 70px;
          text-align: center;
          padding: 10px;
          border-radius: 10px;
          background: #fff4bf;
        }

        .score-box strong {
          display: block;
          font-size: 24px;
        }

        .score-box span {
          font-size: 10px;
          color: #666;
        }

        .analysis-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin: 15px 0;
        }

        .analysis-stats div {
          padding: 12px;
          border-radius: 9px;
          background: #f5f5f5;
          text-align: center;
        }

        .analysis-stats strong {
          display: block;
          font-size: 18px;
        }

        .analysis-stats span {
          font-size: 11px;
          color: #777;
        }

        .analysis-block {
          margin-top: 17px;
        }

        .analysis-block h4 {
          margin: 0 0 8px;
          font-size: 13px;
        }

        .analysis-block ul {
          margin: 0;
          padding-left: 18px;
        }

        .analysis-block li {
          margin-bottom: 6px;
          color: #555;
          font-size: 12px;
          line-height: 1.5;
        }

        .placement-box {
          margin-top: 18px;
          padding: 13px;
          background: #ecfdf5;
          border-radius: 9px;
          color: #065f46;
        }

        .placement-box p {
          margin: 6px 0 0;
          font-size: 12px;
        }

        .repeat-card {
          padding: 18px;
          border: 1px solid #e7e7e7;
          border-radius: 12px;
          margin-bottom: 15px;
        }

        .add-btn {
          width: 100%;
          background: #f0f0f0;
          color: #222;
          border: 1px dashed #bbb;
        }

        .template-grid {
          display: grid;
          grid-template-columns:
            repeat(
              3,
              minmax(0, 1fr)
            );
          gap: 12px;
        }

        .template {
          border: 2px solid #eee;
          background: white;
          padding: 10px;
          border-radius: 10px;
          cursor: pointer;
        }

        .template.active {
          border-color: #e9bd18;
          background: #fffbea;
        }

        .template-preview {
          height: 120px;
          background: #f5f5f5;
          padding: 12px;
          margin-bottom: 8px;
        }

        .template-preview div {
          height: 6px;
          background: #bbb;
          margin-bottom: 8px;
          width: 80%;
        }

        .template-preview div:nth-child(2) {
          width: 45%;
        }

        .template-preview div:nth-child(3) {
          width: 90%;
        }

        .template-preview div:nth-child(4) {
          width: 70%;
        }

        .editor-bottom-actions {
          padding: 0 26px 28px;
        }

        .preview-resume-btn {
          width: 100%;
          border: 0;
          background: #151515;
          color: #fff;
          padding: 13px 16px;
          border-radius: 9px;
          cursor: pointer;
          font-weight: 700;
          font-size: 14px;
        }

        .preview-resume-btn:hover {
          background: #2a2a2a;
        }

        .preview-toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .edit-resume-btn {
          border: 1px solid #ddd;
          background: #fff;
          color: #222;
          padding: 7px 10px;
          border-radius: 7px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
        }

        .edit-resume-btn:hover {
          background: #f5f5f5;
        }

        .preview-panel {
          min-width: 0;
          width: 100%;
          background: #eceef1;
          padding: 30px;
          overflow: hidden;
        }

        .preview-toolbar {
          width: 100%;
          max-width: 820px;
          margin: 0 auto 15px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          font-size: 13px;
          color: #666;
        }

        .ats {
          color: #278c4b;
          font-weight: 700;
        }

        /*
         * IMPORTANT:
         * This is the ONLY area captured by html2canvas.
         *
         * min-height is intentionally NOT fixed.
         * This prevents an empty second PDF page.
         */
        .resume-paper {
          width: 100%;
          max-width: 794px;
          min-height: 0;
          margin: auto;
          padding: 58px;
          background: white;
          box-shadow:
            0 12px 40px
            rgba(
              0,
              0,
              0,
              0.12
            );
          overflow-wrap: anywhere;
        }

        .resume-header {
          border-bottom: 2px solid #222;
          padding-bottom: 18px;
        }

        .resume-header h1 {
          font-size: 34px;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .resume-header h2 {
          font-size: 16px;
          color: #555;
          font-weight: 500;
          margin: 7px 0;
        }

        .resume-header p {
          color: #666;
          font-size: 12px;
          margin: 5px 0;
        }

        .resume-paper section {
          margin-top: 24px;
        }

        .resume-paper section h3 {
          font-size: 12px;
          letter-spacing: 1.5px;
          border-bottom: 1px solid #ddd;
          padding-bottom: 6px;
        }

        .resume-paper p {
          font-size: 12px;
          line-height: 1.6;
          color: #444;
        }

        .resume-skills {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
        }

        .resume-skills span {
          font-size: 11px;
          background: #f1f1f1;
          padding: 5px 9px;
          border-radius: 4px;
        }

        .resume-item {
          margin-bottom: 17px;
        }

        .resume-item-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .resume-item-top span {
          color: #777;
          font-size: 11px;
          text-align: right;
        }

        .resume-item b {
          display: block;
          font-size: 12px;
          margin-top: 4px;
        }

        .project-link {
          color: #3769c8 !important;
          margin-top: 6px;
        }

        .project-link a {
          color: #3769c8;
          text-decoration: underline;
          cursor: pointer;
          overflow-wrap: anywhere;
        }

        .project-link a:hover {
          opacity: 0.7;
        }

        .minimal .resume-header {
          border-bottom: 0;
        }

        .classic .resume-header {
          text-align: center;
          border-bottom: 1px solid #777;
        }

        @media (max-width: 1000px) {
          .workspace {
            grid-template-columns: 1fr;
          }

          .editor-panel {
            border-right: 0;
          }

          .preview-panel {
            padding: 24px 16px;
          }
        }

        @media (max-width: 600px) {
          .topbar {
            min-height: auto;
            padding: 12px 14px;
            align-items: stretch;
          }

          .top-actions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .top-actions button,
          .upload-btn {
            width: 100%;
            min-height: 42px;
            padding: 9px 8px;
            font-size: 11px;
          }

          .upload-btn {
            grid-column: 1 / -1;
          }

          .completion-card {
            padding: 16px;
          }

          .upload-card,
          .uploaded-text-card {
            margin-left: 14px;
            margin-right: 14px;
          }

          .form-area {
            padding: 20px 14px;
          }

          .editor-bottom-actions {
            padding: 0 14px 22px;
          }

          .preview-resume-btn {
            min-height: 46px;
          }

          .linkedin-import-card {
            padding: 13px;
          }

          .linkedin-import-btn {
            width: 100%;
          }

          .two-col {
            grid-template-columns: 1fr;
          }

          .skill-input {
            width: 100%;
          }

          .repeat-card {
            padding: 14px;
          }

          .preview-panel {
            padding: 12px 8px 24px;
          }

          .preview-toolbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .preview-toolbar-left {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
          }

          .edit-resume-btn {
            min-height: 38px;
          }

          .resume-paper {
            width: 100%;
            max-width: 100%;
            padding: 24px 18px;
            box-shadow:
              0 5px 20px
              rgba(
                0,
                0,
                0,
                0.08
              );
          }

          .resume-header h1 {
            font-size: 25px;
          }

          .resume-header h2 {
            font-size: 14px;
          }

          .resume-header p,
          .resume-paper p {
            font-size: 11px;
          }

          .resume-paper section {
            margin-top: 18px;
          }
        }

        @media print {
          body * {
            visibility: hidden;
          }

          .resume-paper,
          .resume-paper * {
            visibility: visible;
          }

          .resume-paper {
            position: absolute;
            left: 0;
            top: 0;
            width: 794px;
            max-width: 794px;
            margin: 0;
            box-shadow: none;
          }
        }
      `}</style>
    </main>
  );
}

function getElementRectRelativeToResume(
  element: HTMLElement,
  resumeElement: HTMLElement
) {
  const elementRect =
    element.getBoundingClientRect();

  const resumeRect =
    resumeElement.getBoundingClientRect();

  return {
    x:
      elementRect.left -
      resumeRect.left +
      resumeElement.scrollLeft,
    y:
      elementRect.top -
      resumeRect.top +
      resumeElement.scrollTop,
    width: elementRect.width,
    height: elementRect.height,
  };
}

function addProjectPdfLinks(
  pdf: jsPDF,
  resumeElement: HTMLElement,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeightPx: number
) {
  addProjectPdfLinksForPage(
    pdf,
    resumeElement,
    canvas,
    pageWidth,
    pageHeightPx,
    0,
    pageHeightPx
  );
}

function addProjectPdfLinksForPage(
  pdf: jsPDF,
  resumeElement: HTMLElement,
  canvas: HTMLCanvasElement,
  pageWidth: number,
  pageHeightPx: number,
  sourceY: number,
  currentHeight: number
) {
  const links =
    Array.from(
      resumeElement.querySelectorAll(
        ".project-link a"
      )
    ) as HTMLAnchorElement[];

  const resumeWidth =
    resumeElement.scrollWidth || 794;

  const pxToPdf =
    pageWidth / resumeWidth;

  for (const link of links) {
    const rect =
      getElementRectRelativeToResume(
        link,
        resumeElement
      );

    const linkTop =
      rect.y;

    const linkBottom =
      rect.y + rect.height;

    const pageTop =
      sourceY;

    const pageBottom =
      sourceY + currentHeight;

    if (
      linkBottom <= pageTop ||
      linkTop >= pageBottom
    ) {
      continue;
    }

    const visibleTop =
      Math.max(linkTop, pageTop);

    const visibleBottom =
      Math.min(linkBottom, pageBottom);

    const x =
      rect.x * pxToPdf;

    const y =
      (visibleTop - pageTop) *
      pxToPdf;

    const width =
      rect.width * pxToPdf;

    const height =
      Math.max(
        (visibleBottom -
          visibleTop) *
          pxToPdf,
        3
      );

    const url =
      link.href;

    if (!url) continue;

    pdf.link(
      x,
      y,
      width,
      height,
      {
        url,
      }
    );
  }
}

function AnalysisList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="analysis-block">
      <h4>{title}</h4>

      <ul>
        {items.map(
          (item, index) => (
            <li key={index}>
              {item}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function Input({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (
    value: string
  ) => void;
}) {
  return (
    <div className="input-wrap">
      <label>{label}</label>

      <input
        placeholder={
          placeholder
        }
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
      />
    </div>
  );
}

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        marginBottom: 22,
      }}
    >
      <h2
        style={{
          marginBottom: 5,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          color: "#888",
          fontSize: 13,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3>{title}</h3>

      {children}
    </section>
  );
}