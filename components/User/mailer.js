const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });


const saltRounds = 10;
let count;
let email;
let globalOTP = "";

async function configEmailToSend(account, OTP) {
  await oAuth2Client.refreshAccessToken;
  const accessToken = await oAuth2Client.getAccessToken();
  //console.log(accessToken);
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'ptudwnc.classroom@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  // const smtpTransport = nodemailer.createTransport(
  //   {
  //     service: 'gmail',
  //     auth:{
  //       user: 'ptudwnc.classroom@gmail.com',
  //       pass: 'hcmusek18@ddl'
  //     }
  //   })
  const mail = {
    from: "ptudwnc.classroom@gmail.com",
    to: account,
    subject: "MÃ XÁC NHẬN",
    html: "<b>Mã xác nhận của bạn là: </b>" + OTP
  }
  return { smtpTransport, mail };
}

async function configEmailToSend1(account, OTP) {
  await oAuth2Client.refreshAccessToken;
  const accessToken = await oAuth2Client.getAccessToken();
  const smtpTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'ptudwnc.classroom@gmail.com',
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });
  // const smtpTransport = nodemailer.createTransport(
  //   {
  //     service: 'gmail',
  //     auth:{
  //       user: 'ptudwnc.classroom@gmail.com',
  //       pass: 'hcmusek18@ddl'
  //     }
  //   })
  const mail = {
    from: "ptudwnc.classroom@gmail.com",
    to: account,
    subject: "INVITE LINK",
    html: "<b>Invite link: </b>" + OTP
  }
  return { smtpTransport, mail };
}

exports.sendmail = async (email, content) => {

  console.log("sendmail");
  console.log(email);
  const mailer = await configEmailToSend(email, content);
  const smtpTransport = (await mailer).smtpTransport;
  const mail = (await mailer).mail;

  smtpTransport.sendMail(mail);
};

exports.sendmailInvite = async (email, content) => {

  //console.log("sendmail");
  //console.log(email);
  const mailer = await configEmailToSend1(email, content);
  const smtpTransport = (await mailer).smtpTransport;
  const mail = (await mailer).mail;

  smtpTransport.sendMail(mail);
};