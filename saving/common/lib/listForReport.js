/**
 * List
 */
Saving.ListForReport = {
    branch: function () {
        var list = [];
        list.push({label: "(Select All)", value: ""});
        Cpanel.Collection.Branch.find()
            .forEach(function (obj) {
                list.push({label: obj.enName, value: obj._id});
            });

        return list;
    },
    currency: function () {
        var list = [];
        list.push({label: "(Select All)", value: ""});

        Cpanel.Collection.Currency.find()
            .forEach(function (obj) {
                list.push({label: obj._id + ' (' + obj.num + ')', value: obj._id})
            });

        return list;
    },
    staff: function () {
        var list = [];
        list.push({label: "(Select All)", value: ""});

        Saving.Collection.Staff.find({}, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' (' + obj.position + ')',
                    value: obj._id
                })
            });

        return list;
    },
    product: function () {
        var list = [];
        list.push({label: "(Select All)", value: ""});

        Saving.Collection.Product.find({}, {sort: {_id: 1}})
            .forEach(function (obj) {
                list.push({
                    label: obj._id + ' | ' + obj.name + ' [' + obj.rate + ']',
                    value: obj._id
                })
            });

        return list;
    },
    exchange: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        Cpanel.Collection.Exchange.find({}, {sort: {dateTime: -1}})
            .forEach(function (obj) {
                list.push({label: obj.dateTime + ' | ' + EJSON.stringify(obj.rates), value: obj._id})
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
    accountForClient: function () {
        var list = [];
        list.push({label: "(Select One)", value: ""});

        var clientId = Session.get('clientIdOnForm');
        Saving.Collection.Account.find({
            clientId: clientId,
            _performCount: {$gt: 0}
        }, {
            sort: {_id: 1}
        }).forEach(function (obj) {
            var product = Saving.Collection.Product.findOne(obj.productId);

            list.push({
                label: obj._id + ' | ' + obj.cpanel_currencyId + ' | Pro: ' + product.name,
                value: obj._id
            })
        });

        return list;
    }
};
