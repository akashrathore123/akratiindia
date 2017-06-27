'use strict';

module.exports = function(Cartitem) {
var util = require('../util/util');
Cartitem.deleteCart = function(data,cb){
  var realm = data.header('realm');
  var access_code = data.header('access_code');
  var clientId = data.header('PClientId');
  if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !clientId){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }
  console.log(clientId);
  Cartitem.destroyAll({PClientId:clientId},function(err,info){
    if(err){
      console.log((err));
      cb(util.getGenericError("Error",500,"Internal Server Error!"));

    }else{
      console.log(info);
      cb(null,"Cart Deleted!");
    }
  });

  }

  Cartitem.remoteMethod('deleteCart',{

    description:"Method to delete cart using client Id",
    http: {path: '/deleteCart', verb: 'delete'},
    accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
  ],
    returns: {
        arg: 'response',type: 'string'
      }
  });

};
