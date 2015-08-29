'use strict';

angular.module('dablarVotingAppApp')
.controller('PollCtrl', function ($scope, $http, $routeParams) {
    $scope.poll = {};

    if($routeParams && $routeParams.pollId) { 
        $http.get('/api/polls/' + $routeParams.pollId).success(function(poll) {
            $scope.poll = poll; 
        });
    }


    $scope.vote = function() {

        if ($scope.voteForm.voteOption === '') {
            return;
        }

 
        // Vote ++        
        for(var i = 0; i < $scope.poll.pollOptions.length; i++) {
            if($scope.poll.pollOptions[i]._id == $scope.voteForm.voteOption)
                $scope.poll.pollOptions[i].votes ++;
        }
        
        
        $http.put('/api/polls/' + $scope.poll._id, $scope.poll).success(function(thatThingWeJustAdded) {
            console.log("Updated: ");
            console.log(thatThingWeJustAdded);
            $scope.poll = thatThingWeJustAdded;

            $scope.voteForm.voteOption = '';
            
        }).error(function(error) {
            console.log('error updating poll: ');
            console.log($scope.poll);
        });
    };    

});
