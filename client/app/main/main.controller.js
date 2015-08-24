'use strict';

angular.module('dablarVotingAppApp')
.controller('MainCtrl', function($scope, $http, $routeParams) {
  $scope.awesomeThings = [];
  $scope.polls = [];
  $scope.optionPlaceholders = ['Option 1', 'Option 2'];


  

  $http.get('/api/things').success(function(awesomeThings) {
    $scope.awesomeThings = awesomeThings;
  });



  $http.get('/api/polls').success(function(polls) {
    $scope.polls = polls;
  });

  if($routeParams && $routeParams.pollId){
    $http.get('/api/polls/' + $routeParams.pollId).success(function(poll) {
      $scope.poll = poll;
      console.log(poll);
    });
  }


  $scope.addPoll = function() {

    if ($scope.newPoll === '') {
      return;
    }
    $scope.polls.push($scope.newPoll);
    $scope.newPoll.author = $scope.getCurrentUser()._id;

      // from Object to Array,,, to fit with the schema model.
      $scope.newPoll.pollOptions=  
      Object.keys($scope.newPoll.pollOptions).map(function(k) 
        { return $scope.newPoll.pollOptions[k] });


      $http.post('/api/polls', $scope.newPoll).success(function(thatThingWeJustAdded) {
        $scope.polls.pop(); // let's lose that id-lacking newThing 
        $scope.polls.push(thatThingWeJustAdded); // and add the id-having newThing!

        $scope.newPoll.question = '';
        $scope.newPoll.pollOptions = {};
        $scope.optionPlaceholders = ['Option 1', 'Option 2'];

        $scope.pollCreatedMsg = '/'+thatThingWeJustAdded._id;
      });

    };    

    $scope.addOption = function() {
      $scope.optionPlaceholders.push('New option');
    }

    $scope.deletePoll = function(idPoll) {
      console.log('borrando poll ' + idPoll);
      $http.delete('/api/polls/' + idPoll).success(function() {
        $scope.polls.splice($scope.polls.indexOf(idPoll),1);
      }).error(function(error) {
        console.log('error deleting poll: ' + idPoll);
      }).then(function() {
        //console.log('then is called');
      });
    }

    $scope.addThing = function() {
      if ($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });
