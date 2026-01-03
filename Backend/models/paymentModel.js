import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  orderId: String,            
  paymentMethod: String,       
  razorpayPaymentId: String,  
  status: String,              
  amount: Number,              
  createdAt: { type: Date, default: Date.now }
}
);

const paymentModel= mongoose.model.payment || mongoose.model('Payment', paymentSchema);

export default paymentModel;