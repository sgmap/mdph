'use strict';

angular.module('impactApp')
  .controller('AgentsEditCtrl', function($scope, $state, user, currentMdph) {
    $scope.user = user;

    $scope.update = function(form) {
      if ($scope.user._id) {
        $scope.user.$changeInfo(function() {
          $state.go('^', {}, {reload: true});
        });
      } else {
        $scope.user.role = 'adminMdph';
        $scope.user.mdph = currentMdph._id;
        $scope.user.$save(
          function() {
            $state.go('^', {}, {reload: true});
          },

          function(err) {
            err = err.data;
            $scope.errors = {};

            // Update validity of form fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });
      }
    };

    $scope.delete = function() {
      $scope.user.$delete();
      $state.go('^', {}, {reload: true});
    };
  });
