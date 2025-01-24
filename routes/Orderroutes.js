const express = require('express');
const router = express.Router();

const Order = require('../models/order');
const generateOrderPDF = require('../utils/pdfGenerator');


router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find();  // Fetch all orders from the 'order' collection
      res.status(200).json(orders);  // Send all orders as JSON response
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Fetch and Display Data in Terminal & Generate PDF for Order Items
  router.get('/generate/:id', async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // PDF Output Path
      const fileName = `${order.order_id}_summary.pdf`;
      const pdfPath = `./${fileName}`;
  
      // Generate PDF
      generateOrderPDF(order, pdfPath);
  
      console.log(`PDF generated: ${pdfPath}`);
  
      // Respond to the API call
      res.status(200).json({
        message: 'PDF generated successfully.',
        pdfPath,
        orderDetails: order,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
  
  
  module.exports = router;