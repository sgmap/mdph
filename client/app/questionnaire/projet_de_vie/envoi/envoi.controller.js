'use strict';

/**
 * @ngdoc function
 * @name impactApp.controller:EnvoiCtrl
 * @description
 * # EnvoiCtrl
 * Controller of the impactApp
 */
angular.module('impactApp')
  .controller('EnvoiCtrl', function($scope, $rootScope, $state, $http, $modal, Auth, RecapitulatifService, DroitService, FormService, RequestService, prestations) {

    $scope.justificatifStr = FormService.estRepresentant($scope.formAnswers) ?
      'de votre justificatif d\'identité ainsi que celui de la personne handicapée' :
      'de votre justificatif d\'identité';

    $scope.prestations = DroitService.compute($scope.formAnswers, prestations);
    $scope.showAdult = FormService.isAdult($scope.formAnswers);
    $scope.answersToHtml = RecapitulatifService.answersToHtml;
    $scope.currentRequest = RequestService.getCurrent()._id;

    $scope.saveCurrent = function() {
      if (Auth.isLoggedIn()) {
        RequestService.saveCurrent($scope);
      } else {
        $state.go('departement.questionnaire.projet_de_vie.envoi.modal.login');
      }
    };

    $scope.$on('requestSaved', function () {
      $http.post('api/send-mail', {mdph: $scope.currentMdph, user: Auth.getCurrentUser(), html: RecapitulatifService.answersToHtml()}).success(function(data) {
        console.log(data);
        $modal.open({
          templateUrl: 'app/questionnaire/projet_de_vie/envoi/envoiModal.html',
          resolve: {
            currentMdph: function() {
              return $scope.currentMdph.name;
            }
          },
          controller: function($scope, $modalInstance, currentMdph) {
            $scope.ok = function() {
              $modalInstance.close();
              if(currentMdph==='Nord'){
                $state.go('liste_demandes.demande.recapitulatif', {shortId: RequestService.getCurrent().shortId});
              } else {
                $state.go('liste_demandes.demande.obligatoire', {shortId: RequestService.getCurrent().shortId, step: 'obligatoire'});
              }
            };
          }
        }).error(function(data) {
          console.err(data);
        });
      });
    });
  });
