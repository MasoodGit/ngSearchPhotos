angular.module('ngSearchGram', ['ngMessages'])
.controller('ngSearchController',function($scope,$http) {



function InstaGramAPI(tag) {
  var baseUrl = "https://api.instagram.com/v1/tags/{tag}/media/recent";
  var clientId = "d2406ec1a54649a4a9778cf5f5be1e1d";
  var endpoint = baseUrl.replace(/{tag}/g,tag);
  var config = {
    'params' : {
        'client_id' : clientId,
        'count' : 20,
        'callback' : 'JSON_CALLBACK'
    }
  };

  $http.jsonp(endpoint, config).success(function(result){
    console.log(result);
    if(result.meta.code == 200) {
      $scope.images = result.data;
      $scope.imageCount = result.data.length;
    } else {
      console.log(result.meta.error_type);
    }
  }).error(function(){

  });
}


$scope.keyword = "";
$scope.statusMessage ="";

$scope.interacted = function(field) {
  return $scope.keywordForm.$submitted || field.$touched;
};



$scope.searchImages = function() {
  //make call to the instagram api
  if($scope.keywordForm.$valid) {
    var searchKeyword = $scope.keyword;
    $scope.statusMessage = "Searching Instagram for photos tagged with " + searchKeyword;
    $scope.keywordForm.$setUntouched();
    $scope.keyword = "";
    $scope.keywordForm.$setPristine();
    InstaGramAPI(searchKeyword);
  }
};

});