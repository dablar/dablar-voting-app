'use strict';

angular.module('dablarVotingAppApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:pollId', {
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl'
      });
  });
