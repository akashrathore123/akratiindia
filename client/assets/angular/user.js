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
  });
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
        items.pop(data);
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
     if(localStorage.getData('cart') != undefined && localStorage.getData('cart') != "")
     document.getElementById("cartValue").innerHTML = localStorage.getData('cart').length;
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

                console.log(data.response.client_token);
                var Akratiindia = '{\"token\" :\"'+ data.response.client_token+'\", \"mobile\" : \"'+data.response.client_mobile+'\", \"email\" :\"'+ data.response.client_email+'\" , \"fname\" :\"'+ data.response.client_fname+'\", \"lname\" :\"'+ data.response.client_lname+'\"}';
                localStorage.saveData('User', Akratiindia);
                console.log('cookies'+Akratiindia);
                document.cookie = Akratiindia;

              //  $document.cookie = "token="+data.response.client_token;


                $window.location = "index.html";



                return;

           })
           .error(function(data,status,headers,config){

        document.getElementById("registerButton").disabled = false;
        console.log(data);
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
    console.log("checking session");
 var session = localStorage.getData('User');
 console.log("session--"+JSON.stringify(session));
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
    console.log("session not exist");
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
app.controller('showProducts',['$scope','$http','$window','$location','$routeParams','localStorage','updateCart',function($scope,$http,$window,$location,$routeParams,localStorage,updateCart){
  $http.defaults.headers.common = {'access_code':'onyourown'};
  updateCart.update();
  var skip = 0;
  $scope.products={fields:[]};
  $scope.getProducts = function(){
  //var category = decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('category').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
var response;
$http({

         method : 'GET',
         url : 'http://localhost:3000/api/Products/showProducts?category='+$routeParams.category,
         headers: {'Content-Type': 'application/json',
                    'skip': skip,
                    'realm': 'web'},

     }).
     success(function(data,status,headers,config){
       response = JSON.stringify(data.products).slice(1,JSON.stringify(data.products).length-1);
       skip = skip + 52;
       if(data.products.length > 0){
         if(data.products.length < 52){
           document.getElementById("viewMore").style.display = "none";

         }
         for(i=0;i<data.products.length;i++){
            data.products[i].PRupee1 = convertToRupee(data.products[i].PPrice1);
            if(data.products[i].PDiscountPrice1 != undefined && data.products[i].PDiscountPrice1 != ''){
             data.products[i].PDiscountRupee1 = convertToRupee(data.products[i].PDiscountPrice1);
            }
            if(data.products[i].PPrice2 != undefined && data.products[i].PPrice2 != ''){
             data.products[i].PRupee2 = convertToRupee(data.products[i].PPrice2);
            }
            if(data.products[i].PDiscountPrice2 != undefined && data.products[i].PDiscountPrice2 != ''){
              data.products[i].PDiscountRupee2 = convertToRupee(data.products[i].PDiscountPrice2);
            }

            if(data.products[i].PPrice3 != undefined && data.products[i].PPrice3 != ''){
             data.products[i].PRupee3 = convertToRupee(data.products[i].PPrice3);
            }
            if(data.products[i].PDiscountPrice3 != undefined && data.products[i].PDiscountPrice3 != ''){
              data.products[i].PDiscountRupee3 = convertToRupee(data.products[i].PDiscountPrice3);
            }

            if(data.products[i].PPrice4 != undefined && data.products[i].PPrice4 != ''){
             data.products[i].PRupee4 = convertToRupee(data.products[i].PPrice4);
            }
            if(data.products[i].PDiscountPrice4 != undefined && data.products[i].PDiscountPrice4 != ''){
              data.products[i].PDiscountRupee4 = convertToRupee(data.products[i].PDiscountPrice4);
            }

         }
         $scope.products.fields.push(data.products);

     }else{
       document.getElementById("viewMore").style.display = "none";
     }
          return;

     })
.error(function(data,status,headers,config){

  document.getElementById("loginResponse").innerHTML = "<span style='color:red'>"+data.error.message;
  return;
});
}
  $scope.getProducts();


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
  console.log("modalData--->"+JSON.stringify($scope.modalData));
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

  console.log("cart product--"+JSON.stringify(cartItem.PProduct));


  //console.log(JSON.stringify(cartItem));
  var session = localStorage.getData('User');

  if(session){

  //$http.defaults.headers.common = {'access_code':'onyourown'};
  // $http.defaults.headers.common = {'token' : session.token};
  // $http.defaults.headers.common = {'email' : session.email};

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


       })
  .error(function(data,status,headers,config){
    document.getElementById("addCartError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
    return;
});

}else{
  localStorage.saveData('cart', cartItem);
  updateCart.update();
  document.getElementById("addCartError").innerHTML = "Product added to cart Successfully.";


}
  //console.log(localStorage.getData('cart'));


}
}]);

