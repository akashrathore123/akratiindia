var app = angular.module("dash",['ngRoute','ngStorage']);

app.directive('fileModel', ['$parse', function ($parse) {
           return {
              restrict: 'A',
              link: function(scope, element, attrs) {
                 var model = $parse(attrs.fileModel);
                 var modelSetter = model.assign;

                 element.bind('change', function(){
                    scope.$apply(function(){
                       modelSetter(scope, element[0].files[0]);
                    });
                 });
              }
           };
        }]);

 app.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl:"dashboardData.html"
  })
  .when('/addProduct',{
    templateUrl:"addProduct.html"
  })
  .when('/updateProduct',{
    templateUrl:"updateProduct.html"
  })
  .when('/viewProducts',{
    templateUrl:"viewProducts.html"
  })
  .when('/pendingOrders',{
    templateUrl:"pendingOrders.html"
  })
  .when('/deliveredOrders',{
    templateUrl:"deliveredOrders.html"
  })
  .when('/totalOrders',{
    templateUrl:"totalOrders.html"
  })
  .when('/activeUsers',{
    templateUrl:"activeUsers.html"
  })
  .when('/unactiveUsers',{
    templateUrl:"unactiveUsers.html"
  })
  .when('/totalUsers',{
    templateUrl:"totalUsers.html"
  });
});
app.controller('dashboard',['$scope','$http','$window','$localStorage',function($scope,$http,$window,$localStorage){
  $http.defaults.headers.common = {'access_code':'onadmin'};
  //alert(JSON.stringify($localStorage.admin));
  if($localStorage.admin == undefined || $localStorage.admin == ""){
    $window.location = "admin.html";

  }
  $scope.logOut = function(){
   $localStorage.admin = "";
   setTimeout(function(){
     $window.location = "admin.html";
   }, 300);
  }
}]);

app.controller('addProduct',['$scope','$http','$window',function($scope,$http,$window){
  $http.defaults.headers.common = {'access_code':'onadmin'};
  $scope.addProductItem = function(){
var product = $scope.product;
console.log(product);

var file = $scope.PImage1;
console.dir(file);
var backendUrl = 'http://localhost:3000/api/Containers/product1/upload'
var fd = new FormData();

fd.append('file', file, 'filename.png');

$http.post(backendUrl, fd, {
    // this cancels AngularJS normal serialization of request
    transformRequest: angular.identity,
    // this lets browser set `Content-Type: multipart/form-data`
    // header and proper data boundary
    headers: {'Content-Type': undefined}
})

.success(function(){
  alert("file uploaded successfully.");
    //file was uploaded
})

.error(function(){
  alert("error occured");
    //something went wrong
});


  }
}]);
