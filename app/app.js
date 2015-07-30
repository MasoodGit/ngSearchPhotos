//Create the ngApp - ngSearchGram
var ngSearchGram = angular.module('ngSearchGram', ['ngMessages']);

//Create ngSearchController
ngSearchGram.controller('ngSearchController',ngSearchControllerFunc);

/*
 * ngSearchController function, takes $scope and instaGramAPI service
 * as dependency
 */
function ngSearchControllerFunc($scope,instaGramAPI) {
  /*
   * scope variable to tag search
   */
  $scope.keyword = "";

  /*
   * statusMessage , displays
   * messages in the status bar
   */
  $scope.statusMessage ="";

  /*
   * triggers field validation if form is
   * submitted or if the field is blured
   */
  $scope.interacted = function(field) {
    return $scope.keywordForm.$submitted || field.$touched;
  };

  /*
   * Generic error handler , used when interacting
   * with the instagramAPI
   */
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

  /*
   * Invokes instagramAPI to search for the
   * tag the user has entered.
   */
  $scope.searchImages = function() {
    if($scope.keywordForm.$valid) {
      var searchKeyword = $scope.keyword;
      $scope.statusMessage = "Searching Instagram for photos tagged with " + searchKeyword;
      $scope.keywordForm.$setUntouched();
      $scope.keyword = "";
      $scope.keywordForm.$setPristine();
      //make call to the instagram api
      instaGramAPI.getImages(searchKeyword,function(data){
        $scope.images = data;
        $scope.statusMessage = "We found " + data.length + " results for "  + searchKeyword;
      },errorHandler);
    }
  };

}