import { GoogleGenerativeAI } from '@google/generative-ai';
import { AppError } from '../utils/AppError.js';
import { config } from 'dotenv';
config();
export const createEmbeddings = async (gemDescription) => {
    if(!process.env.GEMINI_KEY) {
        throw new AppError("GEMINI key not found", 500);
    }
    const googleGenAi = new GoogleGenerativeAI(process.env.GEMINI_KEY);
    const model = googleGenAi.getGenerativeModel({model: 'gemini-embedding-001'});

    const res = await model.embedContent(gemDescription)
    return res.embedding.values;
}
