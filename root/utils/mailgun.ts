// import Mailgun from "mailgun-js";


// export const sendEmai = (email: string, token: string) => {
//     const DOMAIN = String(process.env.MAILGUN_DOMAIN);
//     const api_key = String(process.env.MAILGUN_APIKEY)
//     const mg = Mailgun({apiKey: api_key, domain: DOMAIN});

//     const data = {
//         from: 'redrixx <redrixxng@gmail.com>',
//         to: `${email}`,
//         subject: `Verify your token.`,
//         text: `Hello, your token is ${token}.`
//     };

//     mg.messages().send(data, function (error: any, body) {
//         if (error) console.log('the error is: ', error.message)
//         console.log("the body is:", body);
//     });
// }


import nodemailer from 'nodemailer'

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(email: string, token: string) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();
  
    // create reusable transporter object using the default SMTP transport
    var transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "a5c7e00c992698",
        pass: "f1ab02888f51d7"
      }
    });
  
    // send mail with defined transport object
    let info = await transport.sendMail({
      from: '"Fred Foo 👻" <redrixxng@gmail.com>', // sender address
      to: `${email}`, // list of receivers
      subject: "Hello ✔", // Subject line
      text: `your token is: ${token}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  }
  
