'use strict';

angular.module('impactApp').controller('DemandeCategoryCtrl', function($state) {

  const { title, subhead, content, icon, model, action } = this.options;

  this.title = title;
  this.subhead = subhead;
  this.content = content;
  this.icon = icon;
  this.action = action;

  this.section = _.property(model)(this.demande.data);
  this.updatedAt = this.section && this.section.updatedAt;

  this.go = function() {
    $state.go(this.action.sref, {}, {reload:true});
  };

  this.computeMandatory = function() {
    if (this.model === 'identites.representant') {
      return RequestService.representantObligatoire(this.demande);
    } else if (this.model === 'identites.autorite') {
      return RequestService.autoriteObligatoire(this.demande);
    } else {
      return this.options.mandatory;
    }
  };

  this.mandatory = this.computeMandatory();

  this.computeCompletion = function() {
    if (this.section && this.section.__completion) {
      return 'complete';
    } else if (this.mandatory) {
      return 'error';
    }
  };

  this.completion = this.completion || this.computeCompletion();
});
