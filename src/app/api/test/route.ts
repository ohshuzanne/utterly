import { NextRequest, NextResponse } from "next/server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  // check form data received from client
  const body = await request.json();
  const { name, apiLink, apiKey, modelName, question, expectedAnswer } = body;
  console.log("Received Form Data: ", body);

  // instantiate the GoogleGenerativeAI class with the API key
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // get utterance based on questions (gemini)
  const utterances = await getUtterance(question, model);
  console.log("utterance: " + utterances);

  // validate if utterance exist
  if (!utterances) {
    return NextResponse.json(
      { message: "failed to generate utterance" },
      { status: 500 }
    );
  }

  // ask testee model (chatgpt) to answer the 10 utterance
  const answers = await getAnswer(utterances, apiLink, apiKey, modelName);
  console.log("answers: " + answers);

  // validate if answers exist
  if (!answers) {
    return NextResponse.json(
      { message: "failed to generate answers" },
      { status: 500 }
    );
  }

  // get report based on the answers and utterances (gemini)
  const report = await getReport(utterances, answers, model, expectedAnswer);
  console.log("report: " + report);

  // validate if report exist
  if (!report) {
    return NextResponse.json(
      { message: "failed to generate report" },
      { status: 500 }
    );
  }

  // clean the report
  const cleanedReport = await cleanJson(report);
  console.log("Cleaned Report" + cleanedReport);

  return NextResponse.json(
    { message: "successfully generated report", report: cleanedReport },
    { status: 200 }
  );
}

async function getUtterance(question: string, model: GenerativeModel) {
  try {
    // enhance prompt
    const prompt = `Please generate 10 utterance of the question "${question}" 
    in a json format with the following structure: {"question_1": "...", "question_2": "...", etc}. 
    Do not include any comments, strictly reply in json format only.`;

    // get utterance from the model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const output = response.text();

    return output;
  } catch (error) {
    console.error("Error in getUtterance:", error);
  }
}

async function getAnswer(
  utterance: string,
  model_url: string,
  api_key: string,
  model_name: string
) {
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

    // parse the response
    const data = await response.json();
    const output = data["output"];
    const first_response = output[0];
    const content = first_response["content"];
    const first_content = content[0];
    const answer = first_content["text"];

    return answer;
  } catch (error) {
    console.error("Error in getAnswer:", error);
  }
}

async function getReport(
  utterances: string,
  answers: string,
  model: GenerativeModel,
  expectedAnswer: string
) {
  try {
    const prompt = `As a chatbot tester, please compare the following utterances and answers: 
    ${utterances} and ${answers}, and evaluate if the majority of answers matches the expected answer of ${expectedAnswer}.
    Generate a report in json format with the structure of 
    {"overall_quality": string, "accurary (%)": number, "strength": List<String>, "weakness": List<String>, "matches_expected_answer": boolean}.
    Do not include any comments, strictly reply in json format only.`;

    // get utterance from the model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const output = response.text();

    return output;
  } catch (error) {
    console.error("Error in getReport:", error);
  }
}

async function cleanJson(data: string) {
  const cleanedData = data.replace("```json", "").replace("```", "").trim();
  try {
    const cleanedJson = JSON.parse(cleanedData);
    return cleanedJson;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    console.error("Problematic JSON string:", cleanedData);
  }
}

/** Test Data Used:
 * Chatbot Name: Chatgpt
 * API Link: https://api.openai.com/v1/responses
 * API Key: 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
 * Model Name: gpt-4o
 * Question: What is the color of the sky?
 * Expected Answer: Blue
 */
