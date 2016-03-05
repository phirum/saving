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
});