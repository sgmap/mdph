'use strict';

/**
 * @ngdoc function
 * @name impactApp.controller:PoleEmploiCtrl
 * @description
 * # PoleEmploiCtrl
 * Controller of the impactApp
 */
angular.module('impactApp')
  .controller('PoleEmploiCtrl', function($scope, $state) {

    $scope.subtitle = $scope.estRepresentant() ?
      'Est-il inscrit à Pôle Emploi ?' : 'Etes-vous inscrit à Pôle Emploi ?';

    if (angular.isUndefined($scope.sectionModel.poleEmploi)) {
      $scope.sectionModel.poleEmploi = {};
    }

    $scope.question = {
      model: 'poleEmploi',
      answers: [
        {
          label: 'Non',
          value: false
        },
        {
          label: 'Oui',
          value: true,
          detailUrl: 'views/partials/form_precisez_date.html',
          detail: $scope.sectionModel.poleEmploi.detail,
          detailLabel: 'Depuis quand ?'
        }
      ]
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };

    $scope.dateOptions = {
      startingDay: 1
    };

    $scope.isNextStepDisabled = function() {
      var model = $scope.sectionModel.poleEmploi;
      if (angular.isUndefined(model)) {
        return true;
      }

      if (model.detailUrl && !model.detail) {
        return true;
      }

      return false;
    };

    $scope.nextStep = function() {
      $state.go('^.^.projet_professionnel.description');
    };
  });
