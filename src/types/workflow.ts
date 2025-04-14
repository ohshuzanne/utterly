export interface WorkflowItem {
  id: string;
  type: 'question' | 'intent' | 'delay' | 'end';
  question?: string;
  expectedAnswer?: string;
  utteranceCount?: number;
  intent?: string;
  delay?: number;
  endMessage?: string;
}

export interface WorkflowExecutionResult {
  item: WorkflowItem;
  utterances?: string[];
  answers?: string[];
  analysis?: {
    accuracy: number;
    matches: {
      question: string;
      answer: string;
      expectedAnswer: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    summary: string;
  };
}

export interface Report {
  overallScore: number;
  metrics: {
    accuracyByQuestion: Record<string, number>;
    consistencyScore: number;
    averageResponseQuality: number;
  };
  details: {
    summary: string;
    recommendations: string[];
    questionAnalysis: any[];
    consistencyAnalysis: string;
  };
} 