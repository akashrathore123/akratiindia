var app = angular.module('main',[]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "/client/inde.html"
    })
    .when("/product", {
        templateUrl : "/client/product.html"
    })
    });

//
// app.factory('localStorage', function(){
//
//   var storage = {};
//
//   storage.saveData = function(key, data){
//   $localStorage.key = data;
//   return;
//   }
//
//   storage.getData = function(key){
//
//     return $localStorage.key;
//   }
//
//   return storage;
//
// });
