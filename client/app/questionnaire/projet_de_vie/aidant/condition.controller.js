'use strict';

angular.module('impactApp')
  .controller('ConditionAidantCtrl', function($scope, $state, QuestionService) {

    $scope.question = QuestionService.get('aidant', 'condition', $scope.formAnswers);

    var next = function() {
      if ($scope.sectionModel.condition) {
        $state.go('^.situation.lien');
      } else {
        $state.go('^.^.envoi');
      }
    };

    $scope.nextStep = function() {
      next();
    };
  });
