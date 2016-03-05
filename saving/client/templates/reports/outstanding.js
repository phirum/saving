/********** Form **************/
Template.saving_outstandingReport.onCreated(function () {
    createNewAlertify('exchange');
});

Template.saving_outstandingReport.onRendered(function () {
    var name = $('[name="date"]');
    DateTimePicker.date(name);
});

Template.saving_outstandingReport.events({
    'click .exchangeAddon': function (e, t) {
        alertify.exchange(fa("plus", "Exchange"), renderTemplate(Template.cpanel_exchangeInsert));
    }
});

/********** Generate **************/
var state = new ReactiveObj();
Template.saving_outstandingReportGen.helpers({
    data: function () {
        var query=Router.current().params.query;
        var params = "getOutstandingReport";
        Fetcher.setDefault(params, false);
        Fetcher.retrieve(params, 'getOutstandingReport', query);
        return Fetcher.get(params);
    }

});
