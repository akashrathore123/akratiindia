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

app.service('uploadFile',function(){

  this.upload = function(file, PCode, $http, $scope){


    var backendUrl = 'http://localhost:3000/api/Filedata/upload';
    var fd = new FormData();

    fd.append('file', file, file.name);


    $http.post(backendUrl, fd, {
        // this cancels AngularJS normal serialization of request
        transformRequest: angular.identity,
        // this lets browser set `Content-Type: multipart/form-data`
        // header and proper data boundary
        headers: {'Content-Type': undefined,
      'container': PCode}
    })

    .success(function(data,status,headers,config){
        //file was uploaded
    })

    .error(function(data,status,headers,config){
      $scope.addError = data.error.message +(file.name);
        //something went wrong
    });

  }
});
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
  })
  .when('/error500',{
    templateUrl:"error500.html"
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

app.controller('addProduct',['$scope','$http','$window','uploadFile',function($scope,$http,$window,uploadFile){
   $scope.addError = "";
   $http.defaults.headers.common = {'access_code':'onadmin'};

   $scope.addProductItem = function(){
    $scope.addError = "";
    var product = $scope.product;
      console.log(product);
      console.log($scope.PImage1);
    if(!product || !product.PName || !product.PCategory || !product.PCode || !product.PMaterial1 || !product.PCompany || !$scope.PImage1 || !$scope.PImage2 || !$scope.PImage3){

  $scope.addError = "Please fill required fields!";
  return;
}
  product.PImage1 = $scope.PImage1.name;
  product.PImage2 = $scope.PImage2.name;
  product.PImage3 = $scope.PImage3.name;

  $http({

         method : 'POST',
         url : 'http://localhost:3000/api/Products/addProduct',
         headers: {'Content-Type': 'application/json',
                    'realm': 'web'},
         data: product

     }).
     success(function(data,status,headers,config){
       /* Add Images */
       uploadFile.upload($scope.PImage1, product.PCode, $http, $scope);
       uploadFile.upload($scope.PImage2, product.PCode, $http, $scope);
       uploadFile.upload($scope.PImage3, product.PCode, $http, $scope);

       $scope.addError = "Product Added successfully!";
     })
     .error(function(data,status,headers,config){

       alert(JSON.stringify(data.error.message));
       return;
     });
   }
}]);

app.controller('updateProduct',['$scope','$http','$window','uploadFile',function($scope,$http,$window,uploadFile){
$http.defaults.headers.common = {'access_code':'onadmin'};
    var Pcodes=[];
  $http({
    method : 'GET',
    url : 'http://localhost:3000/api/Products/getProductCode',
    headers: {'Content-Type': 'application/json',
               'realm': 'web'},

  }).
  success(function(data,status,headers,config){
    for(i=0;i<data.response.length;i++){
      Pcodes.push(data.response[i].PCode);
    }
    $scope.codes = Pcodes;
  }).
  error(function(data,status,headers,config){
    $window.location = "#error500";
  })

  $scope.getUpdateProduct = function(code){
    $scope.products = "";
    $scope.codeDropdownResult = "";
    if(code.length > 4){
    $http.defaults.headers.common = {'access_code':'onadmin'};
        var Pcodes=[];
      $http({
        method : 'GET',
        url : 'http://localhost:3000/api/Products/getUpdateProduct',
        headers: {'Content-Type': 'application/json',
                   'realm': 'web',
                    'code': code},


      }).
      success(function(data,status,headers,config,statusText){
    console.log("statusText--"+statusText);
        console.log("status--"+status);
        if(status == 204){

          $scope.codeDropdownResult = "No Product found with Product Code:"+code;
        }else{
          $scope.products = data.response;
        }

      }).
      error(function(data,status,headers,config){

        $window.location = "#error500";
      })


    }
  }

  $scope.updateProduct = function(){
     $http.defaults.headers.common = {'access_code':'onadmin'};
     $scope.updateError = "";
     var product = $scope.products;

     if(!product || !product.PName || !product.PCategory || !product.PCode || !product.PMaterial1 || !product.PCompany){

   $scope.updateError = "Please fill required fields!";
   return;
 }
 if($scope.PImage1){
   product.PImage1 = $scope.PImage1.name;
 }
 if($scope.PImage2){
   product.PImage2 = $scope.PImage2.name;
 }
 if($scope.PImage3){
   product.PImage3 = $scope.PImage3.name;
}
var productCode = product.PCode;
   $http({

          method : 'PUT',
          url : 'http://localhost:3000/api/Products/updateProduct',
          headers: {'Content-Type': 'application/json',
                     'realm': 'web',
                   'code': productCode },
          data: product

      }).
      success(function(data,status,headers,config){
        /* Update Images */
        console.log(data);
        if(status == 204){
          $scoope.updateError = "Product not found!";
        }else{
        if($scope.PImage1){
          uploadFile.upload($scope.PImage1, product.PCode, $http, $scope);
        }
        if($scope.PImage2){
          uploadFile.upload($scope.PImage2, product.PCode, $http, $scope);
        }
        if($scope.PImage3){
          uploadFile.upload($scope.PImage3, product.PCode, $http, $scope);
       }

         $scope.updateError = "Product Updated successfully!";
         $scope.products = data;
     }


      })
      .error(function(data,status,headers,config){
        $window.location = "#error500";

        return;
      });
    }

}]);
