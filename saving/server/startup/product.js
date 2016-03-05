Meteor.startup(function () {
    if (Saving.Collection.Product.find().count() == 0) {
        var data = [
            // Current deposit
            {
                _id: '101',
                name: 'Easy Deposit',
                rate: 12
            },
            {
                _id: '102',
                name: 'Staff Deposit',
                rate: 18
            },
            // Fix deposit
            {
                _id: '201',
                name: 'Active Interest Fix Deposit (6 <= Term <=12 Months)',
                rate: 14
            },
            {
                _id: '202',
                name: 'Active Interest Fix Deposit (12 < Term <=24 Months)',
                rate: 16
            },
            {
                _id: '203',
                name: 'Achievement Fix Deposit (6 <= Term <=12 Months)',
                rate: 16
            },
            {
                _id: '204',
                name: 'Achievement Fix Deposit (12 < Term <=24 Months)',
                rate: 18
            }
        ];

        _.forEach(data, function (obj) {
            Saving.Collection.Product.insert(obj);
        });
    }
});