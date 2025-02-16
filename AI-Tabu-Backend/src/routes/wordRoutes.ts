import express from 'express';
import { getRandomWord } from '../controllers/wordController';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    await getRandomWord(req, res);
  } catch (error) {
    console.error('API Hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

export default router;
