var util = require("../util/util");
var validate = require("../util/validation");
var uuid = require("uuid");
var nodemailer = require("nodemailer");
var ejs = require("ejs");
var path = require("path");
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

  cb(util.getGenericError("Error",422,"Request Unprocessable"));
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

Client.findOne({where:{client_email:body.email}},function(err,clientInstance){
    if(err){
      cb(util.getGenericError("Error", 500, "Internal Server Error"));
      return;
    }
    if(clientInstance){
      cb(util.getGenericError("Error", 402, "Email already registered."));
      return;
    }
    var uuid5 = uuid.v4() + body.mobile.charAt(3);
    console.log(uuid5);
    var registerData = {
                  "client_mobile": body.mobile,
                  "client_email": body.email,
                  "client_password": body.password,
                  "client_verified": "NO",
                  "client_token": uuid5,
                  "client_realm": realm,
                  "client_fname": "",
                  "client_lname": ""

    };
console.log(registerData);

  Client.create(registerData,function(err,instance){

    if(err){
       cb(util.getGenericError("Error", 500, "Internal Server Error."));
       return;
    }else{
      cb(null, instance);
      return;
    }

  });
});


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
      instance.CartItems.create(cartItem, function(err, cart){
        if(err){
            cb(util.getGenericError("Error", 500, "Error in creating cart item:"+err));
            return;
            //console.log("Error in creating cart item:"+err);

        }
        if(cart){

          cb(null, cart);
          return;
        }
      });
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
              //console.log("Error in creating cart item:"+err);

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

  let transporter = nodemailer.createTransport({

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
        let mailAkrati = {
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

/* Remote methods registration */
Client.remoteMethod('userRegister',{

  description:"Register new User ",
  http: {path: '/userRegister', verb: 'post'},
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
};
