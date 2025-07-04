const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Configure the email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Clover webhook API is live.');
});

// Webhook endpoint to receive Clover orders
app.post('/webhook', async (req, res) => {
  try {
    const orderData = JSON.stringify(req.body, null, 2);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.ORDER_RECEIVER_EMAIL,
      subject: 'New Clover Order Received',
      text: `You have received a new order:

${orderData}`
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log('Order email sent');
    res.status(200).send('Order received and email sent');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

app.listen(port, () => {
  console.log(`Clover webhook API listening on port ${port}`);
});
