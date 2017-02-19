var util = require("../util/util");
var validate = require("../util/validation");
var uuid = require("uuid");
module.exports = function(Client) {

 /* Register new User */
Client.userRegister = function(data, cb, next){
  console.log(data.req.body);
var realm = data.req.header("realm");
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
                  "client_realm": realm

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
Client.login = function(data, cb){
console.log("login");

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
  accepts: {arg: 'data', type: 'object', http: { source: 'body' } },
  returns: {
      type: 'object',root: true
    }
});

};
