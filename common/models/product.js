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
};
