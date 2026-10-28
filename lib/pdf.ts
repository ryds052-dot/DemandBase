import type { LetterData } from "./types";
import { buildLetter, formatDate, letterToText } from "./letter";

function fileSafe(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "recipient";
}

export async function exportLetterPdf(data: LetterData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const letter = buildLetter(data);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 64;
  const maxWidth = pageWidth - margin * 2;
  let y = 62;

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - 60) {
      doc.addPage();
      y = 64;
    }
  };

  doc.setFillColor(0, 245, 118);
  doc.rect(margin, y, 24, 3, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(70, 74, 72);
  doc.text("DEMANDBASE  /  FORMAL NOTICE", margin + 34, y + 3);
  y += 48;

  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(30, 32, 31);
  doc.text(formatDate(new Date().toISOString().slice(0, 10)), margin, y);
  y += 30;

  const recipientLines = [letter.respondent, data.respondentCompany, data.respondentAddress].filter(Boolean);
  recipientLines.forEach((line) => {
    const wrapped = doc.splitTextToSize(line, maxWidth) as string[];
    wrapped.forEach((text) => {
      ensureSpace(15);
      doc.text(text, margin, y);
      y += 15;
    });
  });
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const subjectLines = doc.splitTextToSize(`RE: ${letter.subject}`, maxWidth) as string[];
  subjectLines.forEach((line: string) => {
    ensureSpace(16);
    doc.text(line, margin, y);
    y += 16;
  });
  y += 20;

  doc.setFont("times", "normal");
  doc.setFontSize(11.5);
  letter.paragraphs.forEach((paragraph) => {
    const lines = doc.splitTextToSize(paragraph, maxWidth) as string[];
    lines.forEach((line) => {
      ensureSpace(18);
      doc.text(line, margin, y);
      y += 18;
    });
    y += 12;
  });

  ensureSpace(70);
  doc.text("Sincerely,", margin, y);
  y += 34;
  doc.setFont("times", "bold");
  doc.text(letter.signatory, margin, y);
  if (data.claimantEmail) {
    y += 17;
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.text(data.claimantEmail, margin, y);
  }

  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 134, 132);
    doc.text(`Demand letter  •  Page ${page} of ${pages}`, margin, pageHeight - 30);
  }

  doc.save(`demand-letter-${fileSafe(data.respondentName)}.pdf`);
}

export function exportLetterText(data: LetterData) {
  const blob = new Blob([letterToText(data)], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `demand-letter-${fileSafe(data.respondentName)}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
