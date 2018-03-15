'use strict';

angular.module('impactApp')
  .controller('AgentsEditCtrl', function($scope, $state, user, currentMdph, secteurs) {
    $scope.user = user;
    $scope.secteurs = secteurs;
    $scope.inputType = 'password';
    $scope.forms = $state.current.data.forms;

    $scope.toggleType = function() {
      if ($scope.inputType === 'password') {
        $scope.inputType = 'text';
      } else {
        $scope.inputType = 'password';
      }
    };

    $scope.toggleSelection = function(secteur) {
      const idx = user.secteurs.indexOf(secteur._id);

      if (idx > -1) {
        user.secteurs.splice(idx, 1);
      } else {
        user.secteurs.push(secteur._id);
      }
    };

    $scope.resetMongooseError = function(form, field) {
      form[field].$setValidity('mongoose', true);
    };

    $scope.update = function(form) {
      if (form.$valid) {
        if ($scope.user._id) {
          $scope.user.$changeInfo(function() {
            $state.go('^', {}, {reload: true});
          });
        } else {
          $scope.user.role = 'adminMdph';
          $scope.user.mdph = currentMdph._id;
          $scope.user.$saveAgent(
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
      }
    };

    $scope.delete = function() {
      $scope.user.$delete();
      $state.go('^', {}, {reload: true});
    };
  });
