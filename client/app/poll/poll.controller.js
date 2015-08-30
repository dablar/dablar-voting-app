'use strict';

angular.module('dablarVotingAppApp')
.controller('PollCtrl', function ($scope, $http, $routeParams) {
    $scope.poll = {};
    $scope.chartObject = {};
    $scope.chartObject.type = 'ColumnChart'; // BarChart or PieChart or ColumnChart...
    $scope.chartObject.options = {
        'title': $scope.poll.question
    };
    $scope.chartObject.data = {'cols': [
        {id: 'op', label: 'Options', type: 'string'},
        {id: 'vot', label: 'Votes', type: 'number'}
    ], 'rows': []};

    if($routeParams && $routeParams.pollId) { 
        $http.get('/api/polls/' + $routeParams.pollId).success(function(poll) {
            $scope.poll = poll;
        }).then(function () {


            for(var i = 0; i < $scope.poll.pollOptions.length; i++) {
                var column = {c: [
                    { v: $scope.poll.pollOptions[i].optionText },
                    { v: $scope.poll.pollOptions[i].votes },
                    ]};


                    $scope.chartObject.data.rows.push(column);
                }

            });
    }


    $scope.vote = function() {

        if ($scope.voteForm.voteOption === '') {
            return;
        }


        // Vote ++        
        for(var i = 0; i < $scope.poll.pollOptions.length; i++) {
            if($scope.poll.pollOptions[i]._id === $scope.voteForm.voteOption){
                $scope.poll.pollOptions[i].votes ++; //add vote in option
                $scope.chartObject.data.rows[i].c[1].v ++; //add vote in chart object
            }
        }
        
        
        $http.put('/api/polls/' + $scope.poll._id, $scope.poll).success(function(thatThingWeJustAdded) {
            $scope.poll = thatThingWeJustAdded;

            $scope.voteForm.voteOption = '';
            
        }).error(function(error) {
            console.log('error updating poll: ' + error);
            console.log($scope.poll);
        });
    };    

});
