
const nodemailer = require('nodemailer');
var util = require('../util/util');
var uuid = require("uuid");
var fs = require("fs");
var ejs = require("ejs");
var path = require("path");
var dateFormat = require("dateformat");
var loopback = require("loopback");
var crypto = require("crypto");
var constant = require("../util/constants");
var request = require("request");

module.exports = function(Order) {

Order.deleteOrder = function(orderId,cb){
  if(orderId){
    Order.destroyAll({OrderId:orderId},function(err,info){
      if(err){
        cb(util.getGenericError("Error",500,"Server Error while deleting order."));
        console.log(err);
        return;
      }else{
        console.log("Order Deleted");;
        return;
      }

      });

  }
}

Order.confirmOrder = function(data,cb){
data.res.setHeader('Content-Type', 'text/html');
console.log(JSON.stringify(data.req.body));
var requestData = data.req.body;
if(requestData && requestData.txnid && requestData.productinfo){
Order.app.models.Transaction.findOne({where:{TransactionID : requestData.txnid}},function(err,transaction){
  if(err){
    Order.deleteOrder(requestData.productinfo,function(err,count){});
      data.res.end(util.getOrderFailedHTML());
      return;
  }
  if(transaction){
    if(transaction.TransactionStatus != "Completed"){
    // if(requestData.hash.match(transaction.TransactionResHash)){
      transaction.TransactionMode = requestData.mode;
      transaction.TransactionStatus = "Completed";
      transaction.TransactionAmount = requestData.net_amount_debit;
      transaction.TransactionPayID = requestData.mihpayid;
      transaction.updateAttributes(transaction,function(err,updatedTransaction){
        if(err){
          console.log(err);
          data.res.end(util.getOrderFailedHTML());
          return;
        }
        if(updatedTransaction){

          Order.findOne({where:{OrderId : requestData.productinfo}}, function(err,instance){
            if(err){
              data.res.end(util.getOrderFailedHTML());
              return;
            }

            if(instance){
              instance.OrderStatus = "Placed";
              instance.OrderTransactionID = requestData.txnid;

              instance.updateAttributes(instance,function(err,instance){
                if(err){
                  data.res.end(util.getOrderFailedHTML());
                  return;
                }else{

                  data.res.end(util.getConfirmOrderHTML(instance.OrderId,instance.OrderTotal,instance.OrderProducts.length));
                  return;
                }
            });

            /* Send Order Mail */
            var itemsData = "";
            var orderItems = instance.OrderProducts;
            var address = instance.OrderAddress;
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
                    itemsData += '<span style="font-size:85%;padding-left:10px;color:red;"><strike>Rs. '+instance.OrderAmount+'</strike></span>'
                  }
                  itemsData += '</td></tr></table>'+
                                '</div> ';

            }
        //console.log('items data---'+ itemsData);

              var transporter = nodemailer.createTransport({
                ignoreTLS: true,
                host: 'allied-up.com',
                port: 587,
                secure:false,
                auth: {

                  user: 'info@allied-up.com',
                  pass: 'AUPmail*733'
              }
          });


        // setup email data with unicode symbols
        ejs.renderFile(path.resolve(__dirname , "../util/orderConfirmation.ejs"), {homeURL:util.DOMAIN, name: address.Name,logo: util.DOMAIN+"assets/img/logo.png",orderid: requestData.productinfo, orderDate: dateFormat(instance.OrderDate, "fullDate"), orderCount: orderItems.length,
                        orderTotal:'Rs. '+ instance.OrderTotal }, function (err, data) {
        if(err){
            cb(util.getGenericError("Error",500,"Order Confirmation mail can not be sent."))
          }else{
            //console.log("data 1"+data);
            var discount = 0;
            if(parseInt(instance.OrderDiscount) > 0){
               discount = 'Rs. '+ instance.OrderDiscount
            }else{
              discount = 0;
            }


            ejs.renderFile(path.resolve(__dirname , "../util/orderConfirmation2.ejs"), {addressName:address.Name, addressStreet:address.Street,addressLocality:address.Locality, addressCity: address.City, addressPin: address.PinCode, addressState: address.State, addressMobile: '+91 '+address.Mobile,
                            orderAmount: 'Rs. '+instance.OrderAmount, orderDiscount: discount, orderGST: 'Rs. '+instance.OrderGST, orderDelivery: 'Rs. '+instance.OrderDeliveryCharge, orderTotalAmount: 'Rs. '+instance.OrderTotal }, function (err, data1) {
              if(err){
                  cb(util.getGenericError("Error",500,"Order Confirmation mail can not be sent."))
                }else{
                  Order.app.models.Client.findOne({where:{client_token:instance.OrderClientId}},function(err,user){
                    if(err){
                      data.res.end("error occured ");
                    }
                    if(user){
                      var mailClient = {
                        from: 'Akratiindia Updates <info@allied-up.com>', // sender address
                        to: [user.client_email,'akash.rathore1924@gmail.com'], // list of receivers
                        subject: 'Your Akratiindia Order Confirmation ( '+ instance.OrderId +' ) ', // Subject line
                        html: data+itemsData+data1 // html body
                      };

                      transporter.sendMail(mailClient, (error, info) => {
                        if (error) {
                          return console.log(error);
                          cb(util.getGenericError("Error",500,"Internal Server Error!"))
                        }else{
                          console.log('Message %s sent: %s', info.messageId, info.response);


                        }
                      });

                      request.post(util.SMS_API + util.SMS_NAME + '& password=' + util.SMS_PASSWORD+
                      '&smsfrom=Akratiindia&receiver=' + user.client_mobile +
                      '&content=' + util.getSMSOrderMessage(orderItems[0].PProduct.PName,instance.OrderProducts.length,instance.OrderTotal,dateFormat(instance.OrderDate, "fullDate"))+'&udh=&response=JSON',
                       function(err, httpResponse, body) {
                         if (err) {
                           console.error('Error:', err);
                           return;
                         }
                         console.log(JSON.parse(body));
                       })

                    }
                  });

                  // var mailAkrati = {
                  //   from: 'Akratiindia Updates <info@allied-up.com>', // sender address
                  //   to: 'sanketgoel12345@gmail.com', // list of receivers
                  //   subject: 'Akratiindia Order Confirmation ( '+ orderId +' ) ', // Subject line
                  //   html: data+itemsData+data1 // html body
                  // };

                  //send mail with defined transport object



                }
              });

          }
        });

            }else {
              data.res.end(util.getOrderFailedHTML());
              return;
            }
          })
        }else{
          data.res.end(util.getOrderFailedHTML());
          return;
        }
      })
    // }else{
    //   Order.deleteOrder(requestData.productinfo,function(err,count){});
    //   data.res.end(util.getOrderFailedHTML());
    //   return;
    //  }
  }else{

              Order.findOne({where:{OrderId : requestData.productinfo}}, function(err,instance){
                if(err){
                  data.res.end(util.getOrderFailedHTML());
                  return;
                }

                if(instance){
                  data.res.end(util.getConfirmOrderHTML(instance.OrderId,instance.OrderTotal,instance.OrderProducts.length));
                  return;
                }else{
                  cb(util.getGenericError("Error",500,"Internal Server Error"));
                }
              });
  }
  }else{
    data.res.end(util.getOrderFailedHTML());
    return;
  }


})

}else{
  cb(util.getGenericError("Error",402,"Invalid request"));

}

}

