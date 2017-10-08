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

app.factory('baseAPIUrl',function(){
      var baseURL = "http://139.59.94.11:8080/api/";
      return baseURL;
  });

app.service('uploadFile',['baseAPIUrl',function(baseAPIUrl){

  this.upload = function(file, PCode, $http, $scope){


    var backendUrl = baseAPIUrl+'Filedata/upload';
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
  })
  .when('/uploadSheet',{
    templateUrl:"uploadSheet.html"
  })
  .when('/error500',{
    templateUrl:"error500.html"
  });
});
app.controller('dashboard',['$scope','$http','$window','$localStorage','baseAPIUrl',function($scope,$http,$window,$localStorage,baseAPIUrl){
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

app.controller('addProduct',['$scope','$http','$window','uploadFile','baseAPIUrl',function($scope,$http,$window,uploadFile,baseAPIUrl){
   $scope.addError = "";
   $http.defaults.headers.common = {'access_code':'onadmin'};

   $scope.addProductItem = function(){
    $scope.addError = "";
    var product = $scope.product;

    if(!product || !product.PName || !product.PCategory || !product.PCode || !product.PMaterial1 || !product.PCompany || !$scope.PImage1 || !$scope.PImage2 || !$scope.PImageSmall){

  $scope.addError = "Please fill required fields!";
  return;
}
  product.PImage1 = $scope.PImage1.name;
  product.PImage2 = $scope.PImage2.name;
  if($scope.PImage3){
    product.PImage3 = $scope.PImage3.name;
  }
  product.PImageSmall = $scope.PImageSmall.name;
  $http({

         method : 'POST',
         url : baseAPIUrl+'Products/addProduct',
         headers: {'Content-Type': 'application/json',
                    'realm': 'web'},
         data: product

     }).
     success(function(data,status,headers,config){
       /* Add Images */
       uploadFile.upload($scope.PImage1, product.PCode, $http, $scope);
       uploadFile.upload($scope.PImage2, product.PCode, $http, $scope);
       if($scope.PImage3){
       uploadFile.upload($scope.PImage3, product.PCode, $http, $scope);
       }
       uploadFile.upload($scope.PImageSmall, product.PCode, $http, $scope);
       $scope.addError = "Product Added successfully!";
     })
     .error(function(data,status,headers,config){

       alert(JSON.stringify(data.error.message));
       return;
     });
   }
}]);
app.controller('uploadSheetController',['$scope','$http','$window','uploadFile','baseAPIUrl',function($scope,$http,$window,uploadFile,baseAPIUrl){

   $scope.uploadSheet = function(){

     var sheetContainer = "ProductSheets";
   function sheetUpload(sheetContainer){
   $scope.uploadSheetError = "";
   $scope.uploadSheetSuccess = "";

   $http.defaults.headers.common = {'access_code':'onadmin'};

   if(!$scope.productSheet){
     $scope.uploadSheetError = "Select sheet to upload";
     return;
   }
   uploadFile.upload($scope.productSheet, sheetContainer, $http, $scope)
  //  setTimeout(function(){
   //
  //       $http({
  //         method : 'GET',
  //         url : 'http://localhost:3000/api/Products/uploadSheet',
  //         headers: {'Content-Type': 'application/json',
  //                    'realm': 'web',
  //                    'fileName':$scope.productSheet.name},
   //
  //       }).
  //       success(function(data,status,headers,config){
  //         $scope.uploadSheetSuccess = "Products uploaded Successfully";
  //       }).
  //       error(function(data,status,headers,config){
  //         $scope.uploadSheetError= "Error Occurred";
  //       })
   //
   //
  //   },9000);

}
  sheetUpload(sheetContainer);
}

 }]);

app.controller('updateProduct',['$scope','$http','$window','uploadFile','baseAPIUrl',function($scope,$http,$window,uploadFile,baseAPIUrl){
$http.defaults.headers.common = {'access_code':'onadmin'};
    var Pcodes=[];
  $http({
    method : 'GET',
    url : baseAPIUrl+'Products/getProductCode',
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
    if(code.length >= 4){
    $http.defaults.headers.common = {'access_code':'onadmin'};
        var Pcodes=[];
      $http({
        method : 'GET',
        url : baseAPIUrl+'Products/getUpdateProduct',
        headers: {'Content-Type': 'application/json',
                   'realm': 'web',
                    'code': code},


      }).
      success(function(data,status,headers,config,statusText){
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
if($scope.PImageSmall){
  product.PImageSmall = $scope.PImageSmall.name;
}
var productCode = product.PCode;
   $http({

          method : 'PUT',
          url : baseAPIUrl+'Products/updateProduct',
          headers: {'Content-Type': 'application/json',
                     'realm': 'web',
                   'code': productCode },
          data: product

      }).
      success(function(data,status,headers,config){
        /* Update Images */

        if(status == 204){
          $scope.updateError = "Product not found!";
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
       if($scope.PImageSmall){
         uploadFile.upload($scope.PImageSmall, product.PCode, $http, $scope);
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
