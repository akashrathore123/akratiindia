var app = angular.module('main',['ngStorage','ngRoute']);
app.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl : 'home.html'
  })
  .when('/product/:category',{
    templateUrl : 'product.html'
  })
  .when('/productDetails/:code',{
    templateUrl : 'productDetails.html'
  })
  .when('/cart',{
    templateUrl : 'cart.html'
  })
  .when('/error500',{
    templateUrl : 'error500.html'
  })
  .when('/error204',{
    templateUrl : 'error204.html'
  });
});

app.directive('myEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.myEnter);
                });

                event.preventDefault();
            }
        });
    };
});

/* Factory methods */

app.factory('localStorage', function($localStorage){

  var storage = {};

  storage.saveData = function(key, data){
    var dataObj;
  if($localStorage.Akratiindia != undefined && $localStorage.Akratiindia != ""){
    dataObj = $localStorage.Akratiindia;
  }else {
    $localStorage.Akratiindia = {};
    dataObj = {};
  }
    var keyObj = [];
    if(key == 'cart'){
      if(dataObj.cart != undefined && dataObj.cart != ""){
        keyObj = dataObj.cart;
      }
      keyObj.push(data);
      $localStorage.Akratiindia.cart = keyObj;
    }
    if(key == 'User'){
      if(dataObj.User != undefined && dataObj.User != ""){
        keyObj = dataObj.User;
      }
      keyObj.push(data);
      $localStorage.Akratiindia.User = keyObj;
    }




//  $localStorage.key = data;
  return;
  }

  storage.getData = function(key){
  var dataObj;
  if($localStorage.Akratiindia != undefined){
    dataObj = $localStorage.Akratiindia;
  }else {
    $localStorage.Akratiindia = {};
    dataObj = {};
  }
 var keyObj = [];
 if(key == 'cart'){
   if(dataObj.cart != undefined){
     return dataObj.cart;
   }
 }
 if(key == 'User'){
   if(dataObj.User != undefined){
     return dataObj.User;
   }
 }

    return undefined;
  }

  storage.deleteData = function(key, data){
    var dataObj;
    if($localStorage.Akratiindia != undefined){
      dataObj = $localStorage.Akratiindia;
    }else{
      $localStorage.Akratiindia = {};
      dataObj = {};
    }
    if (key == 'cart') {
      var items = dataObj.cart;
      if(items != undefined){
        for(var i=0; i < items.length; i++){
          if(items[i] == data){
          // if((items[i] != undefined && items[i].id == data.id) || ((items[i].POrderQuant1 == data.POrderQuant1)
          //       && (items[i].POrderQuant2 == data.POrderQuant2) && (items[i].POrderQuant3 == data.POrderQuant3)
          //     && (items[i].POrderQuant4 == data.POrderQuant4) && (items[i].PProduct.PCode == data.PProduct.PCode)){
            items.splice(i,1);
          }
        }

        $localStorage.Akratiindia.cart = items;
      }
    }
    if (key == 'User') {
      var items = dataObj.User;
      if(items != undefined){
        items.pop(data);
        $localStorage.Akratiindia.User = items;
      }
    }


  }

  storage.deleteAll = function(key){
   if($localStorage.Akratiindia != undefined && $localStorage.Akratiindia != ""){
     if(key == 'cart' && $localStorage.Akratiindia.cart != ""){
     $localStorage.Akratiindia.cart = "";
   }
   if(key == 'User' && $localStorage.Akratiindia.User != ""){
   $localStorage.Akratiindia.User = "";
 }
  //  $localStorage.$reset();


  }
}
  return storage;

});

app.service('updateCart', function(localStorage){
   this.update = function(){
     if(localStorage.getData('cart') != undefined && localStorage.getData('cart') != ""){
     document.getElementById("cartValue").innerHTML = localStorage.getData('cart').length;
}else{
  document.getElementById("cartValue").innerHTML = "";
}
}
});


/* Controllers for app 'main' */
app.controller('registerAction',['$scope','$http','$window','localStorage',function($scope,$http,$window,localStorage){
$http.defaults.headers.common = {'access_code':'onyourown'};
  $scope.userRegister = function(){

  document.getElementById("registerResponse").innerHTML = "";

  var user =JSON.stringify($scope.register);

var password1 = $scope.register.password;
var password2 = $scope.register.confirmPassword;
if(password1 == password2){
  document.getElementById("registerButton").disabled = true;
      $http({


               method : 'POST',
               url : 'http://localhost:3000/api/Clients/userRegister',
               headers: {'Content-Type': 'application/json',
                          'realm': 'web'},
               data : user
           }).
           success(function(data,status,headers,config){

                //console.log(data.response.client_token);
                var Akratiindia = '{\"token\" :\"'+ data.response.client_token+'\", \"mobile\" : \"'+data.response.client_mobile+'\", \"email\" :\"'+ data.response.client_email+'\" , \"fname\" :\"'+ data.response.client_fname+'\", \"lname\" :\"'+ data.response.client_lname+'\"}';
                localStorage.saveData('User', Akratiindia);
              //  console.log('cookies'+Akratiindia);
                document.cookie = Akratiindia;

              //  $document.cookie = "token="+data.response.client_token;


                $window.location = "index.html";



                return;

           })
           .error(function(data,status,headers,config){

        document.getElementById("registerButton").disabled = false;
        //console.log(data);
        document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*"+data.error.message+"</span>";
    });
}else{

        document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*Password not matched</span>";

}
  }

}]);


