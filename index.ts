import express from 'express';
import { connectDatabase } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;
connectDatabase()

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello !');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