Order.initiateTransaction = function(data,cb){
  var realm = data.req.header('realm');
  var access_code = data.req.header('access_code');
  var body = data.req.body;
  if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }

  var orderId =  Math.floor((Math.random() * Math.random() * 10000000000));
  var orderFound = undefined;
  console.log(orderId);
  do{
    orderFound = undefined;
    Order.findOne({where:{OrderId:orderId}},function(err,instance){
    if(err){
      cb(util.getGenericError('Error',403,'Error occured'));
    }
    if(instance){
      console.log("instance------>"+JSON.stringify(instance));
      orderId =  Math.floor((Math.random() * Math.random()));
      console.log("order id-"+orderId);
      orderFound = instance;
    }
  });
  }while(orderFound);

  var orderDetails = body.orderDetails;
  var orderItems = body.orderItems;
  var user = body.user;
  var address = body.orderAddress;
  var orderAmount = orderDetails.orderTotal.replace(/,/g,'');
  var productCount = orderItems.length;
  var productInfo = {};
  productInfo.ProductCodes = [];
  for(var i = 0; i < orderItems.length; i++){
    productInfo.ProductCodes[i] = orderItems[i].PCode;
  }
  var firstName = address.Name.split(' ')[0];
  var email = user.email;
  var transactionID =  Math.floor((Math.random() * Math.random() * 10000000000));
  var hash_string_req = util.MERCHANT_KEY+'|'+transactionID+'|'+orderAmount+'|'+orderId+'|'+firstName+'|'+email+'|||||||||||'+util.MERCHANT_SALT;
  var hash_string_res = util.MERCHANT_SALT+'|in progress|||||||||||'+email+'|'+firstName+'|'+orderId+'|'+orderAmount+'|'+transactionID+'|'+util.MERCHANT_KEY;
  var hash = crypto.createHash('sha512', 'SecretKey');
     hash.update(hash_string_req);
     var requestHash = hash.digest('hex');
     console.log(hash_string_req);
     console.log(requestHash);

     hash = crypto.createHash('sha512', 'SecretKey');
     hash.update(hash_string_res);
     var responseHash = hash.digest('hex');
     console.log(hash_string_res);
     console.log(responseHash);
     var responseData = {};

     console.log(responseData);
     if(!firstName || !productInfo || !orderAmount || !email || !transactionID || !requestHash || !responseHash){
       cb(util.getGenericError("Error",402,"Transaction Failed"));
       return;
     }

     responseData.TransactionOrderAmount = orderAmount;
     responseData.TransactionProducts = productInfo.ProductCodes;
     responseData.TransactionID = transactionID;
     responseData.TransactionReqHash = requestHash;
     responseData.TransactionResHash = responseHash;
     responseData.TransactionStatus = 'Initiated';
     responseData.TransactionAddressID = address.id;
     responseData.TransactionOrderID = orderId;
     responseData.TransactionTime = new Date();

     Order.app.models.Transaction.create(responseData,function(err,response){
       if(err){
          cb(util.getGenericError("Error",402,"Transaction Failed"));
          return;
       }else{
         var order = {};
         order.OrderDiscount = orderDetails.discount;
         order.OrderGST = orderDetails.GST;
         order.OrderAddress = address;
         order.OrderClientId = orderDetails.buyerId;
         order.OrderTotal = orderDetails.orderTotal;
         order.OrderAmount = orderDetails.withoutDiscount;
         order.OrderDeliveryCharge = orderDetails.deliveryCharge;
         order.OrderStatus = 'Initiated';
         order.OrderTransactionID = transactionID;


         order.OrderId = orderId;
         var placedDate = new Date();
         order.OrderDate = placedDate;
         order.OrderActionDate = new Date().setDate(new Date().getDate() + 7);
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
             cb(util.getGenericError("Error",500,"Error occured while creating Order"));
             return;
           }else{
             responseData.HashStringReq = hash_string_req;
             responseData.FirstName = firstName;
             responseData.Email = email;
             responseData.Phone = address.Mobile;
             responseData.merchantKey = util.MERCHANT_KEY;
             responseData.merchantSalt = util.MERCHANT_SALT;

             responseData.form = util.getPaymentForm(responseData);

             cb(null,responseData);
             return;
           }
         });
       }

     });

}

