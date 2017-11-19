'use strict';
var util = require("../util/util.js");

module.exports = function(HomeTemplate) {

HomeTemplate.getTempData = function(req,cb){
  var realm = req.header("realm");
  var access_code = req.header("access_code");
console.log(access_code+realm);
  if(!access_code || access_code != "onyourown" || !realm || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError("Error", 405, "Bad Request!"));
    return;
  }
  HomeTemplate.findOne(function(err,instance){
    if(err){
      cb(util.getGenericError("Error", 500, "Internal Server Error!"));
    }else{
      console.log(JSON.stringify(instance));
      cb(null,instance);
    }
  });


}

HomeTemplate.remoteMethod('getTempData',{

  description:"Get Template Data for Home Page",
  http: {path: '/getTempData', verb: 'get'},
  accepts: {arg: 'data', type: 'object', http: { source: 'req' } },
  returns: {
       arg: 'response', type: 'object'
     }
    });
};
