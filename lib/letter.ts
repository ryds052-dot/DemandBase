import type { LetterData, LetterField, ValidationErrors } from "./types";

const DAY = 86_400_000;

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function createInitialLetter(): LetterData {
  return {
    claimantName: "",
    claimantEmail: "",
    claimantAddress: "",
    respondentName: "",
    respondentCompany: "",
    respondentEmail: "",
    respondentAddress: "",
    invoiceNumber: "",
    serviceDescription: "",
    amount: "",
    invoiceDate: "",
    dueDate: "",
    incidentFacts: "",
    previousAttempts: "",
    deadline: toInputDate(new Date(Date.now() + 10 * DAY)),
    responseMethod: "email",
    jurisdiction: "",
    tone: "professional",
  };
}

export function formatDate(value: string) {
  if (!value) return "Date not provided";
  const date = new Date(`${value}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatAmount(value: string) {
  const amount = Number(value);
  if (!value || !Number.isFinite(amount)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function getDaysOverdue(dueDate: string) {
  if (!dueDate) return 0;
  const due = new Date(`${dueDate}T12:00:00`).getTime();
  return Math.max(0, Math.floor((Date.now() - due) / DAY));
}

export function validateStep(data: LetterData, step: number): ValidationErrors {
  const errors: ValidationErrors = {};
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (step === 0) {
    if (!data.claimantName.trim()) errors.claimantName = "Enter your name or business name.";
    if (data.claimantEmail && !emailPattern.test(data.claimantEmail)) {
      errors.claimantEmail = "Enter a valid email address.";
    }
    if (!data.respondentName.trim()) errors.respondentName = "Enter the client or debtor’s name.";
    if (data.respondentEmail && !emailPattern.test(data.respondentEmail)) {
      errors.respondentEmail = "Enter a valid email address.";
    }
  }

  if (step === 1) {
    if (!data.serviceDescription.trim()) errors.serviceDescription = "Describe the work or agreement.";
    if (!data.amount || Number(data.amount) <= 0) errors.amount = "Enter an amount greater than zero.";
    if (!data.dueDate) errors.dueDate = "Select the original payment due date.";
  }

  if (step === 2) {
    if (data.incidentFacts.trim().length < 20) {
      errors.incidentFacts = "Add at least 20 characters so the facts are clear.";
    }
    if (!data.deadline) errors.deadline = "Select a response deadline.";
    if (data.deadline && new Date(`${data.deadline}T23:59:59`) < new Date()) {
      errors.deadline = "Choose a future deadline.";
    }
  }

  return errors;
}

export function validateLetter(data: LetterData) {
  return { ...validateStep(data, 0), ...validateStep(data, 1), ...validateStep(data, 2) };
}

export function buildLetter(data: LetterData) {
  const claimant = data.claimantName.trim() || "Your name";
  const respondent = data.respondentName.trim() || "Client name";
  const company = data.respondentCompany.trim();
  const services = data.serviceDescription.trim() || "the services described in our agreement";
  const invoice = data.invoiceNumber.trim() || "not specified";
  const facts = data.incidentFacts.trim() ||
    "The services were provided as agreed, and the corresponding balance remains unpaid despite the payment due date passing.";
  const attempts = data.previousAttempts.trim();
  const jurisdiction = data.jurisdiction.trim();

  const opening = data.tone === "firm"
    ? `I am writing to formally demand payment of ${formatAmount(data.amount)} for ${services}. This balance became due on ${formatDate(data.dueDate)} and remains outstanding.`
    : `I am writing regarding the outstanding balance of ${formatAmount(data.amount)} for ${services}. Payment was due on ${formatDate(data.dueDate)}, and the balance remains unpaid.`;

  const closing = data.tone === "firm"
    ? `Please consider this letter final notice before I pursue all appropriate remedies available to me. I prefer to resolve this directly and without further escalation.`
    : `I would prefer to resolve this matter directly and amicably. Prompt payment will allow us to close this matter without further action.`;

  return {
    claimant,
    respondent,
    subject: `Demand for Payment${invoice !== "not specified" ? ` — Invoice ${invoice}` : ""}`,
    paragraphs: [
      `Dear ${respondent},`,
      opening,
      `The related invoice number is ${invoice}${data.invoiceDate ? `, issued on ${formatDate(data.invoiceDate)}` : ""}. ${facts}`,
      ...(attempts ? [`I have previously attempted to resolve this balance. ${attempts}`] : []),
      `Please pay the full outstanding amount of ${formatAmount(data.amount)} by ${formatDate(data.deadline)}. Payment or a written response should be directed to me by ${data.responseMethod}${data.claimantEmail ? ` at ${data.claimantEmail}` : ""}.`,
      closing,
      ...(jurisdiction ? [`This letter is sent with reference to the laws and applicable procedures of ${jurisdiction}.`] : []),
    ],
    signatory: claimant,
  };
}

export function letterToText(data: LetterData) {
  const letter = buildLetter(data);
  return [
    formatDate(toInputDate(new Date())),
    "",
    letter.respondent,
    data.respondentCompany,
    data.respondentAddress,
    "",
    `RE: ${letter.subject}`,
    "",
    ...letter.paragraphs.flatMap((paragraph) => [paragraph, ""]),
    "Sincerely,",
    letter.signatory,
    data.claimantEmail,
  ].filter((line, index, lines) => line !== "" || lines[index - 1] !== "").join("\n");
}

export const requiredFieldsByStep: LetterField[][] = [
  ["claimantName", "respondentName"],
  ["serviceDescription", "amount", "dueDate"],
  ["incidentFacts", "deadline"],
];
