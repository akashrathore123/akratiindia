'use strict';
const nodemailer = require('nodemailer');

module.exports = function(Order) {

  Order.placeOrder = function(data,cb){
    let transporter = nodemailer.createTransport({
      // service:'Gmail',
      // port: 465,
       ignoreTLS: true,
      host: 'allied-up.com',
      port: 587,
      // greetingTimeout: 3000,
      secure:false,
    // secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
      // user: 'akash.rathore1924@gmail.com',
      // pass: 'Myjelvin123_'
        user: 'info@allied-up.com',
        pass: 'AUPmail*733'
    }
});
console.log('transporter created');
// setup email data with unicode symbols
let mailOptions = {
    from: 'info@allied-up.com', // sender address
    to: 'akash.rathore1924@gmail.com', // list of receivers
    subject: 'Hello ', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
  }


  Order.remoteMethod('placeOrder',{

    description:"Method to create order",
    http: {path: '/placeOrder', verb: 'post'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });
};
