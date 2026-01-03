import express from 'express';
import { createOrder,getAllOrders,verifyPickup,cancelOrder } from '../controller/orderController.js';

const orderRouter = express.Router();

orderRouter.post('/createorder', createOrder);
orderRouter.get('/getorders', getAllOrders);
orderRouter.put('/verifypickup/:orderId', verifyPickup);
orderRouter.delete('/cancelorder/:orderId', cancelOrder);

export default orderRouter;