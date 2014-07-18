'use strict';

/**
 * @ngdoc function
 * @name impactApp.controller:VosAttentesCtrl
 * @description
 * # VosAttentesCtrl
 * Controller of the impactApp
 */
angular.module('impactApp')
  .controller('VosAttentesScolairesCtrl', function ($scope) {
    $scope.subtitle = 'Vos attentes en matière de vie scolaire / étudiante';

    if (angular.isUndefined($scope.sectionModel.attentes)) {
      $scope.sectionModel.attentes = {
        label: 'Vos attentes en matière de vie scolaire / étudiante',
        answers: {}
      };
    }

    $scope.subSectionModel = $scope.sectionModel.attentes.answers;
  });
