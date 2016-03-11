Saving.Collection.Perform.before.insert(function (userId, doc) {
    // move from client
    var prefix = doc.accountId;
    doc._id = idGenerator.genWithPrefix(Saving.Collection.Perform, prefix, 4);
    doc.amount = roundCurrency(doc.amount, doc.accountId);

    // Get last perform
    var getLast = lastPerform(doc.accountId);
    if (getLast) { // for the 2, 3... time
        var newCal = interestCal(getLast.performDate, doc.performDate, getLast.principalBal, doc.accountId);
        doc.dayNumber = newCal.dayNumber;
        doc.principalRe = roundCurrency(getLast.principalBal, doc.accountId);
        doc.interestRe = roundCurrency(getLast.interestBal + newCal.interest, doc.accountId);
        doc.principalBal = roundCurrency(getLast.principalBal + doc.amount, doc.accountId);
        doc.interestBal = roundCurrency(doc.interestRe, doc.accountId);
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
        doc.principalBal = roundCurrency(doc.amount, doc.accountId);
        doc.interestBal = 0;
        doc.status = 'N';
    }
});

Saving.Collection.Perform.before.update(function (userId, doc, fieldNames, modifier, options) {
    modifier.$set = modifier.$set || {};
    modifier.$set.modifiedAt = Date.now();
});
