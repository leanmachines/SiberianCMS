App.config(function($routeProvider) {

    $routeProvider.when(BASE_URL+"/media/mobile_gallery_video_list/index/value_id/:value_id", {
        controller: 'VideoListController',
        templateUrl: BASE_URL+"/media/mobile_gallery_video_list/template",
        depth: 1,
        code: "video"
    });

}).controller('VideoListController', function($window, $scope, $routeParams, Sidebar, Url, Video) {

    $scope.$watch("isOnline", function(isOnline) {
        $scope.has_connection = isOnline;
        if(isOnline) {
            $scope.loadContent();
        }
    });

    $scope.is_loading = true;
    $scope.sidebar = new Sidebar("video");
    $scope.videos = new Array();
    $scope.value_id = Video.value_id = $routeParams.value_id;
    $scope.template_view = Url.get("/media/mobile_gallery_video_view/template");

    $scope.loadContent = function() {

        Video.findAll().success(function(data) {

            $scope.header_right_button = {
                action: function() {
                    if(!$scope.sidebar.current_item) return;
                    $scope.sidebar.show = !$scope.sidebar.show
                },
                picto_url: data.header_right_button.picto_url,
                hide_arrow: true
            };

            $scope.sidebar.collection = data.galleries;
            $scope.page_title = data.page_title;
            $scope.sidebar.showFirstItem(data.galleries)
        }).finally(function() {
            $scope.is_loading = false;
        });
    }

    $scope.sidebar.showItem= function(item) {

        if($scope.sidebar.current_item == item) return;
        $scope.sidebar.current_item = null;
        $scope.loadItem(item, 1);

    };

    $scope.loadItem = function(item, offset) {

        $scope.removeScrollEvent();

        item.current_offset = offset;
        $scope.sidebar.show = false;
        Video.find(item).success(function(data) {
            if(!$scope.sidebar.current_item) {
                $scope.sidebar.current_item = item;
                $scope.collection = data.videos;
            } else {
                for(var i = 0; i < data.videos.length; i++) {
                    $scope.collection.push(data.videos[i]);
                }
            }

            if(data.videos.length) {
                $scope.bindScrollEvent();
            }

        }).error(function() {

        }).finally(function() {
            $scope.is_loading = false;
        });
    };

    $scope.loadMore = function() {
        var offset = $scope.collection[$scope.collection.length-1].offset+1;
        $scope.loadItem($scope.sidebar.current_item, offset);
    };

    $scope.removeScrollEvent = function() {
        angular.element($window).unbind('scroll');
    }

    $scope.bindScrollEvent = function() {
        $scope.show_loader_more = false;
        angular.element($window).bind('scroll', function() {
            if(this.pageYOffset >= $window.getMaxScrollY()) {
                $scope.show_loader_more = true;
                $scope.loadMore();
            }
        });
    }

});