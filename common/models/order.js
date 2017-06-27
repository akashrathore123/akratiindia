
const nodemailer = require('nodemailer');
var util = require('../util/util');
var uuid = require("uuid");
var fs = require("fs");
var ejs = require("ejs");
var path = require("path");
var dateFormat = require("dateformat");
var loopback = require("loopback");

module.exports = function(Order) {

Order.placeOrder = function(data,cb){
  var realm = data.req.header('realm');
  var access_code = data.req.header('access_code');
  var body = data.body;
  if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }

var body = data.req.body;
var orderDetails = body.orderDetails;
var orderItems = body.orderItems;
var user = body.user;
var address = body.orderAddress;
var order = {};
//console.log(JSON.stringify(orderItems));
order.OrderDiscount = orderDetails.discount;
order.OrderGST = orderDetails.GST;
order.OrderAddress = address;
order.OrderClientId = orderDetails.buyerId;
order.OrderTotal = orderDetails.orderTotal;
order.OrderAmount = orderDetails.withoutDiscount;
order.OrderDeliveryCharge = orderDetails.deliveryCharge;
order.OrderStatus = 'Placed';
var orderId = uuid.v4();
order.OrderId = orderId;
order.OrderDate = Date.now();
order.OrderProducts = [];

for(var i = 0; i < orderItems.length; i++){
  order.OrderProducts[i] = {};
  order.OrderProducts[i].PCode = orderItems[i].PCode;
  order.OrderProducts[i].POrderQuant1 = orderItems[i].POrderQuant1;
  order.OrderProducts[i].POrderQuant2 = orderItems[i].POrderQuant2;
  order.OrderProducts[i].POrderQuant3 = orderItems[i].POrderQuant3;
  order.OrderProducts[i].POrderQuant4 = orderItems[i].POrderQuant4;
  if(order.OrderProducts[i].POrderQuant1 > 0){
    order.OrderProducts[i].PPriceTotal1 = orderItems[i].PPriceTotal1;
  }
  if(order.OrderProducts[i].POrderQuant2 > 0){
    order.OrderProducts[i].PPriceTotal2 = orderItems[i].PPriceTotal2;
  }
  if(order.OrderProducts[i].POrderQuant3 > 0){
    order.OrderProducts[i].PPriceTotal3 = orderItems[i].PPriceTotal3;
  }
  if(order.OrderProducts[i].POrderQuant4 > 0){
    order.OrderProducts[i].PPriceTotal4 = orderItems[i].PPriceTotal4;
  }
  order.OrderProducts[i].POrderQuant2 = orderItems[i].POrderQuant2;
  order.OrderProducts[i].POrderQuant3 = orderItems[i].POrderQuant3;
  order.OrderProducts[i].POrderQuant4 = orderItems[i].POrderQuant4;
  order.OrderProducts[i].PClientId = orderItems[i].PClientId;
  order.OrderProducts[i].PProduct = orderItems[i].PProduct;
  order.OrderProducts[i].withoutDiscount = orderItems[i].withoutDiscount;
  order.OrderProducts[i].PPriceTotalAll = orderItems[i].PPriceTotalAll;

}

Order.create(order,function(err,instance){
  if(err){
    cb(util.getGenericError('Error',500,'Unable to add Product!'));
  }else{
    cb(null,instance);
    var itemsData = "";
    for(var i = 0; i < orderItems.length; i++){

      itemsData += '<div class="item" style="background-color: white;width: 96%;margin-left: -5px;padding-top: 10px;">'+
          '<table>'+
          '<tr><td rowspan="3" width="35%;"><img src = '+util.DOMAIN+'assets/images/'+orderItems[i].PProduct.PCode+'/'+orderItems[i].PProduct.PImageSmall+' height="30%" width="80%"></td>'+
          '<td><span class="productName" style="font-size:80%">'+orderItems[i].PProduct.PName+'</span></td></tr>'+
          '<tr><td><div class="itemDetails">'+
          '<table class="productTable" style="font-family:arial,sans-serif;font-size:15px;color:rgba(0, 0, 0, 0.66);">'+
            '<th style="font-size:80%">Size</th>'+
            '<th style="font-size:80%">Qty.</th>'+
            '<th style="font-size:80%">Unit Price</th>';
            if(orderItems[i].POrderQuant1 > 0){
              itemsData += '<tr>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PSize1+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].POrderQuant1+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PPrice1+'</td>'+
                            '</tr>';
            }
            if(orderItems[i].POrderQuant2 > 0){
              itemsData += '<tr>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PSize2+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].POrderQuant2+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PPrice2+'</td>'+
                            '</tr>';
            }
            if(orderItems[i].POrderQuant3 > 0){
              itemsData += '<tr>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PSize3+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].POrderQuant3+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PPrice3+'</td>'+
                            '</tr>';
            }
            if(orderItems[i].POrderQuant4 > 0){
              itemsData += '<tr>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PSize4+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].POrderQuant4+'</td>'+
                            '<td style="font-size:80%">'+orderItems[i].PProduct.PPrice4+'</td>'+
                            '</tr>';
            }

          itemsData += '</table></div>'+
                       '</td></tr><tr><td><span class="itemTotal" style="font-size:85%;">Rs. '+orderItems[i].PPriceTotalAll+'</span>';
          if(orderItems[i].PProduct.PDiscount && orderItems[i].PProduct.PDiscount > 0){
            itemsData += '<span style="font-size:85%;padding-left:10px;color:red;"><strike>Rs. '+orderItems[i].withoutDiscount+'</strike></span>'
          }
          itemsData += '</td></tr></table>'+
                        '</div> ';

    }
//console.log('items data---'+ itemsData);
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
  console.log('transporter created'+user.email);

// setup email data with unicode symbols
ejs.renderFile(path.resolve(__dirname , "../util/orderConfirmation.ejs"), {homeURL:util.DOMAIN+'index.html', name: address.Name,logo: util.DOMAIN+"assets/img/logo.png",orderid: orderId, orderDate: dateFormat(Date.now(), "fullDate"), orderCount: orderItems.length,
                orderTotal:'Rs. '+ order.OrderTotal }, function (err, data) {
if(err){
    cb(util.getGenericError("Error",500,"Order Confirmation mail can not be sent."))
  }else{
    //console.log("data 1"+data);
    var discount = 0;
    if(parseInt(orderDetails.discount) > 0){
       discount = 'Rs. '+ orderDetails.discount
    }else{
      discount = 0;
    }


    ejs.renderFile(path.resolve(__dirname , "../util/orderConfirmation2.ejs"), {addressName:address.Name, addressStreet:address.Street,addressLocality:address.Locality, addressCity: address.City, addressPin: address.PinCode, addressState: address.State, addressMobile: '+91 '+address.Mobile,
                    orderAmount: 'Rs. '+orderDetails.withoutDiscount, orderDiscount: discount, orderGST: 'Rs. '+orderDetails.GST, orderDelivery: 'Rs. '+orderDetails.deliveryCharge, orderTotalAmount: 'Rs. '+orderDetails.orderTotal }, function (err, data1) {
      if(err){
          cb(util.getGenericError("Error",500,"Order Confirmation mail can not be sent."))
        }else{
          let mailClient = {
            from: 'Akratiindia Updates <info@allied-up.com>', // sender address
            to: [user.email,'akash.rathore1924@gmail.com'], // list of receivers
            subject: 'Your Akratiindia Order Confirmation ( '+ orderId +' ) ', // Subject line
            html: data+itemsData+data1 // html body
          };
          let mailAkrati = {
            from: 'Akratiindia Updates <info@allied-up.com>', // sender address
            to: 'sanketgoel12345@gmail.com', // list of receivers
            subject: 'Akratiindia Order Confirmation ( '+ orderId +' ) ', // Subject line
            html: data+itemsData+data1 // html body
          };

          //send mail with defined transport object
          transporter.sendMail(mailClient, (error, info) => {
            if (error) {
              return console.log(error);
              cb(util.getGenericError("Error",500,"Internal Server Error!"))
            }else{
              console.log('Message %s sent: %s', info.messageId, info.response);


            }
          });
          // transporter.sendMail(mailAkrati, (error, info) => {
          //   if (error) {
          //     return console.log(error);
          //   }
          //   console.log('Message %s sent: %s', info.messageId, info.response);
          // });

        }
      });

  }
});

  }
});
};

  Order.getOrder = function(ctx,cb){
    var realm = ctx.req.header('realm');
    var access_code = ctx.req.header('access_code');
    var orderId = ctx.req.header('OrderId');
    var clientId = ctx.req.header('PClientId');
    console.log(orderId+"clientId"+clientId);
    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !orderId || !clientId){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }
    Order.find({where:{and:[{'OrderId':orderId},{'OrderClientId':clientId}]}}, function(err,instance){
      if(err){
        cb(util.getGenericError("Error",500,"Internal Server Error!"));
      }
      console.log("instance orderId:--"+JSON.stringify(instance));

      if(instance[0].OrderId){
        cb(null,instance[0]);
      }else{
        ctx.res.statusCode = "204";
        cb(null);
      }
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

  Order.remoteMethod('getOrder',{

    description:"Method to create order",
    http: {path: '/getOrder', verb: 'get'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });
};
