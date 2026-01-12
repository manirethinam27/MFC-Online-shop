import 'dotenv/config';
import express  from 'express';
import connectDB from './config/mongodb.js';
import orderRouter from './route/orderRoute.js';
import itemRouter from './route/itemRoute.js';
import cors from 'cors';


const app = express();

const PORT = process.env.PORT || 3000;

connectDB();

const AllowedOrigins = [process.env.FRONTEND_URL || "http://localhost:5173",
                        process.env.DASHBOARD_URL || "http://localhost:8080"];

app.use(express.json());
app.use(cors({ credentials: true, origin: AllowedOrigins }));

app.get('/', (req, res) => {res.send('Hello World!');});

app.use('/api/orders', orderRouter);
app.use('/api/items', itemRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});