Order.orderFailed = function(data,cb){
  console.log(JSON.stringify(data.req.body));
  Order.deleteOrder(requestData.productinfo,function(err,count){});
  data.res.setHeader('Content-Type','text/html');
  data.res.end(util.getOrderFailedHTML());
}

Order.placeOrder = function(data,cb){
  var realm = data.req.header('realm');
  var access_code = data.req.header('access_code');
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

var orderId =  Math.floor((Math.random() * Math.random()));
var orderFound = undefined;
console.log(orderId);
do{
  orderFound = undefined;
  Order.findOne({where:{OrderId:orderId}},function(err,instance){
  if(err){
    cb(util.getGenericError('Error',403,'Error occured'));
  }
  if(instance){
    console.log("instance------>"+JSON.stringify(instance));
    orderId =  Math.floor((Math.random() * Math.random()));
    console.log("order id-"+orderId);
    orderFound = instance;
  }
});
}while(orderFound);

if(!orderFound){

order.OrderId = orderId;
var placedDate = new Date();
order.OrderDate = placedDate;
order.OrderActionDate = new Date().setDate(new Date().getDate() + 7);
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

      var transporter = nodemailer.createTransport({
        ignoreTLS: true,
        host: 'allied-up.com',
        port: 587,
        secure:false,
        auth: {

          user: 'info@allied-up.com',
          pass: 'AUPmail*733'
      }
  });


// setup email data with unicode symbols
ejs.renderFile(path.resolve(__dirname , "../util/orderConfirmation.ejs"), {homeURL:util.DOMAIN+'index.html', name: address.Name,logo: util.DOMAIN+"assets/img/logo.png",orderid: order.orderId, orderDate: dateFormat(order.OrderDate, "fullDate"), orderCount: orderItems.length,
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
          var mailClient = {
            from: 'Akratiindia Updates <info@allied-up.com>', // sender address
            to: [user.email,'akash.rathore1924@gmail.com'], // list of receivers
            subject: 'Your Akratiindia Order Confirmation ( '+ order.orderId +' ) ', // Subject line
            html: data+itemsData+data1 // html body
          };
          var mailAkrati = {
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


        }
      });

  }
});

  }
});
}
}

  Order.getOrder = function(ctx,cb){
    var realm = ctx.req.header('realm');
    var access_code = ctx.req.header('access_code');
    var orderId = ctx.req.header('OrderId');
    var clientId = ctx.req.header('PClientId');
  //  console.log(orderId+"clientId"+clientId);
    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !orderId || !clientId){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }
    Order.find({where:{and:[{'OrderId':orderId},{'OrderClientId':clientId}]}}, function(err,instance){
      if(err){
        cb(util.getGenericError("Error",500,"Internal Server Error!"));
      }

      if(instance[0].OrderId){
        cb(null,instance[0]);
      }else{
        ctx.res.statusCode = "204";
        cb(null);
      }
    });
  }

  Order.getOrders = function(ctx,cb){
    var realm = ctx.req.header('realm');
    var access_code = ctx.req.header('access_code');
    var skipOrder = ctx.req.header('skip');
    var clientId = ctx.req.header('token');

    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !skipOrder || !clientId){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }

    Order.find({where:{OrderClientId:clientId},skip:skipOrder,limit:4,order:'OrderDate DESC'},function(err,instance){
      if(err){
        cb(util.getGenericError("Error",500,"Internal Server Error"));
      }
      if(instance){

        cb(null,instance);
      }else{
        ctx.res.statusCode = 204;
        ctx.res.statusText = "No Order Found.";
        cb(null);
      }
    });
  }

  Order.cancelOrder = function(ctx,cb){
    var realm = ctx.req.header('realm');
    var access_code = ctx.req.header('access_code');
    var orderId = ctx.req.header('orderId');
    var clientId = ctx.req.header('token');
    var email = ctx.req.header('email');

    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !orderId || !clientId || !email){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }
    var order = {};
    order.OrderStatus = "Cancelled";
    order.OrderActionDate = new Date();
    Order.upsertWithWhere({OrderId:orderId},order,function(err,instance){
      if(err){
        cb(util.getGenericError("Error",500,"Internal Server Error"));
      }
      if(instance){

        cb(null,instance);
        var data = '';

        for(var i=0;i<instance.OrderProducts.length;i++){

         data += '<div class="orderDetail" style="width: 84%;margin-left: 5%;border: 1px solid rgba(128, 128, 128, 0.38);border-radius: 8px;padding-left: 2%;padding-bottom: 1%;padding-top: 1%;height:14vw;padding-right: 2%;font-size: 0.8vw;margin-top: 1%;">'+
             '<div class="orderImage" style="width: 15%;height: 12vw;float:left;">'+
               '<img src="assets/images/'+instance.OrderProducts[i].PProduct.PCode+'/'+instance.OrderProducts[i].PProduct.PImageSmall+'" width="100%" height="100%">'+
             '</div>'+
             '<div class="productName" style="width: 80%;float: right;font-size: 1.5vw;">'+
               instance.OrderProducts[i].PProduct.PName+
             '</div><div class="sizeQty" style="width: 40%;float: left;margin-left: 5%;">'+
               '<table class="sizeTable" style="width: 20%;font-size:1.5vw;">'+
                 '<th style="text-align: left;font-size=80%;padding: 0;margin: 0;">Size</th><th style="text-align: left;font-size=80%;padding: 0;margin: 0;">Qty</th>';
                 if(instance.OrderProducts[i].POrderQuant1 > 0){

                   data += '<tr>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].PProduct.PSize1+'</td>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].POrderQuant1+'</td>'+
                                 '</tr>';

                 }
                 if(instance.OrderProducts[i].POrderQuant2 > 0){

                   data += '<tr>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].PProduct.PSize2+'</td>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].POrderQuant2+'</td>'+
                                 '</tr>';
                 }
                 if(instance.OrderProducts[i].POrderQuant3 > 0){

                   data += '<tr>'+
                                 '<td style="font-size:80%";padding: 0;margin: 0;>'+instance.OrderProducts[i].PProduct.PSize3+'</td>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].POrderQuant3+'</td>'+
                                 '</tr>';
                 }
                 if(instance.OrderProducts[i].POrderQuant4 > 0){

                   data += '<tr>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].PProduct.PSize4+'</td>'+
                                 '<td style="font-size:80%;padding: 0;margin: 0;">'+instance.OrderProducts[i].POrderQuant4+'</td>'+
                                 '</tr>';
                 }
               data += '</table>'+
               '</div><div class="price" style="width: 40%;float: right;margin-top: 1%;font-size: 1.7vw;">'+
               'Price: Rs. '+instance.OrderProducts[i].PPriceTotalAll+
             '</div></div> ';
           }
           data += '<div class="orderValue" style="width: 90%;margin-left: 5%;float: left;margin-bottom: 5%;font-size: 1.8vw;">'+
              ' <div class="valueHeading" style="font-size: 2vw;padding-left: 1%;padding-top: 1%;padding-bottom: 1%;color: brown;">'+
                 'Your Order Value:'+
               '</div><div class="orderPrice" style="width: 40%;float: left;padding-left: 8%;">Order Value</div>'+
               '<div class="orderPriceValue" style="width: 40%;text-align: right;margin-right: 8%;float: right;">Rs. '+instance.OrderAmount+'</div>'+
               '<hr style="width:84%;"><div class="otherPrice" style="width: 40%;float: left;padding-left: 8%;">Other Charges</div>'+
               '<div class="otherPriceValue" style="width: 40%;text-align: right;margin-right: 8%;float: right;">'+
                 'Rs. '+instance.OrderGST+' + Rs. '+instance.OrderDeliveryCharge+'</div>'+
               '<hr style="width:84%;"><div class="totalPrice" style="width: 40%;float: left;padding-left: 8%;">Total Value </div>'+
               '<div class="totalPriceValue" style="width: 40%;text-align: right;margin-right: 8%;float: right;">Rs. '+instance.OrderTotal+'</div>'+
             '</div>  </div></div></div> </div>';

        var transporter = nodemailer.createTransport({
          ignoreTLS: true,
          host: 'allied-up.com',
          port: 587,
          secure:false,
          auth: {

            user: 'info@allied-up.com',
            pass: 'AUPmail*733'
        }
    });


        ejs.renderFile(path.resolve(__dirname , "../util/orderCancelation.ejs"), {orderId:instance.OrderId }, function (err, data1) {
          if(err){
              cb(util.getGenericError("Error",500,"Order Cancellation mail can not be sent."))
            }else{
              var mailClient = {
                from: 'Akratiindia Updates <info@allied-up.com>', // sender address
                to: [email,'akash.rathore1924@gmail.com','sanketgoel12345@gmail.com'], // list of receivers
                subject: 'Your Akratiindia Order Cancelled Successfully ( '+ orderId +' ) ', // Subject line
                html: data1+data // html body
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

            }
          });



      }
    });

  }

  Order.remoteMethod('initiateTransaction',{

    description:"Method to create transaction",
    http: {path: '/initiateTransaction', verb: 'post'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });

  Order.remoteMethod('placeOrder',{

    description:"Method to create order",
    http: {path: '/placeOrder', verb: 'post'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });
  Order.remoteMethod('confirmOrder',{

    description:"Method to confirm order",
    http: {path: '/confirmOrder', verb: 'post'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' }}
  ],
    returns: {
        arg: '',type: 'string',root:'true'
      }
  });
  Order.remoteMethod('orderFailed',{

    description:"Method to confirm order",
    http: {path: '/orderFailed', verb: 'post'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' }}
  ],
    returns: {
        arg: '',type: 'string',root:'true'
      }
  });

  Order.remoteMethod('getOrder',{

    description:"Method to fetch one order",
    http: {path: '/getOrder', verb: 'get'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });

  Order.remoteMethod('getOrders',{

    description:"Method to fetch orders",
    http: {path: '/getOrders', verb: 'get'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });

  Order.remoteMethod('cancelOrder',{

    description:"Method to cancel order",
    http: {path: '/cancelOrder', verb: 'get'},
    accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });
};
