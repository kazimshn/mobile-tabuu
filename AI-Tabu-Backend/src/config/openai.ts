import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Çevresel değişkenleri yükle

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // API anahtarını kullan
});

export default openai;
