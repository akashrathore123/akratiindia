var app= angular.module("admin",['ngStorage','ngRoute']);
app.factory('baseAPIUrl',function(){
      var baseURL = "http://139.59.23.178/api/";
      return baseURL;
  });


app.controller('adminLogin',['$scope','$http','$window','$localStorage','baseAPIUrl',function($scope,$http,$window,$localStorage,baseAPIUrl){
  $http.defaults.headers.common = {'access_code':'onadmin'};
  document.getElementById('loginError').innerHTML = "";
if($localStorage.admin){
  console.log("session exists");
   $window.location = "dashboard.html";
}
  $scope.login = function(){
  console.log($scope.admin);
  if($scope.admin == undefined || $scope.admin.adminId == "" || $scope.admin.adminId == undefined){
    document.getElementById('loginError').innerHTML = "Not Valid ID!";
    return;
  }
  if($scope.admin.password == "" || $scope.admin.password == undefined){
    document.getElementById('loginError').innerHTML = "Not Valid Password!";
    return;
  }
  $http({
    method : 'POST',
    url : baseAPIUrl+'Admins/login',
    headers: {'Content-Type': 'application/json',
               'realm': 'web'},
    data : $scope.admin
  })
  .success(function(data, status, headers, config){

    $localStorage.admin = data.response;
    setTimeout(function(){
      $window.location = "dashboard.html";
    }, 300);

  })
  .error(function(data, status, headers, config){
    document.getElementById('loginError').innerHTML = data.error.message;
  });
}
}
]);
