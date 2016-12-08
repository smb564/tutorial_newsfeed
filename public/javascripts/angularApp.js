var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', [function(){
    var o = {
        posts : []
    };
    return o;
}]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: "/home.html",
                controller: "MainCtrl"
            })
            .state('posts', {
                url : '/posts/{id}',
                templateUrl : '/posts.html',
                controller: 'PostsCtrl'
            });

        $urlRouterProvider.otherwise('home');
    }
]);

app.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts){
        $scope.posts = posts.posts;

        $scope.addPost = function(){
            if(!$scope.title || $scope.title===""){return;}

            $scope.posts.push({
                title: $scope.title,
                upvotes: 0,
                link: $scope.link,
                // Add fake comment data
                comments: []
            });

            $scope.title = "";
            $scope.link = "";
        };

        $scope.incrementUpvotes = function(post){
            post.upvotes ++;
        };

    }
]);

app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',

    function($scope, $stateParams, posts){
        // Get the post from the post factory
        $scope.post = posts.posts[$stateParams.id];

        $scope.incrementUpvotes = function(comment){
            comment.upvotes ++;
        }

        $scope.addComment = function(){
            if (!$scope.author || $scope.author===""){return}
            if (!$scope.body || $scope.body===""){return}

            $scope.post.comments.push({
                author: $scope.author,
                body: $scope.body,
                upvotes: 0
            });

            $scope.author = "";
            $scope.body = "";
        }
    }
]);