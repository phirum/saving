/************* Form *************/
Template.saving_historyReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
    createNewAlertify(['clientSearchList']);
});

Template.saving_historyReport.helpers({
    accounts:function(){
        var clientId = Session.get('clientIdOnForm');
        return ReactiveMethod.call('getAccountForClient',clientId);
    }
});
Template.saving_historyReport.events({
    'click [name="clientId"]': function () {
        var data = {data: $('[name="clientId"]').val()};
        alertify.clientSearchList(fa("list", "Client Search List"), renderTemplate(Template.saving_clientSearch, data));
    },
    'change [name="clientId"]': function (e, t) {
        var clientId = t.$('[name="clientId"]').val();
        Session.set('clientIdOnForm', clientId);
    }
});

/************* Generate *************/
Template.saving_historyReportGen.helpers({
    data: function () {
        var query = Router.current().params.query;
        var params = "getHistoryReport";
        Fetcher.setDefault(params, false);
        Fetcher.retrieve(params, 'getHistoryReport', query);
        return Fetcher.get(params);
    }
});

