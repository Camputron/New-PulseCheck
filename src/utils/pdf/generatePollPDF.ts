import { jsPDF } from "jspdf"
import { PollPDFData, PollPDFQuestion } from "@/types"

const PAGE_WIDTH = 210
const MARGIN = 20
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
const PAGE_HEIGHT = 297
const BOTTOM_MARGIN = 25

const FONT_TITLE = 18
const FONT_BODY = 11
const FONT_SMALL = 10
const LINE_HEIGHT = 6

const OPTION_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function promptTypeLabel(question: PollPDFQuestion): string {
  switch (question.promptType) {
    case "multiple-choice":
      return "Multiple Choice"
    case "multi-select":
      return "Multi-Select - select all that apply"
    case "ranking-poll":
      return "Poll"
    default:
      return ""
  }
}

function drawOptionBullet(
  doc: jsPDF,
  promptType: string,
  x: number,
  y: number
): void {
  if (promptType === "multiple-choice") {
    doc.circle(x + 1.5, y - 1.2, 1.5)
  } else if (promptType === "multi-select") {
    doc.rect(x, y - 2.7, 3, 3)
  }
}

function answerBlank(question: PollPDFQuestion): string {
  if (question.promptType === "multi-select") {
    return "Answer(s): ________________"
  }
  return "Answer: ________________"
}

function estimateQuestionHeight(
  doc: jsPDF,
  question: PollPDFQuestion,
  index: number
): number {
  let height = 0

  // Question number + prompt
  const promptText = `${index + 1}. ${question.prompt}`
  const promptLines = doc.splitTextToSize(
    promptText,
    CONTENT_WIDTH - 5
  ) as string[]
  height += promptLines.length * LINE_HEIGHT

  // Type label
  height += LINE_HEIGHT

  // Options
  for (const opt of question.options) {
    const optLines = doc.splitTextToSize(
      opt.text,
      CONTENT_WIDTH - 20
    ) as string[]
    height += optLines.length * LINE_HEIGHT
  }

  // Answer blank + spacing
  height += LINE_HEIGHT * 3

  return height
}

export default function generatePollPDF(data: PollPDFData): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  let y = MARGIN
  const totalPages = { count: 1 }

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > PAGE_HEIGHT - BOTTOM_MARGIN) {
      doc.addPage()
      totalPages.count++
      y = MARGIN
    }
  }

  // --- Header ---
  doc.setFont("helvetica", "bold")
  doc.setFontSize(FONT_TITLE)
  const titleLines = doc.splitTextToSize(data.title, CONTENT_WIDTH) as string[]
  doc.text(titleLines, MARGIN, y)
  y += titleLines.length * 8

  doc.setFont("helvetica", "normal")
  doc.setFontSize(FONT_SMALL)
  doc.text(`Date: ${formatDate(data.createdAt)}`, MARGIN, y)
  y += LINE_HEIGHT

  doc.text("Name: _______________________________", MARGIN, y)
  y += LINE_HEIGHT * 2

  // Divider
  doc.setDrawColor(180)
  doc.setLineWidth(0.3)
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y)
  y += LINE_HEIGHT

  // --- Questions ---
  for (let i = 0; i < data.questions.length; i++) {
    const question = data.questions[i]
    const neededHeight = estimateQuestionHeight(doc, question, i)
    checkPageBreak(neededHeight)

    // Question number + prompt
    doc.setFont("helvetica", "bold")
    doc.setFontSize(FONT_BODY)
    const promptText = `${i + 1}. ${question.prompt}`
    const promptLines = doc.splitTextToSize(
      promptText,
      CONTENT_WIDTH - 5
    ) as string[]
    doc.text(promptLines, MARGIN, y)
    y += promptLines.length * LINE_HEIGHT

    // Type label
    doc.setFont("helvetica", "italic")
    doc.setFontSize(FONT_SMALL)
    doc.text(`(${promptTypeLabel(question)})`, MARGIN + 5, y)
    y += LINE_HEIGHT + 1

    // Options
    doc.setFont("helvetica", "normal")
    doc.setFontSize(FONT_BODY)
    for (let j = 0; j < question.options.length; j++) {
      const letter = OPTION_LETTERS[j]
      const optText = `${letter}) ${question.options[j].text}`
      const optLines = doc.splitTextToSize(
        optText,
        CONTENT_WIDTH - 20
      ) as string[]

      checkPageBreak(optLines.length * LINE_HEIGHT)
      drawOptionBullet(doc, question.promptType, MARGIN + 10, y)
      doc.text(optLines, MARGIN + 16, y)
      y += optLines.length * LINE_HEIGHT
    }

    y += 2

    // Answer blank
    doc.setFontSize(FONT_SMALL)
    doc.text(answerBlank(question), MARGIN + 5, y)
    y += LINE_HEIGHT * 2
  }

  // --- Page numbers ---
  const pageCount = doc.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.setTextColor(140)
    doc.text(
      `Page ${p} of ${pageCount}`,
      PAGE_WIDTH / 2,
      PAGE_HEIGHT - 10,
      { align: "center" }
    )
    doc.setTextColor(0)
  }

  // Sanitize filename
  const filename = data.title.replace(/[^a-zA-Z0-9 ]/g, "").trim() || "poll"
  doc.save(`${filename}.pdf`)
}
