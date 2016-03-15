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
     },
/* data: function () {
        var self = this;
        var data = {
            title: {},
            header: [],
            content: [],
            footer: []
        };


        var company = Cpanel.Collection.Company.findOne();
        data.title = {
            company: company,
            date: self.date
        };


        var exchange = Cpanel.Collection.Exchange.findOne(self.exchange);
        data.header = [
            {col1: 'Branch: ' + self.branch, col2: 'Staff: ' + self.staff},
            {col1: 'Currency: ' + self.currency, col2: 'Exchange: ' + EJSON.stringify(exchange.rates)},
            {col1: 'Product: ' + self.product, col2: ''}
        ];

        var getData = ReactiveMethod.call('saving_outstandingReport', self);
        data.content = getData.content;
        data.footer = getData.footer;

        return data;


    }*/

});
