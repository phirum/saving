roundCurrency = function (amount, accountId) {
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