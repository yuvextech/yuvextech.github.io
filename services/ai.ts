/**
 * Gemini access via Firebase AI Logic.
 *
 * Firebase AI Logic proxies Gemini requests through Firebase, so no Gemini API
 * key is ever shipped to the browser. Enable it once in the Firebase Console:
 *   Build → AI Logic → Get started → Gemini Developer API.
 * Recommended: also enable App Check (reCAPTCHA Enterprise) to block abuse.
 */
import { getAI, getGenerativeModel, GoogleAIBackend, GroundingMetadata } from 'firebase/ai';
import { app } from './firebase';

export const DEFAULT_GEMINI_MODEL = 'gemini-3.8-flash';

let aiInstance: ReturnType<typeof getAI> | null = null;
function ai() {
  if (!aiInstance) aiInstance = getAI(app, { backend: new GoogleAIBackend() });
  return aiInstance;
}

export interface GenerateOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  googleSearch?: boolean;
}

export interface GenerateResult {
  text: string;
  groundingMetadata?: GroundingMetadata;
}

export async function generateText(prompt: string, opts: GenerateOptions = {}): Promise<GenerateResult> {
  const model = getGenerativeModel(ai(), {
    model: opts.model || DEFAULT_GEMINI_MODEL,
    generationConfig: {
      ...(opts.temperature !== undefined ? { temperature: opts.temperature } : {}),
      ...(opts.maxOutputTokens !== undefined ? { maxOutputTokens: opts.maxOutputTokens } : {})
    },
    ...(opts.googleSearch ? { tools: [{ googleSearch: {} }] } : {})
  });
  try {
    const result = await model.generateContent(prompt);
    return {
      text: result.response.text(),
      groundingMetadata: result.response.candidates?.[0]?.groundingMetadata
    };
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (/api-not-enabled|firebasevertexai|firebaseml|AI Logic|403/i.test(msg)) {
      throw new Error('AI features are not enabled yet. Enable Firebase AI Logic in the Firebase Console to activate them.');
    }
    throw err;
  }
}
