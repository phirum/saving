Meteor.methods({
    getDepositReport:function(arg){
        var self = arg;
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
        var content = [];
        var date = s.words(self.date, ' To ');
        //var fDate = moment(date[0], 'YYYY-MM-DD').toDate();
        //var tDate = moment(date[1], 'YYYY-MM-DD').add(1, 'day').toDate();

        // Config fx
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
        var getAccount = Saving.Collection.Account.find(accountSelector)
            .map(function (obj) {
                return obj._id;
            });

        // Get content
        var getPerform = Saving.Collection.Perform.find({
            amount: {$gt: 0},
            accountId: {$in: getAccount},
            performDate: {$gte: date[0], $lte: date[1]}
        }, {
            sort: {performDate: 1}
        });

        var index = 1;
        var totalAmount = {KHR: 0, USD: 0, THB: 0, all: 0};
        getPerform.forEach(function (obj) {
            var account = Saving.Collection.Account.findOne(obj.accountId);
            var client = Saving.Collection.Client.findOne(account.clientId);
            var product = Saving.Collection.Product.findOne(account.productId);
            var staff = Saving.Collection.Staff.findOne(account.staffId);
            var amount = obj.amount;

            // Check currency
            if (account.cpanel_currencyId == 'KHR') {
                totalAmount.KHR += amount;
                totalAmount.all += fx.convert(amount, {from: 'KHR', to: 'USD'});
            } else if (account.cpanel_currencyId == 'USD') {
                totalAmount.USD += amount;
                totalAmount.all += amount;
            } else {
                totalAmount.THB += amount;
                totalAmount.all += fx.convert(amount, {from: 'THB', to: 'USD'});
            }

            content.push(
                {
                    index: index,
                    accountId: obj.accountId,
                    client: client,
                    product: account.productId,
                    activeDate: obj.performDate,
                    amount: numeral(amount).format('0,0.00'),
                    currency: account.cpanel_currencyId,
                    status: obj.status,
                    voucherId: obj.voucherId,
                    staff: staff,
                    branch: obj.cpanel_branchId
                }
            );
            index += 1;
        });

        if (content.length > 0) {
            data.content = content;
            data.footer = [
                {
                    col1: numeral(totalAmount.KHR).format('0,0.00'),
                    col2: numeral(totalAmount.USD).format('0,0.00'),
                    col3: numeral(totalAmount.THB).format('0,0.00'),
                    col4: numeral(totalAmount.all).format('0,0.00')
                }
            ];

            return data;
        } else {
            data.content.push({index: 'no results'});
            return data;
        }
    }
});