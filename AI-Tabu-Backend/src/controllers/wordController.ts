import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const getRandomWord = (req: Request, res: Response) => {
  try {
    const mode = req.query.mode as string || "Klasik"; // Varsayılan olarak Klasik mod
    const filePath = path.join(__dirname, `../data/tabuWords${mode}.json`);

    // console.log("Seçilen Mod:", mode);
    // console.log("Dosya Yolu:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("Hata: Dosya bulunamadı!", filePath);
      return res.status(400).json({ error: "Seçilen oyun modu için veri dosyası bulunamadı!" });
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    // console.log("JSON İçeriği:", rawData);

    const words = JSON.parse(rawData);

    if (!Array.isArray(words) || words.length === 0) {
      console.error("Hata: JSON verisi boş veya yanlış formatta!");
      return res.status(400).json({ error: "Geçersiz JSON verisi!" });
    }

    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];

    if (!selectedWord || !selectedWord.word || !Array.isArray(selectedWord.banned)) {
      console.error("Hata: Seçilen kelime JSON formatına uymuyor!", selectedWord);
      return res.status(400).json({ error: "Seçilen kelime JSON formatına uymuyor!" });
    }

    // console.log("Seçilen Kelime:", selectedWord);
    res.json(selectedWord);
  } catch (error) {
    console.error("Hata:", error);
    res.status(500).json({ error: "Kelime bulunamadı" });
  }
};
