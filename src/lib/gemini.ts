import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export interface UtteranceResponse {
  utterances: string[];
  error?: string;
}

export interface AnalysisResponse {
  accuracy: number;
  matches: {
    question: string;
    answer: string;
    expectedAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  summary: string;
}

export async function getUtterance(question: string, model: GenerativeModel): Promise<string> {
  try {
    const prompt = `Please generate 10 utterance of the question "${question}" 
    in a json format with the following structure: {"question_1": "...", "question_2": "...", etc}. 
    Do not include any comments, strictly reply in json format only.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in getUtterance:", error);
    throw error;
  }
}

export async function getAnswer(
  utterance: string,
  model_url: string,
  api_key: string,
  model_name: string
): Promise<string> {
  try {
    const prompt = `Please answer the following questions: ${utterance} 
    in a json format with the structure of {"answer 1": "...", "answer_2": "...", etc}.
    Do not include any comments, strictly reply in json format only.`;

    const response = await fetch(model_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${api_key}`,
      },
      body: JSON.stringify({ model: model_name, input: prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const output = data["output"];
    const first_response = output[0];
    const content = first_response["content"];
    const first_content = content[0];
    return first_content["text"];
  } catch (error) {
    console.error("Error in getAnswer:", error);
    throw error;
  }
}

export async function getReport(
  utterances: string,
  answers: string,
  model: GenerativeModel,
  expectedAnswer: string
): Promise<string> {
  try {
    const prompt = `As a chatbot tester, please compare the following utterances and answers: 
    ${utterances} and ${answers}, and evaluate if the majority of answers matches the expected answer of ${expectedAnswer}.
    Generate a report in json format with the structure of 
    {"overall_quality": string, "accurary (%)": number, "strength": List<String>, "weakness": List<String>, "matches_expected_answer": boolean}.
    Do not include any comments, strictly reply in json format only.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error in getReport:", error);
    throw error;
  }
}

interface ReportData {
  "overall_quality": string;
  "accurary (%)": number;
  "strength": string[];
  "weakness": string[];
  "matches_expected_answer": boolean;
}

export function cleanJson(data: string): ReportData {
  const cleanedData = data.replace("```json", "").replace("```", "").trim();
  try {
    return JSON.parse(cleanedData);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Problematic JSON string:", cleanedData);
    throw error;
  }
}

// Legacy functions kept for backward compatibility
export async function generateUtterances(question: string, count: number): Promise<UtteranceResponse> {
  try {
    const utterances = await getUtterance(question, model);
    const parsed = cleanJson(utterances);
    return {
      utterances: Object.values(parsed).slice(0, count) as string[]
    };
  } catch (error) {
    console.error('Error generating utterances:', error);
    return {
      utterances: [],
      error: error instanceof Error ? error.message : 'Failed to generate utterances'
    };
  }
}

export async function analyzeResponses(
  questions: string[],
  answers: string[],
  expectedAnswer: string
): Promise<AnalysisResponse> {
  try {
    const report = await getReport(
      JSON.stringify(questions),
      JSON.stringify(answers),
      model,
      expectedAnswer
    );
    const parsed = cleanJson(report);
    
    return {
      accuracy: parsed["accurary (%)"] / 100,
      matches: questions.map((question, index) => ({
        question,
        answer: answers[index],
        expectedAnswer,
        isCorrect: parsed.matches_expected_answer,
        explanation: parsed.overall_quality
      })),
      summary: parsed.overall_quality
    };
  } catch (error) {
    console.error('Error analyzing responses:', error);
    throw new Error('Failed to analyze responses');
  }
}

export interface ReportResponse {
    overallScore: number;
    metrics: {
      accuracyByQuestion: { [question: string]: number };
      consistencyScore: number;
      averageResponseQuality: number;
    };
    details: {
      summary: string;
      recommendations: string[];
      questionAnalysis: {
        question: string;
        accuracy: number;
        comments: string;
      }[];
      consistencyAnalysis: string;
    };
  }
  

  export async function generateReport(
    projectName: string,
    workflowName: string,
    analyses: AnalysisResponse[]
  ): Promise<ReportResponse> {
    try {
      const prompt = `Generate a comprehensive test report for the chatbot testing session.
      Project: ${projectName}
      Workflow: ${workflowName}
      Test Results: ${JSON.stringify(analyses)}
  
      Create a detailed report in JSON format with the following structure:
      {
        "overallScore": number (0-1),
        "metrics": {
          "accuracyByQuestion": object,
          "consistencyScore": number,
          "averageResponseQuality": number
        },
        "details": {
          "summary": string,
          "recommendations": string[],
          "questionAnalysis": array,
          "consistencyAnalysis": string
        }
      }
  
      Provide detailed insights and actionable recommendations.
      IMPORTANT: Return ONLY the JSON object, without any markdown formatting or additional text.`;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean the response by removing any markdown formatting
      const cleanedText = text
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      try {
        const parsed: ReportResponse = JSON.parse(cleanedText);
        return parsed;
      } catch (parseError) {
        console.error('Error parsing report JSON:', parseError);
        console.error('Problematic JSON string:', cleanedText);
        throw new Error('Failed to parse report JSON');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      throw new Error('Failed to generate report');
    }
  }
  