app.controller('loginAction',['$scope', '$http', '$window', 'localStorage', function($scope,$http,$window,localStorage){
  $http.defaults.headers.common = {'access_code':'onyourown'};
  $scope.userLogin = function(){
      var login =JSON.stringify($scope.login);
      var cart = localStorage.getData('cart');
      if(cart == undefined){
        cart = {};
      }
      // console.log("cart---"+JSON.stringify(cart));
      // console.log(JSON.stringify('{"data":[ {"user" :['+login + '], "cart" :'+ JSON.stringify(cart)+' }]}'));
      var sendData = ' {"user" :'+login + ', "cart" :'+ angular.toJson(cart)+'}';

      $http({


               method : 'POST',
               url : 'http://localhost:3000/api/Clients/login',
               headers: {'Content-Type': 'application/json',
                         'realm': 'web'},
               data : sendData
           }).
           success(function(data,status,headers,config){
             var loginData = data.response[0];

             var User = '{\"token\" :\"'+ loginData.client_token+'\", \"mobile\" : \"'+loginData.client_mobile+'\", \"email\" :\"'+ loginData.client_email+'\" , \"fname\" :\"'+ loginData.client_fname+'\", \"lname\" :\"'+ loginData.client_lname+'\"}';
             var cartData = loginData.CartItems;
             localStorage.deleteAll('cart');
             localStorage.deleteAll('User')
             for(i=0; i < cartData.length; i++){
               localStorage.saveData('cart', cartData[i]);
             }
            // document.getElementById("loginResponse").innerHTML = data.error.message;
             localStorage.saveData('User', User);
             setTimeout(function(){
               $window.location = "index.html";
             }, 300);
                return;

           })
      .error(function(data,status,headers,config){
        document.getElementById("loginResponse").innerHTML = "<span style='color:red'>"+data.error.message;
        return;
    });

  }

}]);

app.controller('loginCheck',['$scope','$http','$window','updateCart','localStorage', function($scope,$http,$window,updateCart,localStorage){
  $http.defaults.headers.common = {'access_code':'onyourown'};
  updateCart.update();
  $scope.checkSession = function(){
    //console.log("checking session");
 var session = localStorage.getData('User');
 //console.log("session--"+JSON.stringify(session));
  if(session){
//session exists
    var cookies = JSON.parse(session);
  //  document.getElementById("userTools").style.visibility = "visible";
    document.getElementById("userIcon").onmouseover = function(){
    document.getElementById("userTools").style.display = "block";
    };
    document.getElementById("userIcon").onmouseout = function(){
    document.getElementById("userTools").style.display = "none";
    };

    document.getElementsByClassName("userToolName").innerHTML = cookies.fname + " " +cookies.lname;
    document.getElementById("userToolEmail").innerHTML = cookies.email;
  }else{
    //session not exists
    document.getElementById("userTools").style.display = "none";

    document.getElementById("userIcon").onclick = openLoginModal;
    //console.log("session not exist");
  }
}
$scope.checkSession();

$scope.logOut = function(){
localStorage.deleteAll('User');
localStorage.deleteAll('cart');
setTimeout(function(){
  $window.location = "index.html";
}, 300);


}
}]);



