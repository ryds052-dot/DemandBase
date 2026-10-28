export type LetterData = {
  claimantName: string;
  claimantEmail: string;
  claimantAddress: string;
  respondentName: string;
  respondentCompany: string;
  respondentEmail: string;
  respondentAddress: string;
  invoiceNumber: string;
  serviceDescription: string;
  amount: string;
  invoiceDate: string;
  dueDate: string;
  incidentFacts: string;
  previousAttempts: string;
  deadline: string;
  responseMethod: string;
  jurisdiction: string;
  tone: "professional" | "firm";
};

export type LetterField = keyof LetterData;

export type ValidationErrors = Partial<Record<LetterField, string>>;
