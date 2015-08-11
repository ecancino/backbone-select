'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

var Country = Backbone.Model.extend({
  defaults: {
    alpha: '',
    name: '',
    date: new Date()
  }
});

var Countries = Backbone.Collection.extend({
  model: Country,
  url: 'https://gist.githubusercontent.com/treeskelt/98bfacc10889ab0441b6/raw/f2fc33f3df6e94fc356559c0f1b73ce4b8360ba6/countries.json'
});

var CountryView = Backbone.View.extend({
  tagName: 'option',
  initialize: function(options) {
    _.bindAll(this, 'render');
    this.model.bind('change', this.render);
  },
  render: function() {
    // Clear existing row data if needed
    var $element = $(this.el).empty();
    // Write the table columns
    $element.html(this.model.get('name'));
    $element.attr('id', this.model.get('alpha'));
    $element.attr('value', this.model.get('id'));
    $element.attr('data-created', this.model.get('date'));
    return this;
  }
});

var CountriesView = Backbone.View.extend({
  collection: null,
  el: '#countries',
  initialize: function(options) {
    this.collection = options.collection;
    _.bindAll(this, 'render');
    this.collection.bind('sync', this.render);
  },
  events: {
    'change': 'selectCountry'
  },
  selectCountry: function(e) {
    var $target = $(e.currentTarget);
    console.debug($target.val(), $target.find(':selected').text(), $target.data('created'));
  },
  render: function() {
    var $element = $(this.el);
    $element.empty();
    var container = document.createDocumentFragment();
    console.debug(this.collection.toArray().length);
    _.each(this.collection.toArray(), function(country) {
      var countryView = new CountryView({
        model: country
      });
      container.appendChild(countryView.render().el)
    });
    $element.append(container);
    return this;
  }
});

var countries = new Countries();
var countriesView = new CountriesView({
  collection: countries
});
countriesView.render();
countries.fetch();
