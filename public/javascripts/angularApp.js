var app = angular.module('flapperNews', ['ui.router']);

app.factory('posts', ['$http',function($http){
    var o = {
        posts : []
    };

    o.getAll = function(){
      return $http.get('/posts').success(function(data){
          angular.copy(data, o.posts);
      });
    };

    o.create = function(post){
        return $http.post('/posts', post).success(function(data){
            o.posts.push(data);
        })
    };

    o.upvotePost = function(post){
        return $http.put('/posts/'+post._id+"/upvote").success(function(data){
            post.upvotes ++;
        });
    };

    o.getPost = function(post_id){
        return $http.get('/posts/'+post_id).then(function(res){
            return res.data;
        });
    };

    o.addComment = function(id, comment){
        return $http.post('/posts/'+id+'/comments', comment);
    };

    o.upvoteComment = function(post_id, comment){
        return $http.put('/posts/'+post_id+'/comments/'+comment._id+'/upvote').success(function(data){
            // show in the view
            comment.upvotes ++;
        });
    }

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
                controller: "MainCtrl",
                resolve: {
                    postPromise: ['posts', function(posts){
                        return posts.getAll();
                    }]
                }
            })
            .state('posts', {
                url : '/posts/{id}',
                templateUrl : '/posts.html',
                controller: 'PostsCtrl',
                resolve: {
                    post: ['$stateParams','posts', function($stateParams,posts){
                        return posts.getPost($stateParams.id);
                    }]
                }
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

            posts.create({
                title : $scope.title,
                link : $scope.link
            });

            $scope.title = "";
            $scope.link = "";
        };

        $scope.incrementUpvotes = function(post){
            posts.upvotePost(post);
        };

    }
]);

app.controller('PostsCtrl', [
    '$scope',
    'posts',
    'post',
    function($scope, posts, post){
        // Get the post from the post factory
        $scope.post = post;

        $scope.incrementUpvotes = function(comment){
            posts.upvoteComment(post._id, comment);
        };

        $scope.addComment = function(){
            if (!$scope.author || $scope.author===""){return}
            if (!$scope.body || $scope.body===""){return}

            $scope.post.comments.push({
                author: $scope.author,
                body: $scope.body,
                upvotes: 0
            });

            posts.addComment(post._id , {
                author: $scope.author,
                body: $scope.body,
                upvotes: 0
            });

            $scope.author = "";
            $scope.body = "";
        }
    }
]);