const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const orderData = JSON.stringify(req.body, null, 2);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: process.env.ORDER_RECEIVER_EMAIL,
    subject: 'New Clover Order Received',
    text: orderData,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order email sent.');
    res.status(200).send('Email sent.');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Email failed.');
  }
});

app.listen(PORT, () => {
  console.log(`Clover webhook API is live on port ${PORT}`);
});