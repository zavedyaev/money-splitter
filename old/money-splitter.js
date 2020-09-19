var moneySplitterConfig = function ($routeProvider) {

    $routeProvider
        .when('/', {
            controller: 'MoneySplitterController',
            templateUrl: 'view/table.html'
        })
        .when('/:data', {
            controller: 'MoneySplitterController',
            templateUrl: 'view/table.html'
        });
};

var MoneySplitter = angular.module('MoneySplitter', ['ngRoute']).config(moneySplitterConfig);

function initFloatThead() {
    var $table = $('#splitter-table');
    $table.floatThead({
        responsiveContainer: function($table){
            return $table.closest('.table-responsive');
        },
        autoReflow: true
    });
}