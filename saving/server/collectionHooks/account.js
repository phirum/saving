Saving.Collection.Account.before.insert(function (userId, doc) {
    // move from client
    var currencyNum = '';
    if (doc.cpanel_currencyId) {
        var currencyDoc = Cpanel.Collection.Currency.findOne(doc.cpanel_currencyId);
        currencyNum = currencyDoc.num;
    }
    var prefix = doc.clientId + currencyNum + doc.productId;
    doc._id = idGenerator.genWithPrefix(Saving.Collection.Account, prefix, 3);

    var cycle = 1;
    var lastAccount = Saving.Collection.Account.findOne({clientId: doc.clientId}, {sort: {cycle: -1}});
    if (lastAccount) {
        cycle = lastAccount.cycle + 1;
    }
    doc.cycle = cycle;

});