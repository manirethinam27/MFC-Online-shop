import 'dotenv/config';
import express  from 'express';
import connectDB from './config/mongodb.js';
import orderRouter from './route/orderRoute.js';
import itemRouter from './route/itemRoute.js';


const app = express();

const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json());

app.get('/', (req, res) => {res.send('Hello World!');});

app.use('/api/orders', orderRouter);
app.use('/api/items', itemRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});