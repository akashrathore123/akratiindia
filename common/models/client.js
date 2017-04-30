var util = require("../util/util");
var validate = require("../util/validation");
var uuid = require("uuid");
module.exports = function(Client) {

 /* Register new User */
Client.userRegister = function(data, cb, next){
  console.log(data.req.body);
var realm = data.req.header("realm");
var access_code = data.req.header("access_code");

if(!access_code || access_code != "onyourown"){
  cb(util.getGenericError("Error", 404, "Bad Request!"));
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

  Client.create(registerData,function(err){

    if(err){
       cb(util.getGenericError("Error", 500, "Internal Server Error."));
       return;
    }else{
      cb(null, registerData);
      return;
    }

  });
});


}

 /* Login user */
Client.login = function(data, cb, next){

var realm = data.req.header("realm");
var access_code = data.req.header("access_code");

if(!access_code || access_code != "onyourown"){
  cb(util.getGenericError("Error", 404, "Bad Request!"));
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
            console.log("found again");
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
console.log('reached');
  var realm = data.header("realm");
  var access_code = data.header("access_code");
console.log(realm + access_code);
  if(!access_code || access_code != "onyourown"){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }

  var email = data.header("email");
  var token = data.header("token");
  Client.findOne({where:{and:[{client_email : email},{client_token : token}]}}, function(err, instance){
    if(err){
      cb(util.getGenericError("Error", 500, "Internal Server Error:"+ err));
      return;
    }
    if(instance){
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

};
