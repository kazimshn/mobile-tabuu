import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import wordRoutes from './routes/wordRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotaları bağla
app.use('/api/word', wordRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));

app.get("/", (req, res) => {
    res.send("AI Tabu Backend Çalışıyor! 🚀");
  });
  