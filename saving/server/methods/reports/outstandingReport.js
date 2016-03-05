Meteor.methods({
    getOutstandingReport:function(arg){
            var self = arg;
            var data = {
                title: {},
                header: [],
                content: [],
                footer: []
            };

            /********* Title *********/
            var company = Cpanel.Collection.Company.findOne();
            data.title = {
                company: company,
                date: self.date
            };

            /********* Header ********/
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

    }
});
