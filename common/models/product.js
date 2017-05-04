'use strict';
var util = require("../util/util");
var validate = require("../util/validation");
module.exports = function(Product) {

Product.showProducts = function(ctx, category, cb, next){
var skip = ctx.req.header('skip');
var realm = ctx.req.header('realm');
var access_code = ctx.req.header('access_code');
if(!skip || !category || !realm || !access_code || isNaN(skip)){
  cb(util.getGenericError('Error',400,'Bad Request!'));
  return;
}
category = category.toLowerCase();
console.log(category);
Product.find({limit: 52, skip: skip, where: {PCategory: category}},function(err,products){
  if(err){
    cb(util.getGenericError("Error",404,"Not Found!"));
  }else{
  cb(null, products);
  return;
}
});

}

Product.addProduct = function(data, cb, next)
{
  var realm = data.header('realm');
  var access_code = data.header('access_code');

  var body = data.body;
  console.log(body.PCode);
  if(!realm || !access_code || !body || body.PCode == undefined){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }
  console.log(body);
  Product.create(body,function(err){
    if(err){
      cb(util.getGenericError('Error',500,'Unable to add Product!'));
    }else{
      cb(null,"Product added successfully!");
      return;
    }
  })
  //cb(null);
}
Product.remoteMethod('showProducts',{

  description:"Fetches products from database",
  http: {path: '/showProducts', verb: 'get'},
  accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } },
            {arg: 'category', type: 'string', http: { source: 'query' } }
],
  returns: {
      arg: 'products',type: 'object'
    }
});

Product.remoteMethod('addProduct',{

  description:"Add products to database",
  http: {path: '/addProduct', verb: 'post'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
],
  returns: {
      arg: 'response',type: 'object'
    }
});
};
