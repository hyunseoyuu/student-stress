export type CategoryType = "중학생" | "고등학생" | "수험생/고시생" | "대학생" | "대학원생" | "기타 학습자";

export interface Question {
  id: number;
  category: "exhaustion" | "cynicism" | "efficacy" | "physical";
  text: string;
}

export interface QuizScores {
  exhaustion: number; // 0-25
  cynicism: number; // 0-25
  efficacy: number; // 0-25
  physical: number; // 0-25
}

export interface ActionStep {
  title: string;
  description: string;
  category: string;
}

export interface DiagnosisResult {
  summary: string;
  exhaustionAnalysis: string;
  cynicismAnalysis: string;
  efficacyAnalysis: string;
  physicalAnalysis: string;
  actionSteps: ActionStep[];
  longTermTips: string[];
  categorySpecificAdvice: string;
  dailySlogan: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  category: CategoryType;
  context: string;
  scores: QuizScores;
  totalScore: number;
  result: DiagnosisResult;
}

export interface JournalEntry {
  id: string;
  date: string;
  stressor: string;
  lettingGo: string;
  gratitude: string;
}
