'use strict';
var util = require("../util/util");
var validate = require("../util/validation");
var xlsx = require("node-xlsx");
var path = require("path");
module.exports = function(Product) {

Product.showProducts = function(ctx, category, cb, next){
var skip = ctx.req.header('skip');
var realm = ctx.req.header('realm');
var access_code = ctx.req.header('access_code');
var filters = ctx.req.body;

  if(!skip || !category || !realm || !access_code || isNaN(skip) || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android")){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }

category = category.toLowerCase();
console.log("Category---"+category);

console.log(JSON.stringify(filters));

var filterData = {};
filterData.sizes = [];
filterData.companies = [];
filterData.materials = [];
filterData.discount = {};
filterData.discount.discountMin = 0;
filterData.discount.discountMax = 0;
filterData.price = {};
filterData.price.priceMin = 0;
filterData.price.priceMax = 0;

var sizesFilter = [];
var materialFilter = [];

var applyCompanyFilter = {};
var applySizePriceFilter = {};
var applyMaterialFilter = {};
var applyDiscountFilter = {};
var applyCategoryFilter = {};

if(filters.searchQuery == true){
  if (category=="all"){
    category='';
  }
  var pattern = new RegExp('.*'+category+'.*', "i");
  applyCategoryFilter.or = [];
  var categoryNode = {};
  categoryNode.PCategory = {};
  categoryNode.PCategory.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PName = {};
  categoryNode.PName.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PDescription = {};
  categoryNode.PDescription.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PCompany = {};
  categoryNode.PCompany.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PMaterial1 = {};
  categoryNode.PMaterial1.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PMaterial2 = {};
  categoryNode.PMaterial2.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PMaterial3 = {};
  categoryNode.PMaterial3.like = pattern;
  applyCategoryFilter.or.push(categoryNode);
  categoryNode = {};
  categoryNode.PMaterial4 = {};
  categoryNode.PMaterial4.like = pattern;
  applyCategoryFilter.or.push(categoryNode);

}else{
  applyCategoryFilter.PCategory = category;
}


console.log(JSON.stringify(applyCategoryFilter));
if(filters.companies && filters.companies.length > 0){
applyCompanyFilter.or = [];
  for(var j=0; j< filters.companies.length; j++){
    var PCompany = {};
    PCompany.PCompany = filters.companies[j];
    applyCompanyFilter.or.push(PCompany);
  }

}

if(filters.sizes && filters.sizes.length == 0 && filters.price && filters.price.length != 0){
  for(var j = 0; j < filters.price.length; j++){
    applySizePriceFilter.or = [];
    for(var j = 0; j < filters.price.length; j++){
      var priceNode = {};
      priceNode.PPrice1 = {}
      priceNode.PPrice1.between = [];
      priceNode.PPrice1.between.push(filters.price[j].range1);
      priceNode.PPrice1.between.push(filters.price[j].range2);
      applySizePriceFilter.or.push(priceNode);
      priceNode = {};
      priceNode.PPrice2 = {}
      priceNode.PPrice2.between = [];
      priceNode.PPrice2.between.push(filters.price[j].range1);
      priceNode.PPrice2.between.push(filters.price[j].range2);
      applySizePriceFilter.or.push(priceNode);
      priceNode = {};
      priceNode.PPrice3 = {}
      priceNode.PPrice3.between = [];
      priceNode.PPrice3.between.push(filters.price[j].range1);
      priceNode.PPrice3.between.push(filters.price[j].range2);
      applySizePriceFilter.or.push(priceNode);
      priceNode = {};
      priceNode.PPrice4 = {}
      priceNode.PPrice4.between = [];
      priceNode.PPrice4.between.push(filters.price[j].range1);
      priceNode.PPrice4.between.push(filters.price[j].range2);
      applySizePriceFilter.or.push(priceNode);
    }
  }

}else{
  if(filters.sizes && filters.sizes.length != 0 && filters.price && filters.price.length == 0){
    applySizePriceFilter.or = [];
    for(var j = 0; j < filters.sizes.length; j++){
      var sizeNode = {};
      sizeNode.PSize1 = filters.sizes[j];
      applySizePriceFilter.or.push(sizeNode);
      sizeNode = {};
      sizeNode.PSize2 = filters.sizes[j];
      applySizePriceFilter.or.push(sizeNode);
      sizeNode = {};
      sizeNode.PSize3 = filters.sizes[j];
      applySizePriceFilter.or.push(sizeNode);
      sizeNode = {};
      sizeNode.PSize4 = filters.sizes[j];
      applySizePriceFilter.or.push(sizeNode);
    }
  }else{
    if(filters.sizes && filters.sizes.length != 0 && filters.price && filters.price.length != 0){
      applySizePriceFilter.or = [];
      for(var m = 0; m < filters.price.length; m++){
        for(var n = 0; n < filters.sizes.length; n++){
          var intersection = {};
          intersection.and = [];
          var priceNode = {};
          priceNode.PPrice1 = {}
          priceNode.PPrice1.between = [];
          priceNode.PPrice1.between.push(filters.price[m].range1);
          priceNode.PPrice1.between.push(filters.price[m].range2);
          intersection.and.push(priceNode);
          var sizeNode = {};
          sizeNode.PSize1 = filters.sizes[n];
          intersection.and.push(sizeNode);
          applySizePriceFilter.or.push(intersection);
          intersection = {};
          intersection.and = [];
          priceNode = {};
          priceNode.PPrice2 = {}
          priceNode.PPrice2.between = [];
          priceNode.PPrice2.between.push(filters.price[m].range1);
          priceNode.PPrice2.between.push(filters.price[m].range2);
          intersection.and.push(priceNode);
          sizeNode = {};
          sizeNode.PSize2 = filters.sizes[n];
          intersection.and.push(sizeNode);
          applySizePriceFilter.or.push(intersection);
          intersection = {};
          intersection.and = [];
          priceNode = {};
          priceNode.PPrice3 = {}
          priceNode.PPrice3.between = [];
          priceNode.PPrice3.between.push(filters.price[m].range1);
          priceNode.PPrice3.between.push(filters.price[m].range2);
          intersection.and.push(priceNode);
          sizeNode = {};
          sizeNode.PSize3 = filters.sizes[n];
          intersection.and.push(sizeNode);
          applySizePriceFilter.or.push(intersection);
          intersection = {};
          intersection.and = [];
          priceNode = {};
          priceNode.PPrice4 = {}
          priceNode.PPrice4.between = [];
          priceNode.PPrice4.between.push(filters.price[m].range1);
          priceNode.PPrice4.between.push(filters.price[m].range2);
          intersection.and.push(priceNode);
          sizeNode = {};
          sizeNode.PSize4 = filters.sizes[n];
          intersection.and.push(sizeNode);
          applySizePriceFilter.or.push(intersection);


        }
      }
    }
  }
}

if(filters.materials && filters.materials.length > 0){
  applyMaterialFilter.or = [];
    for(var j=0; j< filters.materials.length; j++){
      var materialNode = {};
      materialNode.PMaterial1 = filters.materials[j];
      applyMaterialFilter.or.push(materialNode);
      materialNode = {};
      materialNode.PMaterial2 = filters.materials[j];
      applyMaterialFilter.or.push(materialNode);
      materialNode = {};
      materialNode.PMaterial3 = filters.materials[j];
      applyMaterialFilter.or.push(materialNode);
      materialNode = {};
      materialNode.PMaterial4 = filters.materials[j];
      applyMaterialFilter.or.push(materialNode);
    }
}

  if(filters.discount && filters.discount.length > 0){
    applyDiscountFilter.or = [];
    for(var j = 0; j < filters.discount.length; j++){
      var discountNode = {};
      discountNode.PDiscount = {};
      discountNode.PDiscount.gt = filters.discount[j];
      applyDiscountFilter.or.push(discountNode);
    }
  }


console.log("discount filter-"+JSON.stringify(applyDiscountFilter));
console.log("size price filter-"+JSON.stringify(applySizePriceFilter));

Product.find({where: {and:[applyCategoryFilter,applyCompanyFilter,applySizePriceFilter,applyMaterialFilter,applyDiscountFilter,{PPrice1:{neq:null}}]}},function(err,products){
  if(err){
    cb(util.getGenericError("Error",500,"Internal Server Error!"));
  }else{
console.log("products size"+products.length);

  for(var i=0; i < products.length; i++){
    var foundSize1 = 0;
    var foundSize2 = 0;
    var foundSize3 = 0;
    var foundSize4 = 0;
    var foundMaterial1 = 0;
    var foundMaterial2 = 0;
    var foundMaterial3 = 0;
    var foundMaterial4 = 0;
    var foundCompany = 0;

//console.log("Product size-"+products[i].PSize1+"-"+products[i].PSize2+"-"+products[i].PSize3+"-"+products[i].PSize4);
      sizesFilter = filterData.sizes;

        for(var j = 0; j < sizesFilter.length; j++){
        //  console.log("size filter size-"+sizesFilter[j].size);
          if(products[i].PSize1 !='' && products[i].PSize1 == sizesFilter[j].size){
            filterData.sizes[j].count += 1;
            foundSize1 = 1;
          }


        if(products[i].PSize2 !='' && products[i].PSize2 != undefined && products[i].PSize2 != ''){
          if(products[i].PSize2 == sizesFilter[j].size){
            filterData.sizes[j].count += 1;
            foundSize2 = 1;
          }
        }

        if(products[i].PSize3 !='' && products[i].PSize3 != undefined && products[i].PSize3 != ''){
          if(products[i].PSize3 == sizesFilter[j].size){
            filterData.sizes[j].count += 1;
            foundSize3 = 1;
          }
        }

        if(products[i].PSize4 !='' && products[i].PSize4 != undefined && products[i].PSize4 != ''){
          if(products[i].PSize4 == sizesFilter[j].size){
            filterData.sizes[j].count += 1;
            foundSize4 = 1;
          }
        }

      }


        if(foundSize1 == 0 && products[i].PSize1 != undefined && products[i].PSize1 != ''){
          var sizeFilter = {};
          sizeFilter.size = products[i].PSize1;
          sizeFilter.count = 1;
          filterData.sizes.push(sizeFilter);


        }
        if(foundSize2 == 0 && products[i].PSize2 != undefined && products[i].PSize2 != ''){
          var sizeFilter = {};
          sizeFilter.size = products[i].PSize2;
          sizeFilter.count = 1;
          filterData.sizes.push(sizeFilter);


        }
        if(foundSize3 == 0 && products[i].PSize3 != undefined && products[i].PSize3 != ''){
          var sizeFilter = {};
          sizeFilter.size = products[i].PSize3;
          sizeFilter.count = 1;
          filterData.sizes.push(sizeFilter);


        }
        if(foundSize4 == 0 && products[i].PSize4 != undefined && products[i].PSize4 != ''){
          var sizeFilter = {};
          sizeFilter.size = products[i].PSize4;
          sizeFilter.count = 1;
          filterData.sizes.push(sizeFilter);


        }
        var sizeIncreasing = [];
        // for(var i=0;i<filterData.sizes.length;i++){
          filterData.sizes = filterData.sizes.sort();
          console.log(filterData.sizes);
        // }

        materialFilter = filterData.materials;
        for(var j =0; j < materialFilter.length; j++){
          if(products[i].PMaterial1 != undefined && products[i].PMaterial1 == materialFilter[j].material){
            filterData.materials[j].count += 1;
            foundMaterial1 = 1;
          }
          if(products[i].PMaterial2 != undefined && products[i].PMaterial2 == materialFilter[j].material){
            filterData.materials[j].count += 1;
            foundMaterial2 = 1;
          }
          if(products[i].PMaterial3 != undefined && products[i].PMaterial3 == materialFilter[j].material){
            filterData.materials[j].count += 1;
            foundMaterial3 = 1;
          }
          if(products[i].PMaterial4 != undefined && products[i].PMaterial4 == materialFilter[j].material){
            filterData.materials[j].count += 1;
            foundMaterial4 = 1;
          }
        }

        if(foundMaterial1 ==0 && products[i].PMaterial1 != undefined && products[i].PMaterial1 != ''){
          var material = {};
          material.material = products[i].PMaterial1;
          material.count = 1;
          filterData.materials.push(material);
        }
        if(foundMaterial2 ==0 && products[i].PMaterial2 != undefined && products[i].PMaterial2 != '' && products[i].PMaterial2 != products[i].PMaterial1){
          var material = {};
          material.material = products[i].PMaterial2;
          material.count = 1;
          filterData.materials.push(material);
        }
        if(foundMaterial3 ==0 && products[i].PMaterial3 != undefined && products[i].PMaterial3 != ''
            && products[i].PMaterial3 != products[i].PMaterial2 && products[i].PMaterial3 != products[i].PMaterial1){
          var material = {};
          material.material = products[i].PMaterial3;
          material.count = 1;
          filterData.materials.push(material);
        }
        if(foundMaterial4 ==0 && products[i].PMaterial4 != undefined && products[i].PMaterial4 != ''
            && products[i].PMaterial4 != products[i].PMaterial3 && products[i].PMaterial4 != products[i].PMaterial2 && products[i].PMaterial4 != products[i].PMaterial1){
          var material = {};
          material.material = products[i].PMaterial4;
          material.count = 1;
          filterData.materials.push(material);
        }

      for(var j = 0; j < filterData.companies.length; j++){
        if(products[i].PCompany == filterData.companies[j].company){
          filterData.companies[j].count += 1;
          foundCompany = 1;
        }
      }
        if(foundCompany == 0 && products[i].PCompany != undefined && products[i].PCompany != ''){
          var companyFilter = {};
          companyFilter.company =  products[i].PCompany;
          companyFilter.count = 1;
          filterData.companies.push(companyFilter);
        }

        if(products[i].PDiscount != undefined && products[i].PDiscount != ''){

          if(filterData.discount.discountMin == 0 && filterData.discount.discountMax == 0){
            filterData.discount.discountMin = products[i].PDiscount;
            filterData.discount.discountMax = products[i].PDiscount;
          }else{
          if(parseInt(products[i].PDiscount) <= parseInt(filterData.discount.discountMin)){
            filterData.discount.discountMin = products[i].PDiscount;

          }else{
            if(parseInt(products[i].PDiscount) >= parseInt(filterData.discount.discountMax)){
              filterData.discount.discountMax = products[i].PDiscount;

            }
          }
         }
        }

  var productPrices = [];
  if(products[i].PPrice1 != undefined && products[i].PPrice1 != 0){
    if(filters.sizes.length > 0){
    for(var j =0; j < filters.sizes.length; j++){
      if(products[i].PSize1 == filters.sizes[j]){
          productPrices.push(products[i].PPrice1);
      }
    }
  }else{
      productPrices.push(products[i].PPrice1);
    }
  }

  if(products[i].PPrice2 != undefined && products[i].PPrice2 != 0){
      if(filters.sizes.length > 0){
        for(var j =0; j < filters.sizes.length; j++){
          if(products[i].PSize2 && products[i].PSize2 == filters.sizes[j]){
          productPrices.push(products[i].PPrice2);
        }
      }
    }else{
      productPrices.push(products[i].PPrice2);
    }
  }

  if(products[i].PPrice3 != undefined && products[i].PPrice3 != 0){
    if(filters.sizes.length > 0){
    for(var j =0; j < filters.sizes.length; j++){
      if(products[i].PSize3 && products[i].PSize3 == filters.sizes[j]){
          productPrices.push(products[i].PPrice3);
      }
    }
  }else{
    productPrices.push(products[i].PPrice3);
  }
  }
  if(products[i].PPrice4 != undefined && products[i].PPrice4 != 0){
    if(filters.sizes.length > 0){
    for(var j =0; j < filters.sizes.length; j++){
      if(products[i].PSize4 && products[i].PSize4 == filters.sizes[j]){
          productPrices.push(products[i].PPrice4);
      }
    }
  }else{
    productPrices.push(products[i].PPrice4);
  }
  }
       if(filterData.price.priceMin == 0){

         filterData.price.priceMin = Math.min.apply(Math,productPrices);
         filterData.price.priceMax = Math.max.apply(Math,productPrices);

       }else{
         productPrices.push(filterData.price.priceMin);
         productPrices.push(filterData.price.priceMax);
         filterData.price.priceMin = Math.min.apply(Math,productPrices);
         filterData.price.priceMax = Math.max.apply(Math,productPrices);

       }

    }

    var priceDiff = filterData.price.priceMax - filterData.price.priceMin;
console.log("price diff-"+priceDiff);
    var price1Exist = 0;
    var price2Exist = 0;
    var price3Exist = 0;
    var price4Exist = 0;
    filterData.priceFilter = false;

    if(priceDiff > 40){
      var priceModulus = priceDiff / 4;
      filterData.price.price1 = filterData.price.priceMin;
      filterData.price.price8 = filterData.price.priceMax;
      filterData.price.price2 = parseInt(filterData.price.priceMin) + parseInt(priceModulus);
      filterData.price.price3 = parseInt(filterData.price.price2) + 1;
      filterData.price.price4 = parseInt(filterData.price.price3) + parseInt(priceModulus);
      filterData.price.price5 = parseInt(filterData.price.price4) + 1;
      filterData.price.price6 = parseInt(filterData.price.price5) + parseInt(priceModulus);
      filterData.price.price7 = parseInt(filterData.price.price6) + 1;
      filterData.price.price1Products = 0;
      filterData.price.price2Products = 0;
      filterData.price.price3Products = 0;
      filterData.price.price4Products = 0;

for(var i=0; i<products.length; i++){
  if(filters.sizes.length > 0){

    var productPrice = 0;
    for(var j =0; j < filters.sizes.length; j++){
      if(products[i].PSize1 == filters.sizes[j]){
         productPrice = products[i].PPrice1;
      }
      if(products[i].PSize2 == filters.sizes[j]){
         productPrice = products[i].PPrice2;
      }
      if(products[i].PSize3 == filters.sizes[j]){
         productPrice = products[i].PPrice3;
      }
      if(products[i].PSize4 == filters.sizes[j]){
         productPrice = products[i].PPrice4;
      }
    }

  if(productPrice >= filterData.price.price1 && productPrice <= filterData.price.price2){
    filterData.price.price1Products += 1;
    price1Exist = 1;
  }else{
    if(productPrice >= filterData.price.price3 && productPrice <= filterData.price.price4){
      filterData.price.price2Products += 1;
      price2Exist = 1;
    }else{
      if(productPrice >= filterData.price.price5 && productPrice <= filterData.price.price6){
          filterData.price.price3Products += 1;
          price3Exist = 1;

      }else{
        if(productPrice >= filterData.price.price7 && productPrice <= filterData.price.price8){
            filterData.price.price4Products += 1;
            price4Exist = 1;
          }
        }
      }
    }

  }else{
    var productPrice = parseInt(products[i].PPrice1);
    if(productPrice >= filterData.price.price1 && productPrice <= filterData.price.price2){
      filterData.price.price1Products += 1;
      price1Exist = 1;
    }else{
      if(productPrice >= filterData.price.price3 && productPrice <= filterData.price.price4){
        filterData.price.price2Products += 1;
        price2Exist = 1;
      }else{
        if(productPrice >= filterData.price.price5 && productPrice <= filterData.price.price6){
            filterData.price.price3Products += 1;
            price3Exist = 1;

        }else{
          if(productPrice >= filterData.price.price7 && productPrice <= filterData.price.price8){
              filterData.price.price4Products += 1;
              price4Exist = 1;
            }
          }
        }
      }
      productPrice = parseInt(products[i].PPrice2);
      if(productPrice >= filterData.price.price1 && productPrice <= filterData.price.price2){
        filterData.price.price1Products += 1;
        price1Exist = 1;
      }else{
        if(productPrice >= filterData.price.price3 && productPrice <= filterData.price.price4){
          filterData.price.price2Products += 1;
          price2Exist = 1;
        }else{
          if(productPrice >= filterData.price.price5 && productPrice <= filterData.price.price6){
              filterData.price.price3Products += 1;
              price3Exist = 1;

          }else{
            if(productPrice >= filterData.price.price7 && productPrice <= filterData.price.price8){
                filterData.price.price4Products += 1;
                price4Exist = 1;
              }
            }
          }
        }
        productPrice = parseInt(products[i].PPrice3);
        if(productPrice >= filterData.price.price1 && productPrice <= filterData.price.price2){
          filterData.price.price1Products += 1;
          price1Exist = 1;
        }else{
          if(productPrice >= filterData.price.price3 && productPrice <= filterData.price.price4){
            filterData.price.price2Products += 1;
            price2Exist = 1;
          }else{
            if(productPrice >= filterData.price.price5 && productPrice <= filterData.price.price6){
                filterData.price.price3Products += 1;
                price3Exist = 1;

            }else{
              if(productPrice >= filterData.price.price7 && productPrice <= filterData.price.price8){
                  filterData.price.price4Products += 1;
                  price4Exist = 1;
                }
              }
            }
          }
          productPrice = parseInt(products[i].PPrice4);
          if(productPrice >= filterData.price.price1 && productPrice <= filterData.price.price2){
            filterData.price.price1Products += 1;
            price1Exist = 1;
          }else{
            if(productPrice >= filterData.price.price3 && productPrice <= filterData.price.price4){
              filterData.price.price2Products += 1;
              price2Exist = 1;
            }else{
              if(productPrice >= filterData.price.price5 && productPrice <= filterData.price.price6){
                  filterData.price.price3Products += 1;
                  price3Exist = 1;

              }else{
                if(productPrice >= filterData.price.price7 && productPrice <= filterData.price.price8){
                    filterData.price.price4Products += 1;
                    price4Exist = 1;
                  }
                }
              }
            }
  }
 }
 filterData.price.price1Exist = price1Exist;
 filterData.price.price2Exist = price2Exist;
 filterData.price.price3Exist = price3Exist;
 filterData.price.price4Exist = price4Exist;


 if((price1Exist + price2Exist + price3Exist + price4Exist) >= 2){
   filterData.price.priceFilter = true;
 }
}


filterData.discount.discountFilter = false;

if(filterData.discount.discountMin != 0 && filterData.discount.discountMax != 0){
  var discountDiff = filterData.discount.discountMax - filterData.discount.discountMin;
   if(discountDiff > 4){
    var discountModulus = discountDiff / 3;
    discountModulus = parseInt(discountModulus);
    filterData.discount.discount1 = filterData.discount.discountMin;
    filterData.discount.discount2 = parseInt(filterData.discount.discount1) + discountModulus;
    filterData.discount.discount3 = parseInt(filterData.discount.discount2) + discountModulus;
    filterData.discount.discount4 = parseInt(filterData.discount.discount3) + (discountModulus / 2);
    filterData.discount.discountFilter = true;
   }

}




var response = {};
response.filterData = filterData;
response.products = [];

  for(var j = skip; j < products.length; j++){
    response.products.push(products[j]);
  }
console.log(response.products.length);
 cb(null,response);

}
});
}




Product.addProduct = function(data, cb, next)
{


  var realm = data.header('realm');
  var access_code = data.header('access_code');

  var body = data.body;
  if(!realm || !access_code || access_code != "onadmin" || (realm != "ios" && realm != "web" && realm != "android") || !body || body.PCode == undefined){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }
  console.log(body);
  body.PCategory = body.PCategory.toLowerCase();
  Product.create(body,function(err){
    if(err){
      cb(util.getGenericError('Error',500,'Unable to add Product!'));
    }else{
      cb(null,"Product added successfully!");
      return;
    }
  });
  cb(null);
}

Product.uploadSheet = function(ctx, cb){
  var realm = ctx.req.header('realm');
  var access_code = ctx.req.header('access_code');
  var fileName = ctx.fileName;
  console.log(JSON.stringify(fileName));
  if(!fileName){
    cb(util.getGenericError('Error',400,'Bad Request!'));
    return;
  }

  var obj = xlsx.parse(path.resolve(__dirname + '/../../client/assets/images/ProductSheets/'+ fileName));
  //console.log(JSON.stringify(obj));
  for(var i=0;i<obj.length;i++){
    var sheetName = obj[i].name.toLowerCase();
    var sheetData = obj[i].data;
    for(var j=1; j<sheetData.length;j++){
      var product = {};
      console.log(sheetName);
      product.PCategory = sheetName;
      product.PName = sheetData[j][0];
      product.PCompany = sheetData[j][1];
      product.PMaterial1 = sheetData[j][2];
      product.PFinish1 = sheetData[j][3];
      product.PSize1 = sheetData[j][4];
      product.PLength1 = sheetData[j][5];
      product.PWidth1= sheetData[j][6];
      product.PHeight1 = sheetData[j][7];
      product.PHoleToHole1 = sheetData[j][8];
      product.PWeight1 = sheetData[j][9];
      product.PQuantityMin1 = sheetData[j][10];
      product.PQuantityMax1 = sheetData[j][11];
      product.PPrice1 = sheetData[j][12];
      product.PDiscountPrice1 = sheetData[j][13];
      product.PMaterial2 = sheetData[j][14];
      product.PFinish2 = sheetData[j][15];
      product.PSize2 = sheetData[j][16];
      product.PLength2 = sheetData[j][17];
      product.PWidth2 = sheetData[j][18];
      product.PHeight2 = sheetData[j][19];
      product.PHoleToHole2 = sheetData[j][20];
      product.PWeight2 = sheetData[j][21];
      product.PQuantityMin2 = sheetData[j][22];
      product.PQuantityMax2 = sheetData[j][23];
      product.PPrice2 = sheetData[j][24];
      product.PDiscountPrice2 = sheetData[j][25];
      product.PMaterial3 = sheetData[j][26];
      product.PFinish3 = sheetData[j][27];
      product.PSize3 = sheetData[j][28];
      product.PLength3 = sheetData[j][29];
      product.PWidth3 = sheetData[j][30];
      product.PHeight3 = sheetData[j][31];
      product.PHoleToHole3 = sheetData[j][32];
      product.PWeight3 = sheetData[j][33];
      product.PQuantityMin3 = sheetData[j][34];
      product.PQuantityMax3 = sheetData[j][35];
      product.PPrice3 = sheetData[j][36];
      product.PDiscountPrice3 = sheetData[j][37];
      product.PMaterial4 = sheetData[j][38];
      product.PFinish4 = sheetData[j][39];
      product.PSize4 = sheetData[j][40];
      product.PLength4 = sheetData[j][41];
      product.PWidth4 = sheetData[j][42];
      product.PHeight4 = sheetData[j][43];
      product.PHoleToHole4 = sheetData[j][44];
      product.PWeight4 = sheetData[j][45];
      product.PQuantityMin4 = sheetData[j][46];
      product.PQuantityMax4 = sheetData[j][47];
      product.PPrice4 = sheetData[j][48];
      product.PDiscountPrice4 = sheetData[j][49];

      product.PDescription = sheetData[j][50];
      product.PDiscount = sheetData[j][51];
      product.PCode = sheetData[j][52];
      product.PImage1 = sheetData[j][53];
      product.PImage2 = sheetData[j][54];
      product.PImage3 = sheetData[j][55];
      product.PImageSmall = sheetData[j][56];

      console.log(JSON.stringify("Product data - "+j+" "+JSON.stringify(product)));
      if(product.PCategory && product.PCode && product.PCompany && product.PMaterial1 && product.PName){
      Product.upsert(product,function(err,instance){
        if(err){
          cb(util.getGenericError("Error",500,"Internal Server Error"+err));
        }
      });
    }
    }
  }
  cb(null);

}

Product.getProductCode = function(data, cb, next){
  var realm = data.header('realm');
  var access_code = data.header('access_code');
  if(!realm || !access_code || access_code != "onadmin" || (realm != "ios" && realm != "web" && realm != "android")){
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
  if(!realm || !access_code || access_code != "onadmin" || (realm != "ios" && realm != "web" && realm != "android")){
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
  if(!realm || !access_code || access_code != "onadmin" || (realm != "ios" && realm != "web" && realm != "android") || !code){
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
  if(!realm || !access_code || !code || access_code != "onyourown" || (realm != "ios" && realm != "web" && realm != "android")){
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
  http: {path: '/showProducts', verb: 'post'},
  accepts: [{arg: 'ctx', type: 'object', http: { source: 'context' } },
            {arg: 'category', type: 'string', http: { source: 'query' } }
],
  returns: {
      arg: 'response',type: 'object'
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

Product.remoteMethod('uploadSheet',{

  description:"Add products to database through excel sheet",
  http: {path: '/uploadSheet', verb: 'get'},
  accepts: [{arg: 'data', type: 'object', http: { source: 'context' } }
],
  returns: {
      arg: 'response',type: 'string'
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
