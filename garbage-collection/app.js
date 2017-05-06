(function(){

    var app = angular.module('app', []);

    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['**']);
    });

    // controller
    app.controller('MainController', MainController);
    MainController.$inject = ['GarbageDayRules'];
    function MainController(GarbageDayRules){
        var main = this;

        main.startOfWeekDisplay = GarbageDayRules.startOfWeek.format('MMMM Do, YYYY');
        main.trashDay = GarbageDayRules.trashDay();
        main.hasHolidayThisWeek = GarbageDayRules.hasHolidayThisWeek();
        main.trashDayPushedBack = GarbageDayRules.trashDayPushedBack();
        main.trashExceptionReason = GarbageDayRules.trashExceptionReason();
    }

    // services
    app.factory('GarbageDayRules', GarbageDayRules);
    GarbageDayRules.$inject = ['GarbageDateExceptions'];
    function GarbageDayRules (GarbageDateExceptions) {

        var startOfWeek = moment().startOf('week');
        var endOfWeek = moment().endOf('week');
        var normalTrashDay = "Thursday";
        var currentWeekException = null;

        init();
        return {
            startOfWeek: startOfWeek,
            hasHolidayThisWeek:hasHolidayThisWeek,
            trashDay: trashDay,
            trashDayPushedBack: trashDayPushedBack,
            trashExceptionReason: trashExceptionReason
        };


        function init(){
            GarbageDateExceptions.forEach(function(rule){
                if(rule.trashDay.isBetween(startOfWeek, endOfWeek, null, [])){
                    currentWeekException = rule;
                }
            });
        }

        function hasHolidayThisWeek(){
            return !!currentWeekException;
        }

        function trashDay(){
            return currentWeekException ? currentWeekException.trashDay.format('dddd') : normalTrashDay;
        }

        function trashDayPushedBack(){
            return trashDay() !== normalTrashDay;
        }

        function trashExceptionReason(){
            return currentWeekException ? currentWeekException.holiday : '';
        }
    }

    app.factory('GarbageDateExceptions', GarbageDateExceptions);
    function GarbageDateExceptions () {

        var exceptionList = [
            {
                trashDay: '5/4/2017',
                holiday: 'President\'s Day'
            },
            {
                trashDay: '6/2/2017',
                holiday: 'Memorial Day'
            },
            {
                trashDay: '7/7/2017',
                holiday: 'Independence Day'
            },
            {
                trashDay: '9/8/2017',
                holiday: 'Labor Day'
            },
            {
                trashDay: '11/24/2017',
                holiday: 'Thanksgiving Day'
            },
            {
                trashDay: '12/28/2017',
                holiday: 'Christmas Day'
            },
            {
                trashDay: '1/5/2018',
                holiday: 'New Year\'s Day'
            }
        ];

        exceptionList.forEach(function(rule){
           rule.trashDay = moment(new Date(rule.trashDay));
        });

        return exceptionList;
    }

})();