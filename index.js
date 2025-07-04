const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const orderData = JSON.stringify(req.body, null, 2);
  console.log('Received Clover webhook payload:', orderData);

  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.ORDER_RECEIVER_EMAIL,
      subject: 'New Clover Order Received',
      text: orderData,
    };

    await transporter.sendMail(mailOptions);
    console.log('Order email sent.');
  } catch (error) {
    console.error('Error sending email:', error);
  }

  res.status(200).send('Webhook received');
});

app.get('/', (req, res) => {
  res.send('Clover Webhook API is live');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
