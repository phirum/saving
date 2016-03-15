Meteor.methods({
    getOutstandingReport: function (arg) {
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


        var getData = getOutStandingData(self);
        data.content = getData.content;
        data.footer = getData.footer;

        return data;

    }
});


function getOutStandingData(params) {
    var data = {};
    var self = params;
    var content = [];

    // Config fx
    var exchange = Cpanel.Collection.Exchange.findOne(self.exchange);

    fx.base = exchange.base;
    fx.rates = exchange.rates;

    // Get account selector
    var accountSelector = {};
    if (!_.isEmpty(self.branch)) {
        accountSelector.cpanel_branchId = {$regex: self.branch};
    }
    if (!_.isEmpty(self.currency)) {
        accountSelector.cpanel_currencyId = {$regex: self.currency};
    }
    if (!_.isEmpty(self.product)) {
        accountSelector.productId = {$regex: self.product};
    }
    if (!_.isEmpty(self.staff)) {
        accountSelector.staffId = {$regex: self.staff};
    }
    accountSelector.accDate = {$lte: self.date};

    var getAccount = Saving.Collection.Account.find(accountSelector, {sort: {_id: 1}});

    var index = 1;
    var totalPrincipal = {KHR: 0, USD: 0, THB: 0, all: 0};
    var totalInterest = {KHR: 0, USD: 0, THB: 0, all: 0};
    var totalAll = {KHR: 0, USD: 0, THB: 0, all: 0};

    getAccount.forEach(function (obj) {
        // Get last performance
        var getLast = lastPerform(obj._id, self.date);

        //console.log(getLast);

        if (!(_.isUndefined(getLast) || getLast.status == 'F')) {
           // var client = Saving.Collection.Client.findOne(obj.clientId);
           // var product = Saving.Collection.Product.findOne(obj.productId);
           // var staff = Saving.Collection.Staff.findOne(obj.staffId);

            var principal = getLast.principalBal;
            var cal = interestCal(getLast.performDate, self.date, principal, obj._id);
            var interest = getLast.interestBal + cal.interest;
            var total = principal + interest;

            // Check currency
            if (obj.cpanel_currencyId == 'KHR') {
                totalPrincipal.KHR += principal;
                totalInterest.KHR += interest;
                totalAll.KHR += total;

                totalPrincipal.all += fx.convert(principal, {from: 'KHR', to: 'USD'});
                totalInterest.all += fx.convert(interest, {from: 'KHR', to: 'USD'});
                totalAll.all += fx.convert(total, {from: 'KHR', to: 'USD'});
            } else if (obj.cpanel_currencyId == 'USD') {
                totalPrincipal.USD += principal;
                totalInterest.USD += interest;
                totalAll.USD += total;

                totalPrincipal.all += principal;
                totalInterest.all += interest;
                totalAll.all += total;
            } else {
                totalPrincipal.THB += principal;
                totalInterest.THB += interest;
                totalAll.THB += total;

                totalPrincipal.all += fx.convert(principal, {from: 'THB', to: 'USD'});
                totalPrincipal.all += fx.convert(interest, {from: 'THB', to: 'USD'});
                totalAll.all += fx.convert(total, {from: 'THB', to: 'USD'});
            }

            // Check total amount
            if (total > 0) {
                content.push(
                    {
                        index: index,
                        accountId: obj._id,
                        clientKhName: obj._client.khName,
                        clientEnName: obj._client.enName,
                        product: obj.productId,
                        activeDate: obj.accDate,
                        maturityDate: obj.maturityDate,
                        principal: numeral(principal).format('0,0.00'),
                        interest: numeral(interest).format('0,0.00'),
                        total: numeral(total).format('0,0.00'),
                        currency: obj.cpanel_currencyId,
                        staffName: obj._staff.name,
                        branch: obj.cpanel_branchId
                    }
                );
                index += 1;
            }
        }
    });

    //console.log(moment() + ' : ' + content.length);

    if (content.length > 0) {
        data.content = content;
        data.footer = [
            {
                col1: 'KHR',
                col2: numeral(totalPrincipal.KHR).format('0,0.00'),
                col3: numeral(totalInterest.KHR).format('0,0.00'),
                col4: numeral(totalAll.KHR).format('0,0.00')
            },
            {
                col1: 'USD',
                col2: numeral(totalPrincipal.USD).format('0,0.00'),
                col3: numeral(totalInterest.USD).format('0,0.00'),
                col4: numeral(totalAll.USD).format('0,0.00')
            },
            {
                col1: 'THB',
                col2: numeral(totalPrincipal.THB).format('0,0.00'),
                col3: numeral(totalInterest.THB).format('0,0.00'),
                col4: numeral(totalAll.THB).format('0,0.00')
            },
            {
                col1: 'Convert to USD',
                col2: numeral(totalPrincipal.all).format('0,0.00'),
                col3: numeral(totalInterest.all).format('0,0.00'),
                col4: numeral(totalAll.all).format('0,0.00')
            }
        ];

        return data;
    } else {
        content = [{index: 'no results'}];
        data.content = content;
        return data;
    }
}
