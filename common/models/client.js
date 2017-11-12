var util = require("../util/util");
var validate = require("../util/validation");
var uuid = require("uuid");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var path = require("path");
var request = require("request");
module.exports = function(Client) {

 /* Register new User */
Client.userRegister = function(data, cb, next){
  console.log(data.req.body);
var realm = data.req.header("realm");
var access_code = data.req.header("access_code");

if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android")){
  cb(util.getGenericError("Error", 405, "Bad Request!"));
  return;
}
var body = data.req.body;
if(!body.email || !body.mobile || !body.password || !realm){

  cb(util.getGenericError("Error",422,"All fields are required"));
  return;
}
if(!validate.isEmail(body.email)){

  cb(util.getGenericError("Error",402,"Invalid Email"));
  return;

}
if(!validate.isPhone(body.mobile)){
  cb(util.getGenericError("Error",402,"Invalid Mobile"));
  return;

}
if(body.password.length < 8){
  cb(util.getGenericError("Error",402,"Password too short"));
  return;
}


if(realm != 'web' && realm != 'ios' && realm != 'android'){
  cb(util.getGenericError("Error",402,"Invalid request source"));
  return;

}

Client.findOne({where:{and:[{client_email:body.email},{client_verified:{like:'YES'}}]}},function(err,clientInstance){
    if(err){
      cb(util.getGenericError("Error", 500, "Error occured.Try Again!"));
      return;
    }
    if(clientInstance){
      cb(util.getGenericError("Error", 402, "Email already registered."));
      return;
    }
  else{

    Client.findOne({where:{and:[{client_mobile:body.mobile},{client_verified:{like:'YES'}}]}},function(err,clientInstance){
        if(err){
          cb(util.getGenericError("Error", 500, "Error occured.Try Again!"));
          return;
        }
        if(clientInstance){
          cb(util.getGenericError("Error", 402, "Mobile number already registered."));
          return;
        }
        else{
    var uuid5 = uuid.v4() + body.mobile.charAt(3);
    console.log(uuid5);

    var otp = Math.floor((Math.random() * 10000)+1000);


    var registerData = {
                  "client_mobile": body.mobile,
                  "client_email": body.email,
                  "client_password": body.password,
                  "client_verified": otp,
                  "client_token": uuid5,
                  "client_realm": realm,
                  "client_fname": "",
                  "client_lname": ""

    };
console.log(registerData);

  Client.upsert(registerData,function(err,instance){

    if(err){
       cb(util.getGenericError("Error", 500, "Error occured.Try Again!"));
       return;
    }
    if(instance){
      console.log("instance---"+JSON.stringify(instance));
      console.log("sending sms");
      request.post('http://websms.one97.net/sendsms/sms_request.php?username='+util.SMS_NAME+'& password='+util.SMS_PASSWORD+
      '&smsfrom=Akratiindia&receiver='+registerData.client_mobile+
      '&content=Akratiindia - '+registerData.client_verified+util.SMS_OTP_MESSAGE+'&udh=&response=JSON',
      function(err, httpResponse, body) {
  if (err) {
    console.error('Error:', err);
    return;
  }
  console.log(JSON.parse(body));
})
      cb(null, instance);
      return;
    }else{
      cb(util.getGenericError("Error", 500, "Error occured.Try Again!"));
      return;
    }

  });
}
});
}
});


}

Client.submitOTP = function(ctx,cb){
  var realm = ctx.req.header("realm");
  var access_code = ctx.req.header("access_code");
  var data = ctx.req.body;

  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android") || !data.clientId || !data.OTP){
    cb(util.getGenericError("Error", 405, "Bad Request!"));

  }else{
    Client.findOne({where:{client_token:data.clientId}},function(err,instance){
      if(err){
        cb(util.getGenericError("Error", 500, "Internal server error"));
      }
      if(instance){
         if(instance.client_verified == data.OTP){
           instance.client_verified == "YES";
           instance.updateAttribute('client_verified',"YES",function(err,instanceUpdated){
             if(err){
               cb(util.getGenericError("Error", 500, "Error occured.Try again!"));
             }
             if(instanceUpdated){
               cb(null,instanceUpdated);
             }else{
               cb(util.getGenericError("Error", 500, "Error occured.Try again!"));
             }

           })

         }else{
               cb(util.getGenericError("Error", 405, "Enter correct OTP"));
             }
       }else{
         cb(util.getGenericError("Error",405,"User not found"));
       }
        })
      }
  }


 /* Login user */
