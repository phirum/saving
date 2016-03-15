Saving.Collection.Perform.before.insert(function (userId, doc) {
    // move from client
    var prefix = doc.accountId;
    doc._id = idGenerator.genWithPrefix(Saving.Collection.Perform, prefix, 4);
    // Get last perform
    if (doc.amount > 0) {
        var getLast = lastPerform(doc.accountId);
        if (getLast) { // for the 2, 3... time
            var newCal = interestCalServer(getLast.performDate, doc.performDate, getLast.principalBal, doc.accountId);
            doc.dayNumber = newCal.dayNumber;
            doc.principalRe = roundCurrencyServer(getLast.principalBal, doc.accountId);
            doc.interestRe = roundCurrencyServer(getLast.interestBal + newCal.interest, doc.accountId);
            doc.principalBal = roundCurrencyServer(getLast.principalBal + doc.amount, doc.accountId);
            doc.interestBal = roundCurrencyServer(doc.interestRe, doc.accountId);
            doc.status = 'A';
        } else { // for the 1st time
            // check with account date
            var accountDoc = Saving.Collection.Account.findOne(doc.accountId);
            if (accountDoc.accDate != doc.performDate) {
                /* alertify.warning('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
                 return false;*/
                throw new Meteor.Error('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
            }
            doc.dayNumber = 0;
            doc.principalRe = 0;
            doc.interestRe = 0;
            doc.principalBal = roundCurrencyServer(doc.amount, doc.accountId);
            doc.interestBal = 0;
            doc.status = 'N';
        }
    } else {
        doc.amount = doc.amount * -1;
        var accountDoc = Saving.Collection.Account.findOne(doc.accountId);
        var settingDoc = Saving.Collection.Setting.findOne();
        var taxRate = settingDoc.tax.currentDeposit;
        if (s.startsWith(accountDoc.productId, '2')) {
            taxRate = settingDoc.tax.fixDeposit;
        }
        doc.status = 'P';

        if (doc.amount > doc.interestRe) {
            doc.principalBal = roundCurrencyServer(doc.principalRe - (doc.amount - doc.interestRe), doc.accountId);
            doc.interestBal = 0;
            if (doc.principalBal == 0) {
                doc.status = 'F';
            }

            // Cal tax amount
            doc.withFields.tax = roundCurrencyServer(doc.interestRe * taxRate / 100, doc.accountId);

        } else {
            doc.principalBal = doc.principalRe;
            doc.interestBal = roundCurrencyServer(doc.interestRe - doc.amount, doc.accountId);

            // Cal tax amount
            doc.withFields.tax = roundCurrencyServer(doc.amount * taxRate / 100, doc.accountId);
        }
        doc.amount = doc.amount * -1;

    }
});

Saving.Collection.Perform.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};

    //need to check about direct update when update account.
    if (modifier.$set.amount) {
        var getLast = lastPerformExcept(modifier.$set.accountId, doc._id);
        if (getLast) { // for the 2, 3... time
            var newCal = interestCalServer(getLast.performDate, modifier.$set.performDate, getLast.principalBal, modifier.$set.accountId);

            modifier.$set.dayNumber = newCal.dayNumber;
            modifier.$set.principalRe = roundCurrencyServer(getLast.principalBal, modifier.$set.accountId);
            modifier.$set.interestRe = roundCurrencyServer(getLast.interestBal + newCal.interest, modifier.$set.accountId);
            modifier.$set.principalBal = roundCurrencyServer(getLast.principalBal + modifier.$set.amount, modifier.$set.accountId);
            modifier.$set.interestBal = roundCurrencyServer(modifier.$set.interestRe, modifier.$set.accountId);
            modifier.$set.status = 'A';
        }
        else {
            // check with account date
            var accountDoc = Saving.Collection.Account.findOne(modifier.$set.accountId);
            if (accountDoc.accDate != modifier.$set.performDate) {
                //alertify.warning('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
                throw new Meteor.Error('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
            }

            modifier.$set.dayNumber = 0;
            modifier.$set.principalRe = 0;
            modifier.$set.interestRe = 0;
            modifier.$set.principalBal = roundCurrencyServer(modifier.$set.amount, modifier.$set.accountId);
            modifier.$set.interestBal = 0;
            modifier.$set.status = 'N';
        }
    }
});


roundCurrencyServer = function (amount, accountId) {
    // Get account, product info
    var amountVal;
    var accountDoc = Saving.Collection.Account.findOne(accountId);

    if (accountDoc.cpanel_currencyId == 'KHR') {
        amountVal = roundKhr(amount);
    } else if (accountDoc.cpanel_currencyId == 'USD') {
        amountVal = math.round(amount, 2);
    } else {
        amountVal = math.round(amount);
    }

    return amountVal;
};

interestCalServer = function (startDate, endDate, amount, accountId) {
    var start = moment(startDate, 'YYYY-MM-DD');
    var end = moment(endDate, 'YYYY-MM-DD');
    var dayNumber = end.diff(start, 'days');

    // Get account, product info
    var accountDoc = Saving.Collection.Account.findOne(accountId);
    var getProduct = Saving.Collection.Product.findOne(accountDoc.productId);

    var interest = math.round(amount * dayNumber * ((getProduct.rate / 100) / 365), 2);
    interest = roundCurrencyServer(interest, accountId);

    return {
        dayNumber: dayNumber,
        interest: interest,
        rate: getProduct.rate
    };
};

interestCalWithRateServer = function (startDate, endDate, amount, rate, accountId) {
    var start = moment(startDate, 'YYYY-MM-DD');
    var end = moment(endDate, 'YYYY-MM-DD');
    var dayNumber = end.diff(start, 'days');

    var interest = math.round(amount * dayNumber * ((rate / 100) / 365), 2);
    interest = roundCurrencyServer(interest, accountId);

    return {
        dayNumber: dayNumber,
        interest: interest
    };
};