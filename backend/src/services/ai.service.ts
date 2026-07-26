import { AcademicProfileService } from "./academic-profile.service";
import { scholarshipService } from "./scholarship.service";
import { UserService } from "./user.service";
import { HttpException } from "../exceptions/http-exception";
import { AiChatDTOType } from "../dtos/ai.dto";

const academicProfileService = new AcademicProfileService();
const userService = new UserService();

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

export type ScholarshipAdviceResponse = {
  advice: string;
  model: string;
  generatedAt: string;
};

export type AiChatResponse = {
  reply: string;
  model: string;
  generatedAt: string;
};

function buildScholarshipPrompt(profileContext: unknown, scholarshipsContext: unknown): string {
  return [
    "You are an education consultancy assistant.",
    "Recommend scholarships for this student using only the profile and scholarship data provided.",
    "Be practical, concise, and honest about missing information.",
    "Format the answer with short sections: Best matches, Why these fit, Next steps.",
    "Do not invent scholarship names, deadlines, amounts, or links.",
    "",
    `Student profile: ${JSON.stringify(profileContext)}`,
    `Available scholarships: ${JSON.stringify(scholarshipsContext)}`,
  ].join("\n");
}

function extractGeminiText(payload: GeminiGenerateContentResponse): string {
  return payload.candidates
    ?.flatMap((candidate) => candidate.content?.parts || [])
    .map((part) => part.text)
    .filter((text): text is string => Boolean(text))
    .join("\n")
    .trim() || "";
}

export class AiService {
  private getModel(): string {
    return process.env.GOOGLE_AI_MODEL || "gemini-2.5-flash-lite";
  }

  private getApiKey(): string {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new HttpException(500, "Google AI API key is not configured");
    }
    return apiKey;
  }

  private async generateText(prompt: string, maxOutputTokens = 700): Promise<{ text: string; model: string }> {
    const apiKey = this.getApiKey();
    const model = this.getModel();

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens,
        },
      }),
    });

    const payload = (await response.json().catch(() => ({}))) as GeminiGenerateContentResponse;
    if (!response.ok) {
      if (response.status === 429) {
        throw new HttpException(
          429,
          "Google AI quota exceeded for this API key or model. Try again later, switch GOOGLE_AI_MODEL to a model with free quota, or enable billing in Google AI Studio.",
        );
      }
      throw new HttpException(response.status, payload.error?.message || "AI request failed");
    }

    const text = extractGeminiText(payload);
    if (!text) {
      throw new HttpException(502, "AI did not return a usable response");
    }

    return { text, model };
  }

  async getScholarshipAdvice(userId: string): Promise<ScholarshipAdviceResponse> {
    const user = await userService.getUserById(userId);
    let academicProfile = null;

    try {
      academicProfile = await academicProfileService.getByUserId(userId);
    } catch (error) {
      if (!(error instanceof HttpException) || error.status !== 404) {
        throw error;
      }
    }

    const scholarships = await scholarshipService.getAll({ status: "active", page: 1, limit: 20 });
    const profileContext = {
      name: user.fullName,
      studyLevel: user.studyLevel,
      destination: user.destination,
      fieldOfStudy: user.fieldOfStudy,
      intake: user.intake,
      budget: user.budget,
      academicProfile,
    };
    const scholarshipsContext = scholarships.data.map((scholarship) => ({
      name: scholarship.name,
      provider: scholarship.provider,
      type: scholarship.type,
      amount: scholarship.amount,
      currency: scholarship.currency,
      eligibility: scholarship.eligibility,
      requirements: scholarship.requirements,
      countries: scholarship.countries,
      universities: scholarship.universities,
      deadline: scholarship.deadline,
      applicationUrl: scholarship.applicationUrl,
    }));

    const result = await this.generateText(buildScholarshipPrompt(profileContext, scholarshipsContext), 700);

    return {
      advice: result.text,
      model: result.model,
      generatedAt: new Date().toISOString(),
    };
  }

  async chat(userId: string, data: AiChatDTOType): Promise<AiChatResponse> {
    const user = await userService.getUserById(userId);
    const recentMessages = data.messages.slice(-12).map((message) => `${message.role === "assistant" ? "AI" : "User"}: ${message.content}`).join("\n\n");
    const prompt = [
      "You are EduGlobal AI, a helpful assistant inside an education consultancy platform.",
      "Help with universities, scholarships, admissions, documents, SOP ideas, visa preparation, appointments, and platform guidance.",
      "Be clear, concise, and practical. Ask one follow-up question when important details are missing.",
      "Do not claim guaranteed admission, visa approval, scholarship awards, or legal certainty.",
      "For medical, legal, or financial decisions, suggest checking with a qualified professional or official source.",
      "",
      `Current user: ${JSON.stringify({
        name: user.fullName,
        role: user.role,
        studyLevel: user.studyLevel,
        destination: user.destination,
        fieldOfStudy: user.fieldOfStudy,
        intake: user.intake,
        budget: user.budget,
      })}`,
      "",
      "Conversation:",
      recentMessages,
      "",
      "AI:",
    ].join("\n");
    const result = await this.generateText(prompt, 800);

    return {
      reply: result.text,
      model: result.model,
      generatedAt: new Date().toISOString(),
    };
  }
}

export const aiService = new AiService();
