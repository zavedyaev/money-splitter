var moneySplitterConfig = function ($routeProvider) {

    $routeProvider
        .when('/:data', {
            controller: 'MoneySplitterController',
            templateUrl: 'view/table.html'
        });
};

var MoneySplitter = angular.module('MoneySplitter', ['ngRoute']).config(moneySplitterConfig);
