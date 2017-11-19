var util = require("../util/util");
var validate = require("../util/validation");

module.exports = function(Admin) {


Admin.login = function(data, cb, next){
  var body = data.body;


  var realm = data.header('realm');

  if(!body.adminId || !body.password ||  !realm || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError("Error", 422, "Request Unprocessable"));
    return;
  }
  if(!validate.isEmail(body.adminId)){
    cb(util.getGenericError("Error", 405, "Invalid Admin ID!"));
    return;
  }
  if(body.password.length < 8){
    cb(util.getGenericError("Error",402,"Password too short"));
    return;
  }
console.log();
  Admin.findOne({where:{and:[{adminId: body.adminId},{adminPassword: body.password}]}}, function(err, instance){
    if(err){
      console.log("error");
      cb(util.getGenericError("Error", 402, "Invalid ID or Password."));
      return;
    }
    if(instance){
console.log("success");
      cb(null, instance);
      return;
    }else {
      cb(util.getGenericError("Error", 402, "User not exist!"));
      return;
    }

  });
}

Admin.remoteMethod('login',{

  description:"Admin login",
  http: {path: '/login', verb: 'post'},
  accepts: {arg: 'data', type: 'object', http: { source: 'req' } },
  returns: {
       arg: 'response', type: 'object'
    }
});
};
