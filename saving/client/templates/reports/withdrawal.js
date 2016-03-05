/********** Form **************/
Template.saving_withdrawalReport.onCreated(function () {
    createNewAlertify('exchange');
});

Template.saving_withdrawalReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.dateRange(name);
});

Template.saving_withdrawalReport.events({
    'click .exchangeAddon': function (e, t) {
        alertify.exchange(fa("plus", "Exchange"), renderTemplate(Template.cpanel_exchangeInsert));
    }
});


/********** Generate **************/
Template.saving_withdrawalReportGen.helpers({
    data: function () {
        var query=Router.current().params.query;
        var params = "getWithdrawalReport";
        Fetcher.setDefault(params, false);
        Fetcher.retrieve(params, 'getWithdrawalReport', query);
        return Fetcher.get(params);
    }
});
