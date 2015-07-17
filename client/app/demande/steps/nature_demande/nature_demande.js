'use strict';

angular.module('impactApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('departement.demande.nature_demande', {
        url: '/nature_demande',
        templateUrl: 'app/demande/steps/section-list.html',
        controller: 'StepsCtrl',
        resolve: {
          stepSections: function(sections) {
            return _.filter(sections, {group: 'renouvellement'});
          }
        }
      });
  });
