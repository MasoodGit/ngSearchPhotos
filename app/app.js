angular.module('ngSearchGram', ['ngMessages'])
.controller('ngSearchController',function($scope) {

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
  }
};

});