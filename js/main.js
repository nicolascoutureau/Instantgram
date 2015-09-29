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


    app.controller('instagramCtrl', function($scope, $http){

    	$scope.pics = [];
    	$scope.busy = false;
    	$scope.nextpage = null;
        $scope.showNav = false;

        $( ".searchInputCenter" ).focus();


    	$scope.addMoreItems = function(){
    		if($scope.nextpage){
    			console.log('add more items');
    			$scope.busy = true;

    			$http.jsonp($scope.nextpage)
    			.success(function(response){
			      	for (var i = 0; i < response.data.length; i++) {
			        	$scope.pics.push(response.data[i]);
			      	}
			      	$scope.busy = false;
	    	    });	
            }
    		
    	}

        //Callback de la requete sur instagram
        window.mycb = function(response){
            console.log(response);
            $scope.nextpage = response.pagination.next_url;
            angular.forEach(response.data, function(value, key) {
              $scope.pics.push(value);
            });
        }

        $scope.$watch('searchStr', function (tmpStr)
        {            
            //Enleve les espaces
            if($scope.searchStr){
                $scope.searchStr = $scope.searchStr.replace(/ /g,'').replace(/[^\w\s]/gi, '');
            }
            
            $scope.pics = [];
            $( ".searchInputCenter" ).focus();

            if (!tmpStr || tmpStr.length == 0){
                console.log('zero results');
                $( ".searchInputCenter" ).focus();
                return 0;
            }

            // if searchStr is still the same..
            // go ahead and retrieve the data
            setTimeout(function() {
                if (tmpStr === $scope.searchStr)
                {
                    $scope.searchStr = tmpStr.replace(/ /g,'');

                    var endPoint = "https://api.instagram.com/v1/tags/" + tmpStr + "/media/recent?client_id=67d226cf734844ba876821fc425d366e&callback=mycb";
                    $http.jsonp(endPoint)
                        .success(function(response) {
                            $scope.pics = response.data;
                            $scope.nextpage = response.pagination.next_url;
                            $scope.showNav = true;
                        })
                        .error(function(error) {
                            console.log(error);
                        });
                        $( ".searchInputTop" ).focus();
                }   
            },300);
        });

    });

(function($){


var maintextHeight = $('.main-text').height();
$('.main-text').css('top', '50%').css('top', '-=' + (maintextHeight));

})(jQuery)




