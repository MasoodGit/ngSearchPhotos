ngSearchGram
.factory("instaGramAPI",function($http) {
 return function() {
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
        //$http.jsonp(endpoint, config)
        $http({
          method: 'JSONP',
          url : endpoint,
          params : config.params
        })
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
    };
  }
);