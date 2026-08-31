import mammoth from "mammoth";
import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please upload a resume file.",
        },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();

    const isPdf =
      file.type === "application/pdf" ||
      fileName.endsWith(".pdf");

    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only PDF and DOCX resume files are supported.",
        },
        { status: 400 }
      );
    }

    // 10 MB upload limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Resume file must be smaller than 10 MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    let text = "";

    // =========================
    // PDF
    // =========================
    if (isPdf) {
      const pdfData = new Uint8Array(arrayBuffer);

      const parser = new PDFParse({
        data: pdfData,
      });

      try {
        const parsed = await parser.getText();
        text = parsed.text || "";
      } finally {
        await parser.destroy();
      }
    }

    // =========================
    // DOCX
    // =========================
    if (isDocx) {
      const buffer = Buffer.from(arrayBuffer);

      const result =
        await mammoth.extractRawText({
          buffer,
        });

      text = result.value || "";
    }

    // Clean extracted text
    text = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    if (!text) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Could not extract readable text from this resume.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Resume uploaded and text extracted successfully.",

      file: {
        name: file.name,
        type: isPdf ? "pdf" : "docx",
        size: file.size,
      },

      text,
    });
  } catch (error) {
    console.error(
      "RESUME UPLOAD ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to read the uploaded resume.",
      },
      { status: 500 }
    );
  }
}