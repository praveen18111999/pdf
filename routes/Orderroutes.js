const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const Order = require('../models/order');


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
  
      // Display rest of the content in the terminal
      const { orderItems, ...otherDetails } = order.toObject();
      console.log('Order Details (excluding items):', otherDetails);
  
      // Generate PDF for order items
      const doc = new PDFDocument();
      const fileName = `${order.order_id}_items.pdf`;
  
      // Set PDF content
      doc.fontSize(20).text('Order Items', { align: 'center', underline: true });
      doc.moveDown(1);
  
      orderItems.forEach((item, index) => {
        doc.fontSize(12).text(
          `${index + 1}. Product: ${item.product_name}, Unit Price: ₹${item.unitprice}, Quantity: ${item.quantity}, Total Cost: ₹${item.actualtotalcost}`
        );
        doc.moveDown(0.5);
      });
  
      // Save the PDF to a file
      const pdfPath = `./${fileName}`;
      doc.pipe(require('fs').createWriteStream(pdfPath));
      doc.end();
  
      console.log(`PDF generated: ${pdfPath}`);
  
      // Respond to the API call
      res.status(200).json({
        message: 'PDF generated successfully and order details displayed in terminal.',
        pdfPath,
        orderDetails: otherDetails,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  });
  
  module.exports = router;