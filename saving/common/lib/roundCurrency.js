roundCurrency = function (amount, accountId) {
    // Get account, product info
    var amountVal;
    var accountDoc = Saving.Collection.Account.findOne(accountId);
    debugger;
    /*var params = "getAccount" + accountId;
    Fetcher.setDefault(params, false);
    Fetcher.retrieve(params, 'findOneRecord', 'Saving.Collection.Account', {_id: this._id});
    var accountDoc = Fetcher.get(params);*/

    if (accountDoc.cpanel_currencyId == 'KHR') {
        amountVal = roundKhr(amount);
    } else if (accountDoc.cpanel_currencyId == 'USD') {
        amountVal = math.round(amount, 2);
    } else {
        amountVal = math.round(amount);
    }

    return amountVal;
};