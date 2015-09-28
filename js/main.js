var app = angular.module("myApp", ['infinite-scroll']);
    
    app.filter('fromTo', function() {
        return function(input, from, total, lessThan) {
            from = parseInt(from);
            total = parseInt(total);
            for (var i = from; i < from + total && i < lessThan; i++) {
                input.push(i);
            }
            return input;
        }
    });
    
    app.factory('instagram', ['$http',
        function($http) {
            return {
                fetchPopular: function(callback) {

                    var endPoint = "https://api.instagram.com/v1/media/popular?client_id=642176ece1e7445e99244cec26f4de1f&callback=JSON_CALLBACK";

                    $http.jsonp(endPoint).success(function(response) {
                        callback(response.data);
                    });
                },

                fetchByTagKeyword : function(keyword, callback) {

                	var endPoint = "https://api.instagram.com/v1/tags/" + keyword + "/media/recent?client_id=67d226cf734844ba876821fc425d366e&callback=JSON_CALLBACK";
                	//var endPoint = "https://api.instagram.com/v1/media/popular?client_id=642176ece1e7445e99244cec26f4de1f&callback=JSON_CALLBACK";

                    $http.jsonp(endPoint)
                    	.success(function(response) {
                    		console.log(response);
                        	callback(response);
                    	})
                    	.error(function(error) {
                    		console.log(error);
                    	});
                }


            }
        }
    ]);

    app.controller('instagramCtrl', function($scope, instagram, $http){

    	$scope.pics = [];
    	$scope.busy = false;
    	var nextpage = null;

    	$scope.search = function(keyword)
    	{
    		if(keyword.length >= 1){
    			instagram.fetchByTagKeyword(keyword, function(response){
	    			console.log(response);
	    			$scope.pics = response.data;
	    			nextpage = response.pagination.next_url;
	    		});	
    		}else{
    			$scope.pics = [];
    		}
    	}

    	$scope.addMoreItems = function(){
    		if(nextpage){
    			console.log('add more items');
    			$scope.busy = true;

    			$http.jsonp(nextpage)
    			.success(function(response){
			      	for (var i = 0; i < response.data.length; i++) {
			        	$scope.pics.push(response.data[i]);
			      	}
			      	$scope.busy = false;
	    	});	
		}

    		
    	}

    });

    // app.controller("Example", function($scope, $interval, instagram) {
    //   $scope.pics = [];
    //   $scope.have = [];
    //   $scope.orderBy = "-likes.count";
    //   $scope.getMore = function() {
    //     instagram.fetchPopular(function(data) {
    //         for(var i=0; i<data.length; i++) {
    //           if (typeof $scope.have[data[i].id]==="undefined") {
    //             $scope.pics.push(data[i]) ;
    //             $scope.have[data[i].id] = "1";
    //           }
    //         }
    //     });
    //   };
    //   $scope.getMore();
      
    //     $scope.tags = [
    //         'Bootstrap', 'AngularJS', 'Instagram', 'Factory'
    //     ]
    // });