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
  .when('/address/:token',{
    templateUrl : 'address.html'
  })
  .when('/orderConfirmed/:orderId',{
    templateUrl : 'orderConfirmed.html'
  })
  .when('/orderFailed',{
    templateUrl : 'orderFailed.html'
  })
  .when('/aboutUs',{
    templateUrl : 'aboutUs.html'
  })
  .when('/contactUs',{
    templateUrl : 'contactUs.html'
  })
  .when('/termsConditions',{
    templateUrl : 'termsAndCond.html'
  })
  .when('/moneyBack',{
    templateUrl : 'moneyBack.html'
  })
  .when('/companyPolicy',{
    templateUrl : 'companyPolicy.html'
  })
  .when('/howWeWork',{
    templateUrl : 'howWeWork.html'
  })
  .when('/my/:category',{
    templateUrl : 'profile.html'
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

app.factory('baseAPIUrl',function(){
    //  var baseURL = "/api/";
    var baseURL = "/api/";
    return baseURL;
});

app.factory('baseUrl',function(){
    //  var URL = "/";
    var URL = "/";
    return URL;
});

app.factory('notify',function(){
  var notify = {};
  notify.showNotification = function(msg,typ){
    $.notify({
      // options
      message: msg
    },{
      // settings
      type: typ,
      newest_on_top: false,
       placement: {
           from: "top",
             align: "right"
            },
       offset: {
                x: 0,
                  y: 200
                },
        spacing: 10,
        z_index: 103,
        delay: 600,
        timer: 1000,
        url_target: '_blank',
        mouse_over: null,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
             }
    });
  }

  return notify;
});

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
      $localStorage.Akratiindia.User = data;
    }
    if(key == 'order'){
      $localStorage.Akratiindia.order = data;
    }
    if(key == 'OTP'){
      $localStorage.Akratiindia.otp = data;
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
 if(key == 'order'){
   if(dataObj.order != undefined){
     return dataObj.order;
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
      //  items.pop(data);
        $localStorage.Akratiindia.User = undefined;
      }
    }
    if(key == 'order'){
      if(dataObj.order != undefined){
         dataObj.order = undefined;
      }
    }
    if(key == 'OTP'){
      if(dataObj.otp != undefined){
         dataObj.otp = undefined;
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
    //$localStorage.$reset();


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

app.service('spinner', function(){
   this.startSpin = function(id){
     $('#body').css({ 'opacity' : 0.7 });
     var position = $(window).scrollTop()+400+'px';
     var opts = {
  lines: 13 // The number of lines to draw
, length: 0 // The length of each line
, width: 8 // The line thickness
, radius: 28 // The radius of the inner circle
, scale: 1 // Scales overall size of the spinner
, corners: 1 // Corner roundness (0..1)
, color: '#000' // #rgb or #rrggbb or array of colors
, opacity: 0 // Opacity of the lines
, rotate: 30 // The rotation offset
, direction: 1 // 1: clockwise, -1: counterclockwise
, speed: 1.2 // Rounds per second
, trail: 74 // Afterglow percentage
, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
, zIndex: 2e9 // The z-index (defaults to 2000000000)
, className: 'spinner' // The CSS class to assign to the spinner
, top: position // Top position relative to parent
, left: '50%' // Left position relative to parent
, shadow: false // Whether to render a shadow
, hwaccel: false // Whether to use hardware acceleration
, position: 'absolute' // Element positioning
}

var target = document.getElementById(id);
var spinner = new Spinner(opts).spin(target);
return spinner;
}
this.stopSpin = function(spinner){
$('#body').css({ 'opacity' : 1 });

spinner.stop();
}
});

app.service('ScrollTop',function(){
  this.scroll = function(){
  window.scrollTo(0,0);
}
});

/* Controllers for app 'main' */
app.controller('registerAction',['$scope','$http','$window','localStorage','spinner','baseAPIUrl',function($scope,$http,$window,localStorage,spinner,baseAPIUrl){
$http.defaults.headers.common = {'access_code':'onyourown'};
  $scope.userRegister = function(){
 var spinElement = spinner.startSpin('body');
  document.getElementById("registerResponse").innerHTML = "";

  var user =JSON.stringify($scope.register);

var password1 = $scope.register.password;
var password2 = $scope.register.confirmPassword;
var mobile = $scope.register.mobile;
var email = $scope.register.email;
if(!mobile || !password1 || !password2 || !email){
   document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*All fields are required.</span>";
}
if(password1 == password2){
  document.getElementById("registerButton").disabled = true;
      $http({


               method : 'POST',
               url : baseAPIUrl+'Clients/userRegister',
               headers: {'Content-Type': 'application/json',
                          'realm': 'web'},
               data : user
           }).
           success(function(data,status,headers,config){

                //console.log(data.response.client_token);

              //  console.log(data.response.otp);
                $scope.OTP = true;
                $scope.userToken = data.response.client_token;
              //  localStorage.saveData('OTP');
              //  $document.cookie = "token="+data.response.client_token;

                spinner.stopSpin(spinElement);
              //  $window.location = "index.html";



                return;

           })
           .error(function(data,status,headers,config){
             spinner.stopSpin(spinElement);
        document.getElementById("registerButton").disabled = false;
        //console.log(data);
        document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*"+data.error.message+"</span>";
    });
}else{

        document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*Password not matched</span>";
        spinner.stopSpin(spinElement);
}
  }
  $scope.submitOTP = function(){
    if(!$scope.register.otp){
      document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*Enter OTP</span>";

    }else{
    document.getElementById("otpButton").disabled = true;
    var requestData = {};
    requestData.OTP = $scope.register.otp;
    requestData.clientId = $scope.userToken;
    $http({


             method : 'POST',
             url : baseAPIUrl+'Clients/submitOTP',
             headers: {'Content-Type': 'application/json',
                        'realm': 'web'},
             data : requestData
         }).
         success(function(data,status,headers,config){
              $scope.OTP = false;
              $scope.register = {};
              //console.log(data.response.client_token);
              var Akratiindia = '{\"token\" :\"'+ data.response.client_token+'\", \"id\" :\"'+ data.response.id +'\",\"mobile\" : \"'+data.response.client_mobile+'\", \"email\" :\"'+ data.response.client_email+'\" , \"fname\" :\"'+ data.response.client_fname+'\", \"lname\" :\"'+ data.response.client_lname+'\"}';
              localStorage.saveData('User', Akratiindia);
              console.log('cookies'+Akratiindia);
              document.cookie = Akratiindia;
            //  console.log(data.response.otp);
              $scope.OTP = false;
              setTimeout(function(){
                $window.location = "index.html";
              }, 300);

              return;

         })
         .error(function(data,status,headers,config){

      document.getElementById("otpButton").disabled = false;
      //console.log(data);
      document.getElementById("registerResponse").innerHTML = "<span style='color:red'>*"+data.error.message+"</span>";
      });
    }
  }

}]);


app.controller('loginAction',['$scope', '$http', '$window', 'localStorage','spinner','baseAPIUrl', function($scope,$http,$window,localStorage,spinner,baseAPIUrl){
  $http.defaults.headers.common = {'access_code':'onyourown'};
  $scope.userLogin = function(){
    // $scope.login.email='akash@123.com';
    // $scope.login.password = 'jelvin123';
      var login =JSON.stringify($scope.login);
      var cart = localStorage.getData('cart');
      if(cart == undefined){
        cart = {};
      }

      // console.log("cart---"+JSON.stringify(cart));
      // console.log(JSON.stringify('{"data":[ {"user" :['+login + '], "cart" :'+ JSON.stringify(cart)+' }]}'));
      var sendData = ' {"user" :'+login + ', "cart" :'+ angular.toJson(cart)+'}';
      var spinElement = spinner.startSpin('body');
      $http({


               method : 'POST',
               url : baseAPIUrl+'Clients/login',
               headers: {'Content-Type': 'application/json',
                         'realm': 'web'},
               data : sendData
           }).
           success(function(data,status,headers,config){
             var loginData = data.response[0];

             var User = '{\"token\" :\"'+ loginData.client_token+'\", \"id\" :\"'+ loginData.id +'\",\"mobile\" : \"'+loginData.client_mobile+'\", \"email\" :\"'+ loginData.client_email+'\" , \"fname\" :\"'+ loginData.client_fname+'\", \"lname\" :\"'+ loginData.client_lname+'\"}';
             var cartData = loginData.CartItems;
             localStorage.deleteAll('cart');
             localStorage.deleteAll('User');
             for(i=0; i < cartData.length; i++){
               localStorage.saveData('cart', cartData[i]);

             }
            // document.getElementById("loginResponse").innerHTML = data.error.message;
             localStorage.saveData('User', User);
             setTimeout(function(){
               $window.location = "index.html";
             }, 300);

             spinner.stopSpin(spinElement);
                return;

           })
      .error(function(data,status,headers,config){
        document.getElementById("loginResponse").innerHTML = "<span style='color:red'>"+data.error.message;
        spinner.stopSpin(spinElement);
        return;
    });

  }

// $scope.logInFacebook = function(){
//   var req = new XMLHttpRequest();
//
//  $window.location = "https://www.facebook.com/v2.10/dialog/oauth?client_id=1172211706217489&redirect_uri=http://localhost:7084/";
// // Feature detection for CORS
// // if ('withCredentials' in req) {
// //     req.open('GET', 'https://www.facebook.com/v2.10/dialog/oauth?client_id=1172211706217489&redirect_uri=http://139.59.23.178/', true);
// //     // Just like regular ol' XHR
// //     req.onreadystatechange = function() {
// //         if (req.readyState === 4) {
// //             if (req.status >= 200 && req.status < 400) {
// //               console.log(JSON.stringify(req.responseText));
// //                 // JSON.parse(req.responseText) etc.
// //             } else {
// //                 // Handle error case
// //             }
// //         }
// //     };
// //     req.send();
// // }
//   $http({
//
//
//            method : 'GET',
//            url : 'https://www.facebook.com/v2.10/dialog/oauth?client_id=1172211706217489&redirect_uri=http://139.59.23.178#/',
//            header : {'Origin':'http://localhost:7084',
//                       'Access-Control-Request-Method': 'POST'}
//        }).
//        success(function(data,status,headers,config){
//          console.log(JSON.stringify(data));
//        })
//          .error(function(data,status,headers,config){
//            console.log(JSON.stringify(data));
//            console.log(status);
//
//          });
// }

}]);

app.controller('loginCheck',['$scope','$http','$window','updateCart','localStorage','$localStorage','baseAPIUrl','baseUrl', function($scope,$http,$window,updateCart,localStorage,$localStorage,baseAPIUrl,baseUrl){
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
  //   document.getElementById("userIcon").onmouseover = function(){
  //   document.getElementById("userTools").style.display = "block";
  //   };
  //   document.getElementById("userIcon").onmouseout = function(){
  //   document.getElementById("userTools").style.display = "none";
  //   };


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
$localStorage.orderAddress = undefined;
setTimeout(function(){
  $window.location = baseUrl+"index.html";
}, 300);


}
}]);



//Controllers for Product PAGE
app.controller('showProducts',['$scope','$http','$window','$location','$rootScope','$routeParams','$route','localStorage','updateCart','notify','spinner','baseAPIUrl','ScrollTop',function($scope,$http,$window,$location,$rootScope,$routeParams,$route,localStorage,updateCart,notify,spinner,baseAPIUrl,ScrollTop){
$rootScope.isHome = false;
ScrollTop.scroll();
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
  $scope.firstRequestMaterials = [];
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
  $scope.noContent = false;
  var spinElement = spinner.startSpin('body');
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
    $scope.noContent=true;
    return;
  }
//  console.log("category search"+$routeParams.category);
}else{
  $scope.filters.searchQuery = false;
  category = $routeParams.category;
}
$http({

         method : 'POST',
         url : baseAPIUrl+'Products/showProducts?category='+category,
         headers: {'Content-Type': 'application/json',
                    'skip': skip,
                    'realm': 'web'},
        data: $scope.filters

     }).
     success(function(data,status,headers,config){

       //console.log(JSON.stringify(data));
       response = JSON.stringify(data.response.products).slice(1,JSON.stringify(data.response.products).length-1);
       skip = skip + 52;

       if($scope.firstRequest == true){
         $scope.firstRequestCompanies = data.response.filterData.companies;
         $scope.firstRequestSizes = data.response.filterData.sizes;
         $scope.firstRequestMaterials = data.response.filterData.materials;
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

        if($scope.filters.price.length == 0 && $scope.filters.companies.length == 0 && $scope.filters.sizes.length == 0 && $scope.filters.discount.length == 0){
          $scope.filterData.materials = $scope.firstRequestMaterials;
        }else{
        $scope.filterData.materials = data.response.filterData.materials;
        for(var j =0; j < $scope.filterData.materials.length; j++){
          $scope.filterData.materials[j].checked = false;
        }
          }




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
          $scope.noContent = true;
          skip = 0;
        }
     }
          spinner.stopSpin(spinElement);
          return;

     })
.error(function(data,status,headers,config){
  spinner.stopSpin(spinElement);
  $window.location = "#error500";
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
      priceFilter.range1 = range1;
      priceFilter.range2 = range2;
      $scope.filters.price.push(priceFilter);
  }else{
    var priceRange = $scope.filters.price;
    for(var i=0; i < priceRange.length; i++){
      if(priceRange[i].range1 == range1 && priceRange[i].range2 == range2){
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
  document.getElementById("addCartError").innerHTML = "";
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

  if(isNaN(order1) || isNaN(order2)  || isNaN(order3) || isNaN(order4)){
    document.getElementById("addCartError").innerHTML = "Enter valid quantity of Product";
    return;
  }
  if(String(order1).includes(".") || String(order2).includes(".")  || String(order3).includes(".")  || String(order4).includes(".") ){
    document.getElementById("addCartError").innerHTML = "Enter valid quantity of Product";
    return;
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

  console.log("cart product--"+JSON.stringify(cartItem));


  //console.log(JSON.stringify(cartItem));
  var session = localStorage.getData('User');

  if(session){

  //$http.defaults.headers.common = {'access_code':'onyourown'};
  // $http.defaults.headers.common = {'token' : session.token};
  // $http.defaults.headers.common = {'email' : session.email};
session = JSON.parse(session);

  $http({


           method : 'POST',
           url : baseAPIUrl+'Clients/addToCart',
           headers: {'Content-Type': 'application/json',
                      'token' : session.token,
                      'email' : session.email,
                      'realm': 'web'},
           data : cartItem
       }).
       success(function(data,status,headers,config){
        localStorage.saveData('cart', data.response);
        updateCart.update();
        //document.getElementById("addCartError").innerHTML = "Product added to cart Successfully.";
        notify.showNotification('Product '+cartItem.PProduct.PName+' added to the cart.','success');
        $('#myModal').modal('toggle');


       })
  .error(function(data,status,headers,config){
    document.getElementById("addCartError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
    notify.showNotification('Issue in adding product '+cartItem.PProduct.PName+' to the cart.','danger')
    return;
});

}else{
  localStorage.saveData('cart', cartItem);
  updateCart.update();
  document.getElementById("addCartError").innerHTML = "Product added to cart Successfully.";
  notify.showNotification('Product '+cartItem.PProduct.PName+' added to the cart.','success');
  $('#myModal').modal('toggle');

  }
}
}]);

app.controller('productDetails',['$scope','$http','$window','$location','$routeParams','$rootScope','localStorage','updateCart','notify','spinner','baseAPIUrl','ScrollTop',function($scope,$http,$window,$location,$routeParams,$rootScope,localStorage,updateCart,notify,spinner,baseAPIUrl,ScrollTop){
  ScrollTop.scroll();
  $http.defaults.headers.common = {'access_code':'onyourown'};
  updateCart.update();
  $rootScope.isHome = false;
  var spinElement = spinner.startSpin('body');
  var code = $routeParams.code; //decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent('id').replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));

$http({

         method : 'GET',
         url : baseAPIUrl+'Products/productDetails',
         headers: {'Content-Type': 'application/json',
                    'realm': 'web',
                     'code': code},

     }).
     success(function(data,status,headers,config){

       if(status == 204){
         $scope.productDetailResponse = "Product not found.";
       }else{
       $scope.prodDetailData = data.response;
       spinner.stopSpin(spinElement);
       //console.log($scope.prodDetailData);
          return;

}
     })
.error(function(data,status,headers,config){
  spinner.stopSpin(spinElement);
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

  if(isNaN(order1) || isNaN(order2)  || isNaN(order3) || isNaN(order4)){
    document.getElementById("addCartError").innerHTML = "Enter valid quantity of Product";
    return;
  }
  if(String(order1).includes(".") || String(order2).includes(".")  || String(order3).includes(".")  || String(order4).includes(".") ){
    document.getElementById("addCartError").innerHTML = "Enter valid quantity of Product";
    return;
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
           url : baseAPIUrl+'Clients/addToCart',
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
        notify.showNotification('Product '+cartItem.PProduct.PName+' added to the cart.','success');

       })
  .error(function(data,status,headers,config){
    document.getElementById("prodDetailError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
    notify.showNotification('Issue in adding product '+cartItem.PProduct.PName+' to the cart.','danger');
    return;
});

}else{
  localStorage.saveData('cart', cartItem);
  updateCart.update();
  document.getElementById("prodDetailError").innerHTML = "Product added to cart Successfully.";
  notify.showNotification('Product '+cartItem.PProduct.PName+' added to the cart.','success');

  }

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

app.controller('showCartItems',['$http','$scope','$window','localStorage','$localStorage','$rootScope','updateCart','notify','spinner','baseAPIUrl','ScrollTop', function($http, $scope, $window, localStorage,$localStorage,$rootScope, updateCart,notify,spinner,baseAPIUrl,ScrollTop){
//console.log("into cart");
ScrollTop.scroll();
$http.defaults.headers.common = {'access_code':'onyourown'};
$rootScope.isHome = false;


$scope.cartTotal = 0;
$scope.cartCount = 0;
var spinElement = spinner.startSpin('body');
var session = localStorage.getData('User');
if(session){
  session = JSON.parse(session);
  var token = session.token;

$http({


         method : 'GET',
         url : baseAPIUrl+'Clients/showCart?token='+token,
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
    spinner.stopSpin(spinElement);
    //  document.getElementById("prodDetailError").innerHTML = "Product added to cart Successfully.";


     })
.error(function(data,status,headers,config){
    spinner.stopSpin(spinElement);
  //document.getElementById("prodDetailError").innerHTML = "<span style='color:red'>"+"Error in adding to cart.</span>";
  return;
});

}else{
  updateCart.update();
  manageCart();
  spinner.stopSpin(spinElement);
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
$scope.bag.GST = 0.28 * ($scope.bag.withoutDiscount - $scope.bag.discount);

$scope.bag.withoutDiscount = convertToRupee($scope.bag.withoutDiscount);
$scope.bag.orderTotal = convertToRupee(parseInt($scope.cartTotal + $scope.bag.deliveryCharge + $scope.bag.GST));
$scope.bag.GST = convertToRupee(parseInt($scope.bag.GST));
}


$scope.removeFromCart = function(item){
//console.log("item to remove"+JSON.stringify(item));
  var session = localStorage.getData('User');

  if(session){

session = JSON.parse(session);


  $http({


           method : 'DELETE',
           url : baseAPIUrl+'Clients/removeFromCart',
           headers: {'Content-Type': 'application/json',
                      'token' : session.token,
                      'email' : session.email,
                      'realm': 'web'},
           data : item
       }).
       success(function(data,status,headers,config){
        notify.showNotification('Product '+item.PProduct.PName+' Removed from the cart.','success');

        localStorage.deleteData('cart', item);
        $scope.items = localStorage.getData('cart');
        manageCart();
        updateCart.update();
       })
  .error(function(data,status,headers,config){
    notify.showNotification('Issue in removing product '+item.PProduct.PName+' from the cart.','danger');
    return;
});

}else{

  localStorage.deleteData('cart', item);
  $scope.items = localStorage.getData('cart');
  manageCart();
  updateCart.update();
  notify.showNotification('Product '+item.PProduct.PName+' Removed from the cart.','success');
}

}

$scope.placeOrder = function(){

  var session = localStorage.getData('User');

  if(session){
    $localStorage.orderAddress = undefined;

    session = JSON.parse(session);
    var orderDetails = {};
    orderDetails.withoutDiscount = $scope.bag.withoutDiscount;
    orderDetails.discount = $scope.bag.discount;
    orderDetails.deliveryCharge = $scope.bag.deliveryCharge;
    orderDetails.orderTotal = $scope.bag.orderTotal;
    orderDetails.GST = $scope.bag.GST;
    orderDetails.buyerId = session.token;
    orderDetails.orderAddress = {};
    var orderItems = [];
    for(var i = 0; i < $scope.items.length; i++){
      orderItems.push($scope.items[i]);

    }
    var user = {};
    user.token = session.token;
    user.email = session.email;
    user.fname = session.fname;
    user.lname = session.lname;
    user.mobile = session.mobile;

    console.log(JSON.stringify(orderDetails));
    var requestData = {};
    requestData.orderItems = orderItems;
    requestData.orderDetails = orderDetails;
    requestData.user = user;
    requestData.orderAddress = {};//"{\"orderItems\":"+JSON.stringify(orderItems)+", \"orderDetails\":"+JSON.stringify(orderDetails)+",\"user\":"+JSON.stringify(user)+"}";
    localStorage.saveData('order',requestData);
    $window.location = "#address/"+user.token;
    return;

}else{

  $('#loginModal').modal('show');

}


}
}]);

app.controller('showAddress',['$http','$scope','$window','$routeParams','localStorage','$localStorage','$rootScope','updateCart','notify','spinner','baseAPIUrl','ScrollTop', function($http, $scope, $window,$routeParams, localStorage,$localStorage,$rootScope, updateCart, notify,spinner,baseAPIUrl,ScrollTop){
//console.log("into cart");
ScrollTop.scroll();
$http.defaults.headers.common = {'access_code':'onyourown'};
$rootScope.isHome = false;

$scope.getAddresses = function(){
var spinElement = spinner.startSpin('body');
$scope.Addresses = [];
var session = localStorage.getData('User');
//console.log(session);


if(session && localStorage.getData('order')){
  var order = localStorage.getData('order');
  order = angular.fromJson(order);
  //console.log(order);
  $scope.AddressBag = {};
  $scope.AddressBag.count = order.orderItems.length;
  $scope.AddressBag.totalAmount = order.orderDetails.withoutDiscount;
  $scope.AddressBag.discount = order.orderDetails.discount;
  $scope.AddressBag.deliveryCharge = order.orderDetails.deliveryCharge;
  $scope.AddressBag.totalPayable = order.orderDetails.orderTotal;
  var totalArray = order.orderDetails.withoutDiscount.split(",");
  var totalAmount = 0;
  for(var i = 0; i < totalArray.length; i++){
    totalAmount += totalArray[i];
  }
  totalAmount = parseInt(totalAmount);
  var totalGST = order.orderDetails.GST.split(",");
  var totalGSTAmount = 0;
  for(var i = 0; i < totalArray.length; i++){
    totalGSTAmount += totalGST[i];
  }
  totalGSTAmount = parseInt(totalGSTAmount);
  $scope.AddressBag.totalAmount = convertToRupee(totalAmount + totalGSTAmount);

  var token = $routeParams.token;
  $http({

           method : 'GET',
           url : baseAPIUrl+'Addresses/getAddresses',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web',
                      'PClientId':token},

       }).
       success(function(data,status,headers,config){
          $scope.Addresses = data.response.Addresses;
          for(var i = 0; i < $scope.Addresses.length; i++){

            $scope.Addresses[i].selected = false;
          }
          if($scope.Addresses[0]){
            $scope.Addresses[0].selected = $scope.Addresses[0].id;
            $localStorage.orderAddress = $scope.Addresses[0];
          //  console.log(JSON.stringify($localStorage.orderAddress));
          }
          spinner.stopSpin(spinElement);

            return;


       })
  .error(function(data,status,headers,config){

    spinner.stopSpin(spinElement);
    return;
  });


}else{
  spinner.stopSpin(spinElement);
  $window.location = "/";
}
}

$scope.getAddresses();

$scope.changeBackground = function(Address){
for(var i=0;i < $scope.Addresses.length; i++){
  if($scope.Addresses[i] != Address){
    $scope.Addresses[i].selected = false;
  }else{
    $localStorage.orderAddress = $scope.Addresses[i];
  }
}
}

$scope.removeAddress = function(addressId){
  var spinElement = spinner.startSpin('body');
  $http({

           method : 'DELETE',
           url : baseAPIUrl+'Addresses/removeAddress',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web',
                      'addressId':addressId},

       }).
       success(function(data,status,headers,config){
         //console.log(JSON.stringify(data));
         spinner.stopSpin(spinElement);
         $scope.getAddresses();
         $localStorage.orderAddress = undefined;
       })
       .error(function(data,status,headers,config){
        // console.log(JSON.stringify(data));
         spinner.stopSpin(spinElement);
         notify.showNotification('Address could not be removed at now.','danger');

         return;
  });

}

$scope.showAddressModal = function(){
  // $(".state-input").hide();
  // $(".city-input").hide();
  $("#pincode-value-input").keyup(function() {
    var el = $(this);

    if ((el.val().length == 6)) {
      // $scope.newAdd.City = "aligarh";
      // $scope.newAdd.State = "up";
      console.log("ajax");
      $.ajax({
        url: "http://maps.googleapis.com/maps/api/geocode/json?address="+el.val(),
        cache: false,
        dataType: "json",
        type: "GET",
        data: "zip=" + el.val(),
        success: function(result, success) {
          console.log(result.results);
          // $(".fancy-form div > div").slideDown(); /* Show the fields */
          if(result.results[0].address_components.length > 2){
            $scope.newAdd.City = result.results[0].address_components[1].long_name;
            $scope.newAdd.State = result.results[0].address_components[2].long_name;
          // document.getElementById("city-value-input").value = result.results[0].address_components[1].long_name;
          // document.getElementById("state-value-input").value = result.results[0].address_components[2].long_name;
          }
          // $("#address-line-1").focus(); /* Put cursor where they need it */

        },
        error: function(result, success) {

          // $(".zip-error").show(); /* Ruh row */

        }

});

    }

  });
  console.log("hidden");
  $('#addAddressModal').modal('show');
}

$scope.saveAddress = function(){
  $scope.saveAddressError = "";
  var session = localStorage.getData('User');
  if(session){
    var spinElement = spinner.startSpin('body');
    session = JSON.parse(session);
    //console.log(session.token);

    if(!$scope.newAdd || !$scope.newAdd.Name || !$scope.newAdd.Locality || !$scope.newAdd.Street || !$scope.newAdd.City || !$scope.newAdd.PinCode || !$scope.newAdd.State || !$scope.newAdd.Mobile){
      $scope.saveAddressError = "All fields are required.";
      spinner.stopSpin(spinElement);
      return;
    }else{
      $scope.newAdd.PClientId = session.token;
      var requestData = $scope.newAdd;
    //console.log(JSON.stringify(requestData));
  $http({

           method : 'POST',
           url : baseAPIUrl+'Addresses/saveAddress',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web'},
           data: requestData

       }).
       success(function(data,status,headers,config){
        // console.log(JSON.stringify(data));
         $scope.newAdd = {};
         $scope.getAddresses();
         $('#addAddressModal').modal('toggle');
         spinner.stopSpin(spinElement);
         notify.showNotification('Address added.','success');

       })
       .error(function(data,status,headers,config){
         //console.log(JSON.stringify(data));
         if(status == 402){
          spinner.stopSpin(spinElement);
          $scope.saveAddressError = data.error.message;
          return;
         }else{
         spinner.stopSpin(spinElement);
         notify.showNotification('Address could not be added.','danger');
         return;
       }
    });
  }
}else{
    notify.showNotification('Address could not be added.','danger');

  }
}

$scope.proceedOrder = function(){
  var session = localStorage.getData('User');
  var spinElement = spinner.startSpin('body');

  if(session && $localStorage.orderAddress && localStorage.getData('order')){

      document.getElementById("confirm-order-button").disabled = true;
      session = JSON.parse(session);
      var order = localStorage.getData('order');
    //  console.log(JSON.stringify(order));
      order = angular.fromJson(order);
      order.orderAddress = $localStorage.orderAddress;

      $http({

               method : 'POST',
               url : baseAPIUrl+'Orders/initiateTransaction',
               headers: {'Content-Type': 'application/json',
                          'realm': 'web'},
               data: order
             }).
           success(function(data,status,headers,config){
                  var response = data.response;

                    $(response.form).appendTo('body').submit();
                }).
           error(function(data,status,headers,config){
                      spinner.stopSpin(spinElement);
                      $window.location = "#orderFailed";
                      return;
                    });





  // //    document.getElementById("confirm-order-button").disabled = true;
  //   document.getElementById("confirm-order-button").disabled = true;
  //   session = JSON.parse(session);
  //   var order = localStorage.getData('order');
  // //  console.log(JSON.stringify(order));
  //   order = angular.fromJson(order);
  //   order.orderAddress = $localStorage.orderAddress;
  //
  //   $http({
  //
  //            method : 'POST',
  //            url : baseAPIUrl+'Orders/placeOrder',
  //            headers: {'Content-Type': 'application/json',
  //                       'realm': 'web'},
  //            data: order
  //          }).
  //        success(function(data,status,headers,config){
  //               var order = data.response;
  //
  //             //  console.log(JSON.stringify(order));
  //              $http({
  //
  //                       method : 'DELETE',
  //                       url : baseAPIUrl+'CartItems/deleteCart',
  //                       headers: {'Content-Type': 'application/json',
  //                                  'realm': 'web',
  //                                  'PClientId':session.id}
  //                     }).
  //                   success(function(data,status,headers,config){
  //                     localStorage.deleteAll('cart');
  //                     localStorage.deleteData('order')
  //                     $localStorage.orderAddress = undefined;
  //                     updateCart.update();
  //                     spinner.stopSpin(spinElement);
  //                     $window.location = "#orderConfirmed/"+order.OrderId;
  //
  //                   })
  //                   .error(function(data,status,headers,config){
  //                     document.getElementById("confirm-order-button").disabled = true;
  //                     spinner.stopSpin(spinElement);
  //                     $window.location = "#error500";
  //
  //                   });
  //
  //             return;
  //
  //
  //        })
  //   .error(function(data,status,headers,config){
  //     spinner.stopSpin(spinElement);
  //     $window.location = "#orderFailed";
  //     return;
  //   });
  }else{
    if(!$localStorage.orderAddress){
      spinner.stopSpin(spinElement);
      notify.showNotification("Add Address for order","danger");
    }else{
    spinner.stopSpin(spinElement);
    $('#loginModal').modal('show');
    }
  }
}

}]);

app.controller('confirmedOrder',['$http','$scope','$window','$routeParams','localStorage','$localStorage','$rootScope','updateCart','notify','spinner','baseAPIUrl','ScrollTop', function($http, $scope, $window,$routeParams, localStorage,$localStorage,$rootScope, updateCart, notify,spinner,baseAPIUrl,ScrollTop){
//console.log("into cart");
ScrollTop.scroll();
$http.defaults.headers.common = {'access_code':'onyourown'};
$rootScope.isHome = false;
//var orderId = $routeParams.orderId;
localStorage.deleteAll('cart');
localStorage.deleteData('order');
$localStorage.orderAddress = undefined;
var session = localStorage.getData('User');
var spinElement = spinner.startSpin('body');
if(session){
  session = JSON.parse(session);
               $http({

                        method : 'DELETE',
                        url : baseAPIUrl+'CartItems/deleteCart',
                        headers: {'Content-Type': 'application/json',
                                   'realm': 'web',
                                   'PClientId':session.id}
                      }).
                    success(function(data,status,headers,config){
                      updateCart.update();
                      spinner.stopSpin(spinElement);

                    })
                    .error(function(data,status,headers,config){

                      spinner.stopSpin(spinElement);
                      $window.location = "error500.html";

                    });


}else{
  spinner.stopSpin(spinElement);
  $window.location = "cart.html";
}


}]);

app.controller('homeData',['$http','$scope','$window','$rootScope','localStorage','updateCart','spinner','baseAPIUrl', function($http, $scope, $window, $rootScope, localStorage, updateCart,spinner,baseAPIUrl){
  $rootScope.isHome = true;
  $http.defaults.headers.common = {'access_code':'onyourown'};
  $scope.tempData  = '';
  var spinElement = spinner.startSpin('body');
  $http({


           method : 'GET',
           url : baseAPIUrl+'HomeTemplates/getTempData',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web'}

       }).
       success(function(data,status,headers,config){
       //console.log(JSON.stringify(data.response));
       $scope.tempData = data.response;
       $(document).ready(function(){
       $('.product-slider').slick({
         slidesToShow: 4,
         slidesToScroll: 4,
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

      spinner.stopSpin(spinElement);
       })
  .error(function(data,status,headers,config){
    spinner.stopSpin(spinElement);
    $window.location = "#error500";
    return;
  });



}]);

app.controller('aboutUs',['$http','$scope','$window','$rootScope','localStorage','updateCart','ScrollTop', function($http, $scope, $window, $rootScope, localStorage, updateCart,ScrollTop){
  $rootScope.isHome = false;
  ScrollTop.scroll();
}]);

app.controller('termsConditions',['$http','$scope','$window','$rootScope','localStorage','updateCart','ScrollTop', function($http, $scope, $window, $rootScope, localStorage, updateCart,ScrollTop){
  $rootScope.isHome = false;
  ScrollTop.scroll();
}]);

app.controller('moneyBack',['$http','$scope','$window','$rootScope','localStorage','updateCart','ScrollTop', function($http, $scope, $window, $rootScope, localStorage, updateCart,ScrollTop){
  $rootScope.isHome = false;
  ScrollTop.scroll();
}]);

app.controller('companyPolicy',['$http','$scope','$window','$rootScope','localStorage','updateCart','ScrollTop', function($http, $scope, $window, $rootScope, localStorage, updateCart,ScrollTop){
  $rootScope.isHome = false;
  ScrollTop.scroll();
}]);

app.controller('howWeWork',['$http','$scope','$window','$rootScope','localStorage','updateCart','ScrollTop', function($http, $scope, $window, $rootScope, localStorage, updateCart, ScrollTop){
  $rootScope.isHome = false;
  ScrollTop.scroll();
}]);

app.controller('contactUs',['$http','$scope','$window','$routeParams','localStorage','$localStorage','$rootScope','updateCart','notify','baseAPIUrl','ScrollTop', function($http, $scope, $window,$routeParams, localStorage,$localStorage,$rootScope, updateCart, notify, baseAPIUrl,ScrollTop){
//console.log("into cart");
$http.defaults.headers.common = {'access_code':'onyourown'};
$rootScope.isHome = false;
ScrollTop.scroll();

  $scope.submitQuery = function(){
    var session = localStorage.getData('User');
    if(session){
      session = JSON.parse(session);

      if($scope.contactQuery && $scope.contactQuery.length > 5){
        var requestData = {};
        requestData.user = session;
        requestData.query = $scope.contactQuery;
        $http({

                 method : 'post',
                 url : baseAPIUrl+'Clients/submitQuery',
                 headers: {'Content-Type': 'application/json',
                            'realm': 'web',
                          },
                  data:requestData
               }).
             success(function(data,status,headers,config){
               $scope.contactQuery = "";
               notify.showNotification("Your query is submitted.We will respond you soon.","success");

             })
             .error(function(data,status,headers,config){
               notify.showNotification("Issue in processing your query.Try later.",'warning');

             });
      }else{
        notify.showNotification("Please enter your query",'warning');
      }

    }else{
      $('#loginModal').modal('show');
    }
  }
}]);

app.controller('userProfile',['$http','$scope','$window','$routeParams','localStorage','$localStorage','$rootScope','updateCart','notify','spinner','baseAPIUrl', function($http, $scope, $window,$routeParams, localStorage,$localStorage,$rootScope, updateCart, notify, spinner, baseAPIUrl){
//console.log("into cart");
$http.defaults.headers.common = {'access_code':'onyourown'};
$rootScope.isHome = false;
$scope.category = $routeParams.category.toLowerCase();

$scope.getProfile = function(){
  var spinElement = spinner.startSpin('body');
  var session = localStorage.getData('User');

      if(session){
        session = JSON.parse(session);
        $http({

                 method : 'get',
                 url : baseAPIUrl+'Clients/getProfile',
                 headers: {'Content-Type': 'application/json',
                            'realm': 'web',
                            'token': session.token
                          }
               }).
             success(function(data,status,headers,config){
               if(status == 204){
                 spinner.stopSpin(spinElement);
                 $window.location = "#error204";
               }else {
                 $scope.profileData = data.response;
                 spinner.stopSpin(spinElement);
             }

             })
             .error(function(data,status,headers,config){
               spinner.stopSpin(spinElement);
               $window.location = "#error500";

             });

      }else{
        spinner.stopSpin(spinElement);
        $window.location = "#";
      }
}

$scope.myOrders = function(){
$scope.ordersSkip = 0;
$scope.getOrders();
}

$scope.getMoreOrders = function(){
  $scope.ordersSkip += 4;
  $scope.getOrders();
}
$scope.getOrders = function(){
  var spinElement = spinner.startSpin('body');
  var session = localStorage.getData('User');
  $scope.noOrders = false;
  $scope.moreOrders = false;
      if(session){
        session = JSON.parse(session);
        $http({

                 method : 'get',
                 url : baseAPIUrl+'Orders/getOrders',
                 headers: {'Content-Type': 'application/json',
                            'realm': 'web',
                            'token': session.token,
                            'skip': $scope.ordersSkip
                          }
               }).
             success(function(data,status,headers,config){
               if(status == 204){
                  spinner.stopSpin(spinElement);

               }else {
                 for(var i = 0; i < data.response.length; i++){
                   var orderDate = new Date(data.response[i].OrderDate);
                   var actionDate = new Date(data.response[i].OrderActionDate);
                   data.response[i].OrderActionDate = actionDate;
                   data.response[i].OrderDate = orderDate;

                 }

                 if($scope.ordersSkip == 0){
                   //console.log(JSON.stringify(data.response));
                   $scope.orderData = data.response;
                   if($scope.orderData.length == 0){
                     $scope.noOrders = true;
                   }

               }else{
                 for(var i = 0; i < data.response.length; i++){
                   $scope.orderData.push(data.response[i]);
                 }
               }
               if(data.response.length == 4){
                 $scope.moreOrders = true;
               }else {
                 $scope.moreOrders = false;
               }
                 spinner.stopSpin(spinElement);
             }

             })
             .error(function(data,status,headers,config){
               spinner.stopSpin(spinElement);
               $window.location = "#error500";

             });

      }else{
        spinner.stopSpin(spinElement);
        $window.location = "#";
      }

}

$scope.cancelOrder =  function(orderId){
  var spinElement = spinner.startSpin('body');
  var session = localStorage.getData('User');

      if(session){
        session = JSON.parse(session);
        $http({

                 method : 'get',
                 url : baseAPIUrl+'Orders/cancelOrder',
                 headers: {'Content-Type': 'application/json',
                            'realm': 'web',
                            'token': session.token,
                            'orderId': orderId,
                            'email':session.email
                          }
               }).
             success(function(data,status,headers,config){
               if(status == 204){
                 $window.location="#error204";
               }
                 $scope.myOrders();
                 spinner.stopSpin(spinElement);


             })
             .error(function(data,status,headers,config){
               spinner.stopSpin(spinElement);
               $window.location = "#error500";

             });

      }else{
        spinner.stopSpin(spinElement);
        $window.location = "#";
      }

}



$scope.getProfile();
$scope.myOrders();


$scope.openProfileEditModal = function(){
  var myCalendar;
  $scope.myCalendar = new dhtmlXCalendarObject("showCalendar");
  $scope.myCalendar.attachObj({input: "calendar_input", button: "calendar_icon"});
  $scope.myCalendar.setParent("showCalendar");
  $scope.myCalendar.setPosition(0,0);
  $scope.myCalendar.setDateFormat("%d-%M-%Y");

  $scope.editProfileData = $scope.profileData;
  if($scope.editProfileData.client_gender){
    if($scope.editProfileData.client_gender == 'Male'){
      $scope.editProfileData.client_gender_male = 'male';
    }
    if($scope.editProfileData.client_gender == 'Female'){
      $scope.editProfileData.client_gender_female = 'female';
    }
  }
  $('#profileEditModal').modal('show');


}

$scope.maleGenderSelected = function(){
  $scope.editProfileData.client_gender_female = undefined;
}

$scope.femaleGenderSelected = function(){
  $scope.editProfileData.client_gender_male = undefined;
}

$scope.saveProfileData = function(){

  var requestData = $scope.editProfileData;
  if($scope.editProfileData.client_gender_male){
    requestData.client_gender = "Male";
  }else{
    requestData.client_gender = "Female";
  }
  requestData.client_gender_male = undefined;
  requestData.client_gender_female = undefined;
  if($scope.myCalendar){
    if($scope.myCalendar.getFormatedDate("%d-%M-%Y")){
      requestData.client_dob = document.getElementById("calendar_input").value;

    }
  }
  requestData.error = undefined;

  var spinElement = spinner.startSpin('body');
  $http({

           method : 'patch',
           url : baseAPIUrl+'Clients/updateProfile',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web',
                      'id': $scope.profileData.id
                    },
           data:requestData
         }).
       success(function(data,status,headers,config){
         $scope.profileData = data.response;
         $('#profileEditModal').modal('hide');
         spinner.stopSpin(spinElement);
         notify.showNotification("Profile updated successfully","success");

       })
       .error(function(data,status,headers,config){
          spinner.stopSpin(spinElement);
           $scope.editProfileData.error = "Error occured! Try later","danger";

       });
}


$scope.openChangePasswordModal = function(){
  $('#changePasswordModal').modal('show');
}


$scope.changeUserPassword = function(){
  if($scope.changePassword){
  $scope.changePassword.error = "";
}else{
  $scope.changePassword = {};
}
  var oldPassword = $scope.changePassword.old;
  var newPassword = $scope.changePassword.new;
  var confirmPassword = $scope.changePassword.confirm;

  if(!oldPassword){
    $scope.changePassword.error = "Enter old password";
    return;
  }else{
  if(!newPassword){
    $scope.changePassword.error = "Enter new password";
    return;
  }else{
  if(!confirmPassword){
    $scope.changePassword.error = "Enter confirm password";
    return;
      }
    }
  }
  if(oldPassword.length < 8 || newPassword.length < 8 || confirmPassword.length < 8){
    $scope.changePassword.error = "Password must be atleast of 8 characters";
    return;
  }
  if(newPassword != confirmPassword){
    $scope.changePassword.error = "Password does not match";
    return;
  }
  if($scope.profileData.client_password != oldPassword){
    $scope.changePassword.error = "Wrong old password";
    return;
  }
  var spinElement = spinner.startSpin('body');
  var requestData = {};
  requestData.client_password = newPassword;
  $http({

           method : 'patch',
           url : baseAPIUrl+'Clients/updateProfile',
           headers: {'Content-Type': 'application/json',
                      'realm': 'web',
                      'id': $scope.profileData.id
                    },
           data:requestData
         }).
       success(function(data,status,headers,config){
         $scope.profileData = data.response;
         $scope.changePassword = {};
         $('#changePasswordModal').modal('hide');
         $('#profileEditModal').modal('hide');
         spinner.stopSpin(spinElement);
         notify.showNotification("Password changed successfully","success");

       })
       .error(function(data,status,headers,config){
          spinner.stopSpin(spinElement);
          $scope.changePassword.error = "Error occured! Try later"

       });
}
}]);
