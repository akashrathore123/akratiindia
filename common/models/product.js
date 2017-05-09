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

Product.getProductCode = function(data, cb, next){
  var realm = data.header('realm');
  var access_code = data.header('access_code');
  if(!realm || !access_code){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }
Product.find({fields:{'PCode':true}},function(err,object){
  console.log(object);
  if(err){
    cb(util.getGenericError("Error",500,"Unable to fetch Products!"));
  }else{
    cb(null,object);
    return;
  }
})

}

Product.getUpdateProduct = function(data, cb, next){
  var realm = data.req.header('realm');
  var access_code = data.req.header('access_code');
  if(!realm || !access_code){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }
  var code = data.req.header('code');
  Product.findOne({where:{PCode:code}},function(err,product){
    if(err){
      cb(util.getGenericError("Error",500,"Internal Server Error!"));
      return;
    }
    if(!product){
      data.res.statusCode = 204;
      data.res.statusText = "Product not found";
      data.res.data = {}
      cb(null,data.res.data);

      return;
    }else{
      cb(null,product);
    }
  })
}

Product.updateProduct = function(data, cb, next){
  var realm = data.header('realm');
  var access_code = data.header('access_code');
  var code = data.header('code');
  if(!realm || !access_code || !code){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }

  var updatedProduct = data.body;
  console.log("body--"+data.body);

  Product.findOne({where:{PCode:code}},function(err,product){
    if(err){
      cb(util.getGenericError("Error",500,"Internal Server Error!"));
      return;
    }
    if(!product){
      data.res.statusCode = 204;
      data.res.statusText = "Product not found";
      data.res.data = {}
      cb(null,data.res.data);
      return;

    }else{
console.log("found product");
    product.updateAttributes(updatedProduct,function(err,product){
    if(err){
      cb(util.getGenericError("Error",500,"Internal Server Error!"));
      return;
    }else{

      console.log("updated product"+product);
      cb(null,product);
    }
  });
    }
  });
}

Product.productDetails = function(data, cb){
  var realm = data.req.header('realm');
  var access_code = data.req.header('access_code');
  var code = data.req.header('code');
  if(!realm || !access_code || !code){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }

  Product.findOne({where:{PCode:code}},function(err, product){
    if(err){
      cb(util.getGenericError("Error",500,"Internal Server Error!"));
      return;
    }
    if(!product){
      data.res.statusCode = 204;
      data.res.statusText = "Product not found";
      cb(null);
      return;
    }else{
      console.log(product);
      cb(null, product);
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

Product.remoteMethod('addProduct',{

  description:"Add products to database",
  http: {path: '/addProduct', verb: 'post'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
],
  returns: {
      arg: 'response',type: 'object'
    }
});

Product.remoteMethod('getProductCode',{

  description:"Fetch product codes",
  http: {path: '/getProductCode', verb: 'get'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
],
  returns: {
      arg: 'response',type: 'object'
    }
});

Product.remoteMethod('getUpdateProduct',{

  description:"Fetch product by product code",
  http: {path: '/getUpdateProduct', verb: 'get'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'context' } }
],
  returns: {
      arg: 'response',type: 'object'
    }
});

Product.remoteMethod('updateProduct',{

  description:"Update product by product code",
  http: {path: '/updateProduct', verb: 'put'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'req' } }
],
  returns: {
      arg: 'response',type: 'object'
    }
});

Product.remoteMethod('productDetails',{

  description:"Fetch product details by product code",
  http: {path: '/productDetails', verb: 'get'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'context' } }
],
  returns: {
      arg: 'response',type: 'object'
    }
});

};
