//var error = require("error");
const DOMAIN = "http://139.59.23.178/";
module.exports = {
 DOMAIN : DOMAIN,

getGenericError:function(type,code,message){
var error = new Error();
error.status = code;
error.message = message;
  return error;
  }
}