Client.login = function(data, cb, next){

var realm = data.req.header("realm");
var access_code = data.req.header("access_code");

if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android")){
  cb(util.getGenericError("Error", 405, "Bad Request!"));
  return;
}
var body = data.req.body.user;
var cart = data.req.body.cart;
console.log("sendData-->"+JSON.stringify(cart));
console.log("user-->"+JSON.stringify(body));
if(!body.email || !body.password || !realm){

  cb(util.getGenericError("Error",422,"Request Unprocessable"));
  return;
}

if(!validate.isEmail(body.email)){

  cb(util.getGenericError("Error",402,"Invalid Email"));
  return;

}
if(body.password.length < 8){
  cb(util.getGenericError("Error",402,"Invalid Password"));
  return;
}
console.log("reached point:1");
Client.findOne({where:{and:[{client_email : body.email },{client_password: body.password }]}, include:{relation:'CartItems'}}, function(err, instance){
  console.log("reached point:2");

  if(err){
    console.log("err"+err);
    cb(util.getGenericError("Error", 500, "Internal Server Error!:"+err));
    return;

  }
  if(instance){
console.log("user exist");
    for(i=0; i < cart.length; i++){
      cart[i].PClientId = instance.id;
      console.log("cart--"+JSON.stringify(cart[i]));
      instance.CartItems.create(cart[i], function(err){
        if(err){
          cb(util.getGenericError("Error", 500, "Error in creating cart item:"+err));
          return;
          //console.log("Error in creating cart item:"+err);
        }
      });
    }
          Client.find({where:{and:[{client_email : body.email },{client_password: body.password }]}, include:{relation:'CartItems',scope:{include:{relation:'product'}}}}, function(err, instanceNew){
          if(err){
            cb(util.getGenericError("Error", 500, "Internal Server Error:"+err));
            return;
          }
          if(instanceNew){
            console.log(JSON.stringify(instanceNew));
            cb(null, instanceNew);
            return;
          }
        });

   //cb(null, instance);
  //  cb(null);
    return;
  }else
  {
    cb(util.getGenericError("Error",  402, "Invalid email or password"));
    return;
  }
});
}
Client.addToCart = function(data, cb){

  var realm = data.header("realm");
  var access_code = data.header("access_code");
  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }

  var email = data.header("email");
  var token = data.header("token");
  console.log("email"+email);
  console.log("token"+token);
  Client.findOne({where:{and:[{client_email : email},{client_token : token}]}}, function(err, instance){
    if(err){
      cb(util.getGenericError("Error", 500, "Internal Server Error:"+ err));
      return;
    }
    if(instance){
      console.log("instance--"+JSON.stringify(instance));
      var cartItem = data.body;
      cartItem.PClientid = instance.id;
      console.log(JSON.stringify(cartItem));
      instance.CartItems.create(cartItem, function(err, cart){
        if(err){
            cb(util.getGenericError("Error", 500, "Error in creating cart item:"+err));
            return;
            console.log("Error in creating cart item:"+err);

        }
        if(cart){

          cb(null, cart);
          return;
        }
      });
    }else{
      cb(null,"User not found!");
    }
  });
}

Client.removeFromCart = function(req, cb){
    var realm = req.header("realm");
    var access_code = req.header("access_code");
    if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android")){
      cb(util.getGenericError("Error", 405, "Bad Request!"));
      return;
    }

    var email = req.header("email");
    var token = req.header("token");
    Client.findOne({where:{and:[{client_email : email},{client_token : token}]}, include:{relation:'CartItems'}}, function(err, instance){
      if(err){
        cb(util.getGenericError("Error", 500, "Internal Server Error:"+ err));
        return;
      }
      if(instance){
        var cartItem = req.body;

        instance.CartItems.destroy(cartItem.id, function(err){
          if(err){
              cb(util.getGenericError("Error", 500, "Error in deleting cart item:"+err));
              return;
              console.log("Error in creating cart item:"+err);

          }else{
            cb(null,"Deleted!");
            return;
          }



        });
      }else {
        cb(util.getGenericError("Error",204,"Item not found!"));
      }
    });
}


Client.showCart = function(req,token,cb){
  var realm = req.header("realm");
  var access_code = req.header("access_code");

  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android") || !token){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }

  Client.findOne({where:{client_token:token}, include:{relation:'CartItems'}}, function(err, instance){

    if(err){
      cb(util.getGenericError("Error", 500, "Internal Server Error!"));
      return;
    }
    if(instance){
    console.log("instance found");
      console.log(instance.CartItems[0]);
      cb(null,instance);
      return;
    }else{
      cb(util.getGenericError("Error", 204, "No content Found!"));
      return;
    }
  })
}

