'use strict';
var util = require("../util/util");
var validate = require("../util/validation");

module.exports = function(Address) {

  Address.getAddresses = function(data, cb, next){
    var realm = data.header('realm');
    var access_code = data.header('access_code');
    var clientId = data.header('PClientId');
    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !clientId){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }

    Address.find({where:{PClientId:clientId}},function(err,instances){
      if(err){
        cb(util.getGenericError("Error",500,'Internal Server Error!'));
      }
      if(instances){
        var response = {};
        response.Addresses = instances;
        cb(null,response);
      }
    });

  }

  Address.removeAddress = function(data,cb){
    var realm = data.header('realm');
    var access_code = data.header('access_code');
    var addressId = data.header('addressId');
    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !addressId){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }
    console.log(addressId);
    Address.destroyById(addressId, function(err){
      if(err){
        cb(util.getGenericError("Error",500,"Error in removing address."));
      }else{
        cb(null,"Address removed successfully.");
      }
    });

  }

  Address.saveAddress = function(data,cb){
    var realm = data.header('realm');
    var access_code = data.header('access_code');
    var address = data.body;
    if(!realm || !access_code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android") || !address){
      cb(util.getGenericError('Error',400,'Bad Request!'));
      return;
    }

    Address.create(address,function(err){
      if(err){
        cb(util.getGenericError("Error",500,"Internal Server Error!"));
      }else{
        cb(null,"Address added!");
      }
    });
  }

  Address.remoteMethod('getAddresses',{

    description:"Fetch user Addresses",
    http: {path: '/getAddresses', verb: 'get'},
    accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
  ],
    returns: {
        arg: 'response',type: 'object'
      }
  });

  Address.remoteMethod('removeAddress',{

    description:"Fetch user Addresses",
    http: {path: '/removeAddress', verb: 'delete'},
    accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
  ],
    returns: {
        arg: 'response',type: 'string'
      }
  });


  Address.remoteMethod('saveAddress',{

    description:"Add user Address",
    http: {path: '/saveAddress', verb: 'post'},
    accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
  ],
    returns: {
          arg: 'response',type: 'string'
        }
    });
};
