//Create the ngApp - ngSearchGram
var ngSearchGram = angular.module('ngSearchGram', ['ngMessages']);

//Create ngSearchController
ngSearchGram.controller('ngSearchController',ngSearchControllerFunc);

/*
 * ngSearchController function, takes $scope and instaGramAPI service
 * as dependency
 */
function ngSearchControllerFunc($scope,$timeout,instaGramAPI) {

 /*
  * local variable for search tag term
  */
  var searchKeyword = "";

  /*
   * scope variable to tag search
   */
  $scope.keyword = "";

  /*
   * scope variable to track if image lading
   * is in progress
   */

  $scope.isFetchingImages = false;

  /*
   * scope variable to track if image laoding state
   * is completed
   */

  $scope.isFetchingImagesCompleted = false;

  /*
   * scope variable dictionary, holds url and image element
   */
  $scope.images = {};

  /*
   * scope variable to track image count
   */
  $scope.imageCount = 0;

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
  var onErrorHandler = function(error) {
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
   * Success handler , once the success response received
   * from instagram
  */
  var onFetchImagesHandler = function(data) {
    data.forEach(function(dataObject){
       fetchImage(dataObject.images.low_resolution.url);
    });
  };

/*
 * fetchImage based on url, update the images dictionary.
 * when all images have been loaded update the UI
 */
  var fetchImage = function(url) {
    var img = new Image();

    img.onload = function() {
      $scope.images[url] = img;
      if(isAllImagesFetched()) {
        // Trigger the digest phase.
        $timeout(function() {
          // Set the "isFetchingImages" and "isFetchingImagesCompleted" flags for UI updates
          $scope.isFetchingImages = false;
          $scope.isFetchingImagesCompleted = true;
          $scope.imageCount = Object.keys($scope.images).length;
          $scope.statusMessage ="We have found " + $scope.imageCount + " photos of " + searchKeyword;
          }, 700);
        }
    };

    $scope.images[url] = false;
    img.src = url;
  };

 /*
 * tracks if all images have been loaded.
 */
  var isAllImagesFetched = function () {
    var  isDone = true;
    for(var k in $scope.images){
      if($scope.images.hasOwnProperty(k) && !$scope.images[k]) {
        isDone = false;
        break;
      }
    }
    return isDone;
  };

  /*
   * Invokes instagramAPI to search for the
   * tag the user has entered.
   */
  $scope.searchImages = function() {
    if($scope.keywordForm.$valid) {
      searchKeyword = $scope.keyword;
      $scope.statusMessage = "Searching Instagram for photos tagged with " + searchKeyword;
      $scope.keywordForm.$setUntouched();
      $scope.keyword = "";
      $scope.keywordForm.$setPristine();

      $scope.isFetchingImages = true;
      $scope.isFetchingImagesCompleted = false;
      $scope.images = {};

      //make call to the instagram api
      instaGramAPI.getImages(searchKeyword,onFetchImagesHandler,onErrorHandler);
    }
  };

}