Client.submitQuery = function(req,cb){
  var realm = req.header("realm");
  var access_code = req.header("access_code");
  var data = req.body;
  var user = data.user;
  var query = data.query;

  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }

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


  ejs.renderFile(path.resolve(__dirname , "../util/userQuery.ejs"), {query:query,name:user.fname+' '+user.lname,mail:user.email,mobile:user.mobile,id:user.id }, function (err, data) {
    if(err){
        cb(util.getGenericError("Error",500,"Order Confirmation mail can not be sent."))
      }else{
        var mailAkrati = {
          from: 'Akratiindia Query <info@allied-up.com>', // sender address
          to: 'info@allied-up.com', // list of receivers
          subject: 'Akratiindia User Query ', // Subject line
          html: data // html body
        };
        transporter.sendMail(mailAkrati, (error, info) => {
          if (error) {
            cb(util.getGenericError("Error",500,"Internal Server Error!"))
          }else{
            console.log('Message %s sent: %s', info.messageId, info.response);
            cb(null,"Query submitted");
            return;
          }
        });
      }
    });
}

Client.getProfile = function(data,cb){
  var req = data.req;
  var realm = req.header("realm");
  var access_code = req.header("access_code");
  var token = req.header("token");

  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android") || !token){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }

  Client.findOne({where:{client_token:token}},function(err,instance){
    if(err){
      cb(util.getGenericError("Error", 500, "Internal Server Error!"));
      return;

    }
    if(instance){
      cb(null,instance);
    }else{
      data.res.statusCode = 204;
      data.res.statusText = "No User Found";
      data.res.data = {};
      cb(null,data.res.data);

    }
  })
}

Client.updateProfile = function(ctx,cb){
  var req = ctx.req;
  var realm = req.header("realm");
  var access_code = req.header("access_code");
  var clientId = req.header("id");

  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android") || !clientId){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }
  var requestData = {};
  console.log(req.body);
  requestData = req.body;
  Client.upsertWithWhere({id:clientId},requestData,function(err,instance){
    if(err){
      console.log(err);
      cb(util.getGenericError("Error", 500, "Internal Server Error!"));
      return;
    }
    if(instance){
      console.log(JSON.stringify(instance));
      cb(null,instance);
    }
  })
}

/* Remote methods registration */
Client.remoteMethod('userRegister',{

  description:"Register new User ",
  http: {path: '/userRegister', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'context' } },
  returns: {
      arg: 'response',type: 'object'
    }
});
Client.remoteMethod('submitOTP',{

  description:"Verify mobile using OTP",
  http: {path: '/submitOTP', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'context' } },
  returns: {
      arg: 'response',type: 'object'
    }
});

Client.remoteMethod('login',{

  description:"Login User ",
  http: {path: '/login', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'context' } },
  returns: {
       arg: 'response', type: 'object'
    }
});
Client.remoteMethod('addToCart',{

  description:"Add product to Cart of Client",
  http: {path: '/addToCart', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'req' } },
  returns: {
       arg: 'response', type: 'object'
    }
});

Client.remoteMethod('removeFromCart',{

  description:"Remove product from Cart of Client",
  http: {path: '/removeFromCart', verb: 'delete'},
  accepts: {arg: 'data', type: 'object', http: { source: 'req' } },
  returns: {
       arg: 'response', type: 'object'
    }
});

Client.remoteMethod('showCart',{

  description:"Show Cart items of Client",
  http: {path: '/showCart', verb: 'get'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'req' } },
           {arg: 'token', type: 'string', http: { source: 'query' } }],
  returns: {
       arg: 'response', type: 'object'
    }
});

Client.remoteMethod('submitQuery',{

  description:"Send query on behalf of user.",
  http: {path: '/submitQuery', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'req' } },
  returns: {
       arg: 'response', type: 'string'
    }
});

Client.remoteMethod('getProfile',{

  description:"Fetch user details by user token",
  http: {path: '/getProfile', verb: 'get'},
  accepts: {arg: 'data', type: 'object', http: { source: 'context' } },
  returns: {
       arg: 'response', type: 'object'
    }
});

Client.remoteMethod('updateProfile',{
  description:"Update Profile data using client id",
  http: {path: '/updateProfile', verb: 'patch'},
  accepts: {arg: 'data', type: 'object', http: { source: 'context' } },
  returns: {
       arg: 'response', type: 'object'
    }
})

};