//Controllers for Product PAGE
app.controller('showProducts',['$scope','$http','$window','$location','$rootScope','$routeParams','$route','localStorage','updateCart',function($scope,$http,$window,$location,$rootScope,$routeParams,$route,localStorage,updateCart){
$rootScope.isHome = false;

$scope.searchPressed = function(){
$window.location = "#product/search="+$scope.searchQuery;
$scope.searchQuery = "";
}

$scope.reloadData = function(){
  $route.reload();
}

  $scope.firstRequest = true;
  $scope.firstRequestCompanies = [];
  $scope.firstRequestSizes = [];
  $scope.filters = {};
  $scope.filters.sizes = [];
  $scope.filters.materials = [];
  $scope.filters.discount = [];
  $scope.filters.price = [];
  $scope.filters.companies = [];



  $http.defaults.headers.common = {'access_code':'onyourown'};
  updateCart.update();
  var skip = 0;
  $scope.products={fields:[]};
  $scope.filterRequest = false;
  $scope.companyFilterRequest = false;
  $scope.priceFilterRequest = false;
  $scope.sizeFilterRequest = false;
  $scope.discountFilterRequest = false;
  $scope.filterData = {};
  $scope.filters.searchQuery = false;

  $scope.getProducts = function(){
  //var category = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('category').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  var response;
  // if($scope.filterRequest == false){
  //   $scope.filters = {};
  // }
  if($scope.priceFilterRequest != true){
    $scope.filters.price = [];
    $scope.price1 = false;
    $scope.price2 = false;
    $scope.price3 = false;
    $scope.price4 = false;
  }

var category;
if($routeParams.category != undefined && $routeParams.category.includes("search=")){
  $scope.filters.searchQuery = true;
  var searchInput = $routeParams.category.split("=");
  category = searchInput[1];

  if(category.length < 3){
    $window.location = "#error204";
    return;
  }
  console.log("category search"+$routeParams.category);
}else{
  $scope.filters.searchQuery = false;
  category = $routeParams.category;
}
$http({

         method : 'POST',
         url : 'http://localhost:3000/api/Products/showProducts?category='+category,
         headers: {'Content-Type': 'application/json',
                    'skip': skip,
                    'realm': 'web'},
        data: $scope.filters

     }).
     success(function(data,status,headers,config){
       console.log(JSON.stringify(data));
       response = JSON.stringify(data.response.products).slice(1,JSON.stringify(data.response.products).length-1);
       skip = skip + 52;

       if($scope.firstRequest == true){
         $scope.firstRequestCompanies = data.response.filterData.companies;
         $scope.firstRequestSizes = data.response.filterData.sizes;
         $scope.firstRequest = false;
       }

       if(data.response.products.length > 0){
         if(data.response.products.length < 52){
           document.getElementById("viewMore").style.display = "none";

         }

         for(i=0;i<data.response.products.length;i++){
            data.response.products[i].PRupee1 = convertToRupee(data.response.products[i].PPrice1);
            if(data.response.products[i].PDiscountPrice1 != undefined && data.response.products[i].PDiscountPrice1 != ''){
             data.response.products[i].PDiscountRupee1 = convertToRupee(data.response.products[i].PDiscountPrice1);
            }
            if(data.response.products[i].PPrice2 != undefined && data.response.products[i].PPrice2 != ''){
             data.response.products[i].PRupee2 = convertToRupee(data.response.products[i].PPrice2);
            }
            if(data.response.products[i].PDiscountPrice2 != undefined && data.response.products[i].PDiscountPrice2 != ''){
              data.response.products[i].PDiscountRupee2 = convertToRupee(data.response.products[i].PDiscountPrice2);
            }

            if(data.response.products[i].PPrice3 != undefined && data.response.products[i].PPrice3 != ''){
             data.response.products[i].PRupee3 = convertToRupee(data.response.products[i].PPrice3);
            }
            if(data.response.products[i].PDiscountPrice3 != undefined && data.response.products[i].PDiscountPrice3 != ''){
              data.response.products[i].PDiscountRupee3 = convertToRupee(data.response.products[i].PDiscountPrice3);
            }

            if(data.response.products[i].PPrice4 != undefined && data.response.products[i].PPrice4 != ''){
             data.response.products[i].PRupee4 = convertToRupee(data.response.products[i].PPrice4);
            }
            if(data.response.products[i].PDiscountPrice4 != undefined && data.response.products[i].PDiscountPrice4 != ''){
              data.response.products[i].PDiscountRupee4 = convertToRupee(data.response.products[i].PDiscountPrice4);
            }

         }
//$scope.products.fields.push(JSON.stringify(data.response.products).slice(1,JSON.stringify(data.response.products).length-1));

         if(skip == 52){
           $scope.products.fields =[];
         }
         $scope.products.fields.push(data.response.products);

        //  if($scope.companyFilterRequest != true){
           if($scope.filters.price.length == 0 && $scope.filters.sizes.length == 0 && $scope.filters.materials.length == 0 && $scope.filters.discount.length == 0){
             $scope.filterData.companies = $scope.firstRequestCompanies;
           }else{
          $scope.filterData.companies = data.response.filterData.companies;
          for(var j =0; j < $scope.filterData.companies.length; j++){
            $scope.filterData.companies[j].checked = false;
          }
            }
        //  }else{
        //    $scope.filterData.companies = data.response.filterData.companies;
        //  }

        if($scope.priceFilterRequest != true){
          $scope.filterData.price = data.response.filterData.price;

        }

        if($scope.discountFilterRequest != true){
          $scope.filterData.discount = data.response.filterData.discount;
          $scope.discountCheck1 = false;
          $scope.discountCheck2 = false;
          $scope.discountCheck3 = false;
          $scope.discountCheck4 = false;
          if($scope.filterData.discount.discountFilter){
          for(var j=0; j<$scope.filters.discount.length; j++){

            if($scope.filterData.discount.discount1 != undefined && $scope.filterData.discount.discount1  == $scope.filters.discount[j] + 1){
              $scope.discountCheck1 = true;
            }
            if($scope.filterData.discount.discount2 != undefined && $scope.filterData.discount.discount2  == $scope.filters.discount[j] + 1){
              $scope.discountCheck2 = true;
            }
            if($scope.filterData.discount.discount3 != undefined && $scope.filterData.discount.discount3 == $scope.filters.discount[j] + 1){
              $scope.discountCheck3 = true;
            }
            if($scope.filterData.discount.discount4 != undefined && $scope.filterData.discount.discount4 == $scope.filters.discount[j] +1){
              $scope.discountCheck4 = true;
            }
          }
        }


        }else{
          $scope.discountFilterRequest = false;
        }

        // if($scope.sizeFilterRequest != true){
          if($scope.filters.price.length == 0 && $scope.filters.companies.length == 0 && $scope.filters.materials.length == 0 && $scope.filters.discount.length == 0){
            $scope.filterData.sizes = $scope.firstRequestSizes;
          }else{
          $scope.filterData.sizes = data.response.filterData.sizes;
          for(var j =0; j < $scope.filterData.sizes.length; j++){
            $scope.filterData.sizes[j].checked = false;
          }
            }
        // }else{
        //   $scope.filterData.sizes = $scope.firstRequestSizes;
        // }


        $scope.filterData.materials = data.response.filterData.materials;



        $scope.companyFilterRequest = false;
        $scope.priceFilterRequest = false;
        $scope.sizeFilterRequest = false;
          markFilters();

     }else{
       if(document.getElementById("viewMore") != undefined){
          document.getElementById("viewMore").style.display = "none";
          markFilters();
        }
        if(skip == 52){
          $scope.products.fields = [];
          $window.location = "#error204";
          skip = 0;
        }
     }
          return;

     })
.error(function(data,status,headers,config){

  document.getElementById("loginResponse").innerHTML = "<span style='color:red'>"+data.error.message;
  return;
});
}

 function markFilters(){
   if($scope.filters.companies === undefined){
     $scope.filters.companies = [];
   }
   for(var i =0 ; i < $scope.filters.companies.length; i++){
     for(var j = 0; j < $scope.filterData.companies.length; j++){
       if($scope.filters.companies[i] == $scope.filterData.companies[j].company){
         $scope.filterData.companies[j].checked = true;
       }
     }
   }

   if($scope.filters.sizes.length != 0){
     for(var i = 0; i < $scope.filters.sizes.length; i++){
       for(var j = 0; j < $scope.filterData.sizes.length; j++){
         if($scope.filters.sizes[i] == $scope.filterData.sizes[j].size){
           $scope.filterData.sizes[j].checked = true;
         }
       }
     }
   }

   if($scope.filters.materials.length != 0){
     for(var i = 0; i <$scope.filters.materials.length; i++){
       for(var j = 0; j < $scope.filterData.materials.length; j++){
         if($scope.filters.materials[i] == $scope.filterData.materials[j].material){
           $scope.filterData.materials[j].checked = true;
         }
       }
     }
   }

}

$scope.companyFilter = function(company){
  $scope.filterRequest = true;
  $scope.companyFilterRequest = true;
  skip = 0;

  if(company.checked){
    if($scope.filters.companies === undefined){
      $scope.filters.companies = [];
    }
      $scope.filters.companies.push(company.company);


  }else{
    company.checked = false;
    var companies = $scope.filters.companies;
    for(var i=0; i < companies.length; i++){
      if(companies[i] == company.company){
        $scope.filters.companies.splice(i,1);
      }
    }
  }

  $scope.getProducts();
}

$scope.priceFilter = function(checked,range1,range2){
  $scope.filterRequest = true;
  $scope.priceFilterRequest = true;
  skip = 0;

  if(checked){
    if($scope.filters.price === undefined){
      $scope.filters.price = [];
      }
      var priceFilter = {};
      priceFilter.range1 = range1-1;
      priceFilter.range2 = range2+1;
      $scope.filters.price.push(priceFilter);
  }else{
    var priceRange = $scope.filters.price;
    for(var i=0; i < priceRange.length; i++){
      if(priceRange[i].range1 == range1-1 && priceRange[i].range2 == range2+1){
        $scope.filters.price.splice(i,1);
      }

    }
  }

  $scope.getProducts();
}

$scope.sizeFilter = function(sizeObject){
  $scope.filterRequest = true;
  $scope.sizeFilterRequest = true;
  skip = 0;

  if(sizeObject.checked){
    $scope.filters.sizes.push(sizeObject.size);

  }else{
    var previousSizes = $scope.filters.sizes;
    for(var j = 0; j < previousSizes.length; j ++){
      if(previousSizes[j] == sizeObject.size){
        $scope.filters.sizes.splice(j,1);
      }
    }
  }
  $scope.getProducts();
}

$scope.materialFilter = function(material){
  $scope.filterRequest = true;
  skip = 0;

  if(material.checked){
    $scope.filters.materials.push(material.material);
  }else{
    var previousMaterials = $scope.filters.materials;
    for(var j = 0; j < previousMaterials.length; j++){
      if(previousMaterials[j] == material.material){
        $scope.filters.materials.splice(j,1);
      }
    }
  }

  $scope.getProducts();
}

$scope.discountFilter = function(discountCheck, discount){
  $scope.filterRequest = true;
  $scope.discountFilterRequest = true;
  skip = 0;

  if(discountCheck){
    $scope.filters.discount.push(discount - 1);

  }else{
    var previousDiscounts = $scope.filters.discount;
    for(var j = 0; j < previousDiscounts.length; j++){
      if(previousDiscounts[j] == discount-1){
        $scope.filters.discount.splice(j,1);
      }
    }
  }
  $scope.getProducts();
}

if($routeParams.category != undefined){
$scope.getProducts();
}

$scope.setModalData = function(prod){
  if(document.getElementById("quantValue1") != undefined){
    document.getElementById("quantValue1").value=0;
  }
  if(document.getElementById("quantValue2") != undefined){
    document.getElementById("quantValue2").value=0;
  }
  if(document.getElementById("quantValue3") != undefined){
    document.getElementById("quantValue3").value=0;
  }
  if(document.getElementById("quantValue4") != undefined){
    document.getElementById("quantValue4").value=0;
  }
  document.getElementById("addCartError").innerHTML = "";


  $scope.modalData = prod;
  //console.log("modalData--->"+JSON.stringify($scope.modalData));
}



$scope.addToCart = function(prod){
//  console.log("addtocart--"+angular.toJson(prod));
  var cart;
  // if(localStorage.getData('cart') != undefined){
  //   cart = localStorage.getData('cart');
  // }
  // console.log("cart--"+ cart);
  // if(cart != undefined){
  //   cart.push(prod);
  // }else {
  //   cart = prod;
  // }
  var order1 = 0;
  var order2 = 0;
  var order3 = 0;
  var order4 = 0;

  if(document.getElementById("quantValue1") != undefined){
    order1 = Number(document.getElementById("quantValue1").value);
  }
  if(document.getElementById("quantValue2") != undefined){
    order2 = Number(document.getElementById("quantValue2").value);
  }
  if(document.getElementById("quantValue3") != undefined){
    order3 = Number(document.getElementById("quantValue3").value);
  }
  if(document.getElementById("quantValue4") != undefined){
    order4 = Number(document.getElementById("quantValue4").value);
  }

  if(order1 == 0 && order2 == 0 && order3 == 0 && order4 == 0){
    document.getElementById("addCartError").innerHTML = "Select Quantity of Product";
    return;
  }

  if(order1 != 0 && (order1 < prod.PQuantityMin1 || order1 > prod.PQuantityMax1)){
    document.getElementById("addCartError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }
  if(order2 != 0 && (order2 < prod.PQuantityMin2 || order2 > prod.PQuantityMax2)){
    document.getElementById("addCartError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }
  if(order3 != 0 && (order3 < prod.PQuantityMin3 || order3 > prod.PQuantityMax3)){
    document.getElementById("addCartError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }
  if(order4 != 0 && (order4 < prod.PQuantityMin4 || order4 > prod.PQuantityMax4)){
    document.getElementById("addCartError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }

  var cartItem = {};

  cartItem.POrderQuant1 = order1;
  cartItem.POrderQuant2 = order2;
  cartItem.POrderQuant3 = order3;
  cartItem.POrderQuant4 = order4;
  cartItem.PProduct = prod;
  cartItem.PCode = prod.PCode;

  //console.log("cart product--"+JSON.stringify(cartItem.PProduct));


  //console.log(JSON.stringify(cartItem));
  var session = localStorage.getData('User');

  if(session){

  //$http.defaults.headers.common = {'access_code':'onyourown'};
  // $http.defaults.headers.common = {'token' : session.token};
  // $http.defaults.headers.common = {'email' : session.email};
session = JSON.parse(session);

  $http({


           method : 'POST',
           url : 'http://localhost:3000/api/Clients/addToCart',
           headers: {'Content-Type': 'application/json',
                      'token' : session.token,
                      'email' : session.email,
                      'realm': 'web'},
           data : cartItem
       }).
       success(function(data,status,headers,config){
        localStorage.saveData('cart', data.response);
        updateCart.update();
        document.getElementById("addCartError").innerHTML = "Product added to cart Successfully.";
        $.notify({
          // options
          message: 'Product '+cartItem.PProduct.PName+' added to the cart.'
        },{
          // settings
          type: "success",
          newest_on_top: false,
           placement: {
               from: "top",
               align: "right"
                },

            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
                 }
        });

       })
  .error(function(data,status,headers,config){
    document.getElementById("addCartError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
    $.notify({
      // options
      message: 'Issue in removing product '+cartItem.PProduct.PName+' from the cart.'
    },{
      // settings
      type: "danger",
      newest_on_top: false,
       placement: {
           from: "top",
           align: "right"
            },
       offset: {
                x: 100,
                  y: 200
                },
        spacing: 10,
        z_index: 103,
        delay: 900,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
             }
    });
    return;
});

}else{
  localStorage.saveData('cart', cartItem);
  updateCart.update();
  document.getElementById("addCartError").innerHTML = "Product added to cart Successfully.";
  $.notify({
    // options
    message: 'Product '+cartItem.PProduct.PName+' added to the cart.'
  },{
    // settings
    type: "success",
    newest_on_top: false,
     placement: {
         from: "top",
         align: "right"
          },

      animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
           }
  });

}


}
}]);

app.controller('productDetails',['$scope','$http','$window','$location','$routeParams','$rootScope','localStorage','updateCart',function($scope,$http,$window,$location,$routeParams,$rootScope,localStorage,updateCart){
  $http.defaults.headers.common = {'access_code':'onyourown'};
  updateCart.update();
  $rootScope.isHome = false;

  var code = $routeParams.code; //decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('id').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

$http({

         method : 'GET',
         url : 'http://localhost:3000/api/Products/productDetails',
         headers: {'Content-Type': 'application/json',
                    'realm': 'web',
                     'code': code},

     }).
     success(function(data,status,headers,config){

       if(status == 204){
         $scope.productDetailResponse = "Product not found.";
       }else{
       $scope.prodDetailData = data.response;
       //console.log($scope.prodDetailData);
          return;

}
     })
.error(function(data,status,headers,config){

  $scope.productDetailResponse  = data.error.message;
  return;
});



$scope.addToCart = function(prod){

  var cart;

  var order1 = 0;
  var order2 = 0;
  var order3 = 0;
  var order4 = 0;

  if(document.getElementById("quantValue1") != undefined){
    order1 = Number(document.getElementById("quantValue1").value);
  }
  if(document.getElementById("quantValue2") != undefined){
    order2 = Number(document.getElementById("quantValue2").value);
  }
  if(document.getElementById("quantValue3") != undefined){
    order3 = Number(document.getElementById("quantValue3").value);
  }
  if(document.getElementById("quantValue4") != undefined){
    order4 = Number(document.getElementById("quantValue4").value);
  }

  if(order1 == 0 && order2 == 0 && order3 == 0 && order4 == 0){
    document.getElementById("prodDetailError").innerHTML = "Select Quantity of Product";
    return;
  }

  if(order1 != 0 && (order1 < prod.PQuantityMin1 || order1 > prod.PQuantityMax1)){
    document.getElementById("prodDetailError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }
  if(order2 != 0 && (order2 < prod.PQuantityMin2 || order2 > prod.PQuantityMax2)){
    document.getElementById("prodDetailError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }
  if(order3 != 0 && (order3 < prod.PQuantityMin3 || order3 > prod.PQuantityMax3)){
    document.getElementById("prodDetailError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }
  if(order4 != 0 && (order4 < prod.PQuantityMin4 || order4 > prod.PQuantityMax4)){
    document.getElementById("prodDetailError").innerHTML = "Select Quantity between Min-Max of Product Size";
    return;

  }

  var cartItem = {};

  cartItem.POrderQuant1 = order1;
  cartItem.POrderQuant2 = order2;
  cartItem.POrderQuant3 = order3;
  cartItem.POrderQuant4 = order4;
  cartItem.PProduct = prod;
  cartItem.PCode = prod.PCode;

  //console.log("cart product--"+cartItem.PProduct);


  //console.log(JSON.stringify(cartItem));
  var session = localStorage.getData('User');

  if(session){
session = JSON.parse(session);


  $http({


           method : 'POST',
           url : 'http://localhost:3000/api/Clients/addToCart',
           headers: {'Content-Type': 'application/json',
                      'token' : session.token,
                      'email' : session.email,
                      'realm': 'web'},
           data : cartItem
       }).
       success(function(data,status,headers,config){
      //  console.log("data---"+JSON.stringify(data.response));
        localStorage.saveData('cart', data.response);
        updateCart.update();
        document.getElementById("prodDetailError").innerHTML = "Product added to cart Successfully.";
        $.notify({
          // options
          message: 'Product '+cartItem.PProduct.PName+' added to the cart.'
        },{
          // settings
          type: "success",
          newest_on_top: false,
           placement: {
               from: "top",
               align: "right"
                },

            animate: {
                enter: 'animated fadeInDown',
                exit: 'animated fadeOutUp'
                 }
        });


       })
  .error(function(data,status,headers,config){
    document.getElementById("prodDetailError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
    $.notify({
      // options
      message: 'Issue in removing product '+cartItem.PProduct.PName+' from the cart.'
    },{
      // settings
      type: "danger",
      newest_on_top: false,
       placement: {
           from: "top",
           align: "right"
            },
       offset: {
                x: 100,
                  y: 200
                },
        spacing: 10,
        z_index: 103,
        delay: 900,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
             }
    });
    return;
});

}else{
  localStorage.saveData('cart', cartItem);
  updateCart.update();
  document.getElementById("prodDetailError").innerHTML = "Product added to cart Successfully.";
  $.notify({
    // options
    message: 'Product '+cartItem.PProduct.PName+' added to the cart.'
  },{
    // settings
    type: "success",
    newest_on_top: false,
     placement: {
         from: "top",
         align: "right"
          },

      animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
           }
  });

}
  //console.log(localStorage.getData('cart'));


}
}]);

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}




/* cart controllers */

app.controller('showCartItems',['$http','$scope','$window','localStorage','$rootScope','updateCart', function($http, $scope, $window, localStorage,$rootScope, updateCart){
//console.log("into cart");
$http.defaults.headers.common = {'access_code':'onyourown'};
$rootScope.isHome = false;

$scope.cartTotal = 0;
$scope.cartCount = 0;
var session = localStorage.getData('User');
if(session){
  session = JSON.parse(session);
  var token = session.token;

$http({


         method : 'GET',
         url : 'http://localhost:3000/api/Clients/showCart?token='+token,
         headers: {'Content-Type': 'application/json',
                    'realm': 'web'}

     }).
     success(function(data,status,headers,config){
    var cartItems = data.response.CartItems;
    localStorage.deleteAll('cart');

    for(var i = 0; i<cartItems.length; i++){
        localStorage.saveData('cart',data.response.CartItems[i]);
    }
    updateCart.update();
    manageCart();

    //  document.getElementById("prodDetailError").innerHTML = "Product added to cart Successfully.";


     })
.error(function(data,status,headers,config){
  alert("error");
  //document.getElementById("prodDetailError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
  return;
});

}else{
  updateCart.update();
  manageCart();

}





function manageCart(){
  $scope.cartTotal = 0;
  $scope.cartCount = 0;
if(localStorage.getData('cart') != undefined){
  $scope.items = localStorage.getData('cart');
  $scope.cartCount = $scope.items.length;
}else{
  $scope.cartCount = 0;
}
  $scope.bag = {};
  $scope.bag.withoutDiscount = 0;

  $scope.bag.discount = 0;
  $scope.bag.deliveryCharge = 99;
  $scope.bag.orderTotal = 0;
  $scope.bag.VAT = 0;


for(i=0; i<$scope.cartCount; i++){
  //console.log("Product"+JSON.stringify($scope.items[i]));
  var total = 0;
  var innerHtml = "";
  $scope.items[i].withoutDiscount = 0;
  if(parseInt($scope.items[i].POrderQuant1) > 0){
    $scope.items[i].withoutDiscount = parseInt($scope.items[i].POrderQuant1) * parseInt($scope.items[i].PProduct.PPrice1);
    if($scope.items[i].PProduct.PDiscountPrice1){
        total = total + (parseInt($scope.items[i].POrderQuant1) * parseInt($scope.items[i].PProduct.PDiscountPrice1));
          $scope.items[i].PPriceTotal1 = parseInt($scope.items[i].POrderQuant1) * parseInt($scope.items[i].PProduct.PDiscountPrice1);
          $scope.items[i].PRupeeTotal1 = convertToRupee($scope.items[i].PPriceTotal1);

  }else{
        total = total + (parseInt($scope.items[i].POrderQuant1) * parseInt($scope.items[i].PProduct.PPrice1));
          $scope.items[i].PPriceTotal1 = parseInt($scope.items[i].POrderQuant1) * parseInt($scope.items[i].PProduct.PPrice1);
          $scope.items[i].PRupeeTotal1 = convertToRupee($scope.items[i].PPriceTotal1);

  }
  }
  if(parseInt($scope.items[i].POrderQuant2) > 0){
    $scope.items[i].withoutDiscount += parseInt($scope.items[i].POrderQuant2) * parseInt($scope.items[i].PProduct.PPrice2);
    if($scope.items[i].PProduct.PDiscountPrice2){
        total = total + (parseInt($scope.items[i].POrderQuant2) * parseInt($scope.items[i].PProduct.PDiscountPrice2));
          $scope.items[i].PPriceTotal2 = parseInt($scope.items[i].POrderQuant2) * parseInt($scope.items[i].PProduct.PDiscountPrice2);
          $scope.items[i].PRupeeTotal2 = convertToRupee($scope.items[i].PPriceTotal2);
    }else{
        total = total + (parseInt($scope.items[i].POrderQuant2) * parseInt($scope.items[i].PProduct.PPrice2));
          $scope.items[i].PPriceTotal2 = parseInt($scope.items[i].POrderQuant2) * parseInt($scope.items[i].PProduct.PPrice2);
          $scope.items[i].PRupeeTotal2 = convertToRupee($scope.items[i].PPriceTotal2);

    }
  }
  if(parseInt($scope.items[i].POrderQuant3) > 0){
    $scope.items[i].withoutDiscount += parseInt($scope.items[i].POrderQuant3) * parseInt($scope.items[i].PProduct.PPrice3);
      if($scope.items[i].PProduct.PDiscountPrice3){
          total = total + (parseInt($scope.items[i].POrderQuant3) * parseInt($scope.items[i].PProduct.PDiscountPrice3));
          $scope.items[i].PPriceTotal3 = parseInt($scope.items[i].POrderQuant3) * parseInt($scope.items[i].PProduct.PDiscountPrice3);
          $scope.items[i].PRupeeTotal3 = convertToRupee($scope.items[i].PPriceTotal3);
    }else{
          total = total + (parseInt($scope.items[i].POrderQuant3) * parseInt($scope.items[i].PProduct.PPrice3));
          $scope.items[i].PPriceTotal3 = parseInt($scope.items[i].POrderQuant3) * parseInt($scope.items[i].PProduct.PPrice3);
          $scope.items[i].PRupeeTotal3 = convertToRupee($scope.items[i].PPriceTotal3);

    }
  }
  if(parseInt($scope.items[i].POrderQuant4) > 0){
    $scope.items[i].withoutDiscount += parseInt($scope.items[i].POrderQuant4) * parseInt($scope.items[i].PProduct.PPrice4);
    if($scope.items[i].PProduct.PDiscountPrice4){
          total = total + (parseInt($scope.items[i].POrderQuant4) * parseInt($scope.items[i].PProduct.PDiscountPrice4));
          $scope.items[i].PPriceTotal4 = parseInt($scope.items[i].POrderQuant4) * parseInt($scope.items[i].PProduct.PDiscountPrice4);
          $scope.items[i].PRupeeTotal4 = convertToRupee($scope.items[i].PPriceTotal4);
    }else{
          total = total + (parseInt($scope.items[i].POrderQuant4) * parseInt($scope.items[i].PProduct.PPrice4));
          $scope.items[i].PPriceTotal4 = parseInt($scope.items[i].POrderQuant4) * parseInt($scope.items[i].PProduct.PPrice4);
          $scope.items[i].PRupeeTotal4 = convertToRupee($scope.items[i].PPriceTotal4);

    }
  }
  $scope.bag.withoutDiscount = $scope.bag.withoutDiscount + $scope.items[i].withoutDiscount;
  $scope.items[i].withoutDiscount = convertToRupee($scope.items[i].withoutDiscount);
  $scope.items[i].PPriceTotalAll = convertToRupee(total);
  $scope.cartTotal = $scope.cartTotal + total;
}
$scope.bag.discount = $scope.bag.withoutDiscount - $scope.cartTotal;
$scope.cartRupeeTotal = convertToRupee($scope.cartTotal);
$scope.bag.VAT = 0.28 * ($scope.bag.withoutDiscount - $scope.bag.discount);
var vatAmountArray = String($scope.bag.VAT).split('.');
console.log(parseInt($scope.bag.VAT));
// if(vatAmountArray[1].length > 0 && parseInt(vatAmountArray[1]) != 0){
// $scope.bag.VAT = vatAmountArray[0] +'.'+ vatAmountArray[1].substr(0,2);
// }else{
//   $scope.bag.VAT = vatAmountArray[0];
// }

$scope.bag.withoutDiscount = convertToRupee($scope.bag.withoutDiscount);
$scope.bag.orderTotal = convertToRupee($scope.cartTotal + $scope.bag.deliveryCharge + $scope.bag.VAT);
$scope.bag.VAT = convertToRupee(parseInt($scope.bag.VAT));
}


$scope.removeFromCart = function(item){
console.log("item to remove"+JSON.stringify(item));
  var session = localStorage.getData('User');

  if(session){

session = JSON.parse(session);


  $http({


           method : 'DELETE',
           url : 'http://localhost:3000/api/Clients/removeFromCart',
           headers: {'Content-Type': 'application/json',
                      'token' : session.token,
                      'email' : session.email,
                      'realm': 'web'},
           data : item
       }).
       success(function(data,status,headers,config){
        $.notify({
        	// options
        	message: 'Product '+item.PProduct.PName+' Removed from the cart.'
        },{
        	// settings
          type: "success",
          newest_on_top: false,
	         placement: {
		           from: "top",
		           align: "right"
	              },
           offset: {
		                x: 100,
		                y: 200
	                  },
	          spacing: 10,
	          z_index: 103,
	          delay: 1000,
	          timer: 1000,
	          url_target: '_blank',
	          mouse_over: null,
	          animate: {
		            enter: 'animated fadeInDown',
		            exit: 'animated fadeOutUp'
	               }
        });
   localStorage.deleteData('cart', item);
   $scope.items = localStorage.getData('cart');
   manageCart();
   updateCart.update();
       })
  .error(function(data,status,headers,config){
    $.notify({
      // options
      message: 'Issue in removing product '+item.PProduct.PName+' from the cart.'
    },{
      // settings
      type: "danger",
      newest_on_top: false,
       placement: {
           from: "top",
           align: "right"
            },
       offset: {
                x: 100,
                  y: 200
                },
        spacing: 10,
        z_index: 103,
        delay: 900,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
             }
    });
    return;
});

}else{
  $.notify({
    // options
    message: 'Product '+item.PProduct.PName+' Removed from the cart.'
  },{
    // settings
    type: "success",
    newest_on_top: false,
     placement: {
         from: "top",
           align: "right"
          },
     offset: {
              x: 100,
                y: 200
              },
      spacing: 10,
      z_index: 103,
      delay: 900,
      timer: 1000,
      url_target: '_blank',
      mouse_over: null,
      animate: {
          enter: 'animated fadeInDown',
          exit: 'animated fadeOutUp'
           }
  });
  localStorage.deleteData('cart', item);
  $scope.items = localStorage.getData('cart');
  manageCart();
  updateCart.update();
}

}

$scope.placeOrder = function(){
console.log(JSON.stringify($scope.items));
  $http({

           method : 'POST',
           url : 'http://localhost:3000/api/Orders/placeOrder',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web'},
           data: $scope.items


       }).
       success(function(data,status,headers,config){

         if(status == 204){
           $scope.productDetailResponse = "Product not found.";
         }else{
         $scope.prodDetailData = data.response;
         //console.log($scope.prodDetailData);
            return;

  }
       })
  .error(function(data,status,headers,config){

    $scope.productDetailResponse  = data.error.message;
    return;
  });
}
}]);



app.controller('homeData',['$http','$scope','$window','$rootScope','localStorage','updateCart', function($http, $scope, $window, $rootScope, localStorage, updateCart){
  $rootScope.isHome = true;
  $scope.tempData  = '';
  $http({


           method : 'GET',
           url : 'http://localhost:3000/api/HomeTemplates/getTempData',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web'}

       }).
       success(function(data,status,headers,config){
       console.log(JSON.stringify(data.response));
       $scope.tempData = data.response;
       $(document).ready(function(){
       $('.product-slider').slick({
         slidesToShow: 3,
         slidesToScroll: 1,
         autoplay: true,
         autoplaySpeed: 2000,
         arrow:true,
         });

        //  $('.category-slider').slick({
        //    slidesToShow: 3,
        //    slidesToScroll: 1,
        //    autoplay: true,
        //    autoplaySpeed: 2000,
        //    arrow:true,
        //    });
       });

console.log($scope.tempData.Sec2PCode1);
       })
  .error(function(data,status,headers,config){
    $window.location = "#error500";
    return;
  });



}]);
