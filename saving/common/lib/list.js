/**
 * List
 */
Saving.List = {
    gender: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'Male', value: 'M'});
        list.push({label: 'Female', value: 'F'});

        return list;
    },
    genderNoSelectOne: function () {
        var list = [];
        list.push({label: 'Male', value: 'M'});
        list.push({label: 'Female', value: 'F'});

        return list;
    },
    idType: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'National ID', value: 'N'});
        list.push({label: 'Family Book', value: 'F'});
        list.push({label: 'Passport', value: 'P'});
        list.push({label: 'Drivers Licence', value: 'D'});
        list.push({label: 'Government Issued Id', value: 'G'});
        list.push({label: 'Birth Certificate', value: 'B'});
        list.push({label: 'Resident Book', value: 'R'});
        list.push({label: 'Other', value: 'O'});

        return list;
    },
    currency: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Cpanel.Collection.Currency.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' (' + obj.num + ')', value: obj._id})
            });

        return list;
    },
    product: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Saving.Collection.Product.find({}, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' | Rate: ' + obj.rate,
                    value: obj._id
                })
            });

        return list;
    },
    term: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var productId = Session.get('productIdOnForm');

        if (productId == '201' || productId == '203') {
            for (var i = 6; i <= 12; i++) {
                list.push({label: i + ' Months', value: i});
            }
        } else if (productId == '202' || productId == '204') {
            for (var i = 13; i <= 24; i++) {
                list.push({label: i + ' Months', value: i});
            }
        } else {
            list.push({label: 'NaN', value: 0});
        }

        return list;
    },
    accType: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'Single', value: 'S'});
        //list.push({label: 'Join', value: 'J'});

        return list;
    },
    position: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});
        list.push({label: 'Saving Office', value: 'SO'});

        return list;
    },
    staff: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {cpanel_branchId: Session.get('currentBranch')};
        Saving.Collection.Staff.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' (' + obj.gender + ')',
                    value: obj._id
                })
            });

        return list;
    },
    client: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {cpanel_branchId: Session.get('currentBranch')};
        Saving.Collection.Client.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.khName + ' (' + obj.gender + ')',
                    value: obj._id
                })
            });

        return list;
    },
    account: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {cpanel_branchId: Session.get('currentBranch')};
        Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                var getClient = Saving.Collection.Client.findOne(obj.clientId);
                var product = Saving.Collection.Product.findOne(obj.productId);

                list.push({
                    label: obj._id + ' | ' + getClient.khName + ' (' + getClient.gender + ')'
                    + ' | Product: ' + product.name,
                    value: obj._id
                })
            });

        return list;
    },
    accountForDeposit: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {
            cpanel_branchId: Session.get('currentBranch'),
            $or: [
                {productId: {$not: {$regex: /^2/}}},
                {_performCount: 0}
            ]
        };
        Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                var product = Saving.Collection.Product.findOne(obj.productId);

                list.push({
                    label: obj._id + ' | ' + obj._client.khName + ' (' + obj._client.gender + ')'
                    + ' | SO: ' + obj._staff.name,
                    value: obj._id
                })
            });

        return list;
    },
    accountForWithdrawal: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var selector = {
            cpanel_branchId: Session.get('currentBranch')
        };
        Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .forEach(function (obj) {
                var getLast = lastPerform(obj._id);
                if (!_.isUndefined(getLast)) {
                    // Check status = F
                    if (getLast.status != 'F') {
                        var product = Saving.Collection.Product.findOne(obj.productId);

                        list.push({
                            label: obj._id + ' | ' + obj._client.khName + ' (' + obj._client.gender + ')'
                            + ' | SO: ' + obj._staff.name,
                            value: obj._id
                        })
                    }
                }
            });

        return list;
    },
    backupAndRestoreTypes: function () {
        return [
            {value: '', label: 'Select One'},
            {value: 'Setting', label: 'Setting'},
            {value: 'Default', label: 'Default'},
            {value: 'Setting,Default', label: 'Setting And Default'}
        ];
    },
    branchForUser: function (selectOne, userId) {
        var list = [];
        if (!_.isEqual(selectOne, false)) {
            list.push({label: "All", value: ""});
        }
        var userId = _.isUndefined(userId) ? Meteor.userId() : userId;
        Meteor.users.findOne(userId).rolesBranch
            .forEach(function (branch) {
                var label = Cpanel.Collection.Branch.findOne(branch).enName;
                list.push({label: label, value: branch});
            });
        return list;
    }
};