Meteor.startup(function () {
    if (Saving.Collection.Setting.find().count() == 0) {
        Saving.Collection.Setting.insert(
            {
                tax: {
                    currentDeposit: 4,
                    fixDeposit: 6
                },
                penaltyForFixDeposit: 1
            }
        );
    }

    Saving.Collection.Account._ensureIndex({cpanel_branchId:1,cpanel_currencyId:1,productId:1,staffId:1,accDate:1});
    Saving.Collection.Perform._ensureIndex({amount:1,accountId:1,performDate:1});
});