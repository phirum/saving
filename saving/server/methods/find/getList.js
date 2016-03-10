Meteor.methods({
    getList: function (collectionName, selector, option, hasSelectOne) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var arr = [];
        if (hasSelectOne) {
            arr.push({value: "", label: "(Select One)"});
        }
        collectionName = eval(collectionName);
        selector = selector == null ? {} : selector;
        option = option == null ? {} : option;
        collectionName.find(selector, option).forEach(function (obj) {
            arr.push({value: obj._id, label: obj._id + " | " + obj.name});
        });
        return arr;
    },
    getAccountForClient: function (clientId) {
        var list = [];
        list.push({label: "(Select One)", value: ""});
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
});