app.controller('productDetails',['$scope','$http','$window','$location','$routeParams','localStorage','updateCart',function($scope,$http,$window,$location,$routeParams,localStorage,updateCart){
  $http.defaults.headers.common = {'access_code':'onyourown'};
  updateCart.update();

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
console.log($scope.prodDetailData);
          return;

}
     })
.error(function(data,status,headers,config){

  $scope.productDetailResponse  = data.error.message;
  return;
});



$scope.addToCart = function(prod){
  console.log("add to cart--"+JSON.stringify(prod));
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

  console.log("cart product--"+cartItem.PProduct);


  //console.log(JSON.stringify(cartItem));
  var session = localStorage.getData('User');

  if(session){

  //$http.defaults.headers.common = {'access_code':'onyourown'};
  // $http.defaults.headers.common = {'token' : session.token};
  // $http.defaults.headers.common = {'email' : session.email};

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


       })
  .error(function(data,status,headers,config){
    document.getElementById("prodDetailError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
    return;
});

}else{
  localStorage.saveData('cart', cartItem);
  updateCart.update();
  document.getElementById("prodDetailError").innerHTML = "Product added to cart Successfully.";


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

app.controller('showCartItems',['$http','$scope','$window','localStorage','$localStorage','updateCart', function($http, $scope, $window, localStorage, $localStorage, updateCart){
console.log("into cart");
$scope.cartTotal = 0;
$scope.cartCount = 0;
updateCart.update();
manageCart();

function manageCart(){
  $scope.cartTotal = 0;
  $scope.cartCount = 0;
if(localStorage.getData('cart') != undefined){
  $scope.items = localStorage.getData('cart');
  $scope.cartCount = $scope.items.length;
}

for(i=0; i<$scope.cartCount; i++){
  console.log("Product"+JSON.stringify($scope.items[i]));
  var total = 0;
  var innerHtml = "";
  if(parseInt($scope.items[i].POrderQuant1) > 0){
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

  $scope.items[i].PPriceTotalAll = convertToRupee(total);
  $scope.cartTotal = $scope.cartTotal + total;
}
$scope.cartTotal = convertToRupee($scope.cartTotal);
}

$scope.removeFromCart = function(item){
  localStorage.deleteData('cart', item);
  var session = localStorage.getData('User');

  if(session){



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
        console.log("removed---"+JSON.stringify(data.response));


       })
  .error(function(data,status,headers,config){
    return;
});

  manageCart();
  // if(localStorage.getData('cart') != undefined){
  //   $scope.items = localStorage.getData('cart');
  //   $scope.cartCount = $scope.items.length;
  //   $scope.cartTotal = 0;
  //   for(i=0; i<$scope.cartCount; i++){
  //
  //     $scope.cartTotal = $scope.cartTotal + parseInt($scope.items[i].PDiscountPrice);
  //   }
  //   updateCart.update();
  // }else{
  //   $scope.cartCount = 0;
  //   $scope.cartTotal = 0;
  // }

updateCart.update();
}
}
}]);
