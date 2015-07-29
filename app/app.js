angular.module('ngSearchGram', ['ngMessages'])
.controller('ngSearchController',function($scope,$http) {



function InstaGramAPI() {

  var baseUrl = "https://api.instagram.com/v1/tags/{tag}/media/recent";
  var clientId = "d2406ec1a54649a4a9778cf5f5be1e1d";


  var config = {
    'params' : {
        'client_id' : clientId,
        'count' : 20,
        'callback' : 'JSON_CALLBACK'
    }
  };


  this.getImages = function(tagToSearch,successCallbackFunc,errorCallbackFunc) {
    var endpoint = baseUrl.replace(/{tag}/g,tagToSearch);
    $http.jsonp(endpoint, config)
      .success(function(result) {
        if(result.meta.code == 200) {
          successCallbackFunc(result.data);
        }
        else  {
          console.log(result.meta.error_type);
          errorCallbackFunc({errorType: meta.error_type,code:meta.code,errorMessage:meta.error_message});
       }
    })
    .error(function() {
        //display error message
        errorCallbackFunc('Unable to load images, Please refresh the page');
  });

  };
}


$scope.keyword = "";
$scope.statusMessage ="";
$scope.errorMessag="";
$scope.isLoading = false;
$scope.isErrored = false;

$scope.interacted = function(field) {
  return $scope.keywordForm.$submitted || field.$touched;
};

var errorHandler = function(error) {
  $scope.isLoading = false;
  $scope.isErrored = true;
  if (error) {
    console.log('Error occured...',error);

    if (typeof error === 'object') {
      $scope.statusMessage= 'Can not retrieve all the places. Please reload the page.';
    }
    else if (typeof error === 'string') {
      $scope.statusMessage = error;
    }
  }
};

$scope.clearPhotos = function () {
  $scope.images = null;
  $scope.statusMessage = "";
};

$scope.searchImages = function() {
  //make call to the instagram api
  if($scope.keywordForm.$valid) {
    var searchKeyword = $scope.keyword;
    $scope.statusMessage = "Searching Instagram for photos tagged with " + searchKeyword;
    $scope.keywordForm.$setUntouched();
    $scope.keyword = "";
    $scope.keywordForm.$setPristine();
    var instaGramApi = new InstaGramAPI();
    instaGramApi.getImages(searchKeyword,function(data){
      $scope.images = data;
      $scope.statusMessage = "We found " + data.length + " results for "  + searchKeyword;
    },errorHandler);
  }
};

});