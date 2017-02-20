var app = angular.module('home',['ngCookies']);

app.controller('registerAction',['$scope','$http','$cookies','$document','$window',function($scope,$http,$cookies,$document,$window){
$http.defaults.headers.common = {'realm':'web'};
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
               headers: {'Content-Type': 'application/json'},
               data : user
           }).
           success(function(data,status,headers,config){

                console.log(data.response.client_token);
                var Fabostyle = {'token':data.response.client_token};
                $cookies.Fabtoken = Fabostyle;
                addCookie("token="+data.response.client_token);
                $document.cookie = "token="+data.response.client_token;

                console.log('Fabtoken-' + $cookies.Fabtoken.token);
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


app.controller('loginAction',function($scope,$http,$window){
  $scope.userLogin = function(){
      var login =JSON.stringify($scope.login);


      $http({


               method : 'POST',
               url : 'http://localhost:3000/api/Clients/login',
               headers: {'Content-Type': 'application/json'},
               data : login
           }).
           success(function(data,status,headers,config){
             document.getElementById("loginResponse").innerHTML = data;

                return;

           })
      .error(function(data,status,headers,config){

        document.getElementById("loginResponse").innerHTML = "<span style='color:red'>"+data.error.message;
        return;
    });

  }

});

app.controller('loginCheck',['$scope','$http','$cookies','$document', function($scope,$http,$cookies,$document){

  if(getCookie()){
    console.log("session exists");
  }else{
    console.log("session not exist");
  }
}]);

function addCookie(cookie){
document.cookie = cookie;

}

function getCookie(){
console.log(document.cookie);
return document.cookie;

}
