const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: String,
  date: String,
  cName: String,
  cMobile: String,
  orderItems: [
    {
      product_name: String,
      unitprice: Number,
      quantity: Number,
      actualtotalcost: Number,
    }
  ],
  amountPaid: Number,
  totalProfit: Number,
  balance: Number,
  total: Number,
  borrow: Number,
  previousborrow: Number,
  subtotal: Number,
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
