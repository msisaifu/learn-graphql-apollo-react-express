const nodemailer = require('nodemailer');

const smtpConfig = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
};

var transport = nodemailer.createTransport(smtpConfig);

const mailTemplate = text => `  
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20pz;
  ">
    <h2>Reset password</h2>
  <p>${text}</p>
  </div>
`;

exports.mailTemplate = mailTemplate;
exports.transport = transport;