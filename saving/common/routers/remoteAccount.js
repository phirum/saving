//server only code
Router.route('saving/remoteAccount', {
    name: 'saving.remoteAccount',
    where: 'server'
}).get(function () {
    var q = this.params.query;

    console.log(q);

    //var selector = {};
    //selector.name = {$regex: q.term, $options: 'i'};
    //var items = Saving.Collection.Address.find(selector)
    //    .map(function (obj) {
    //        return {id: obj._id, text: obj.name};
    //    });
    //this.response.setHeader('Content-Type', 'application/json');

    var selector, items;
    if (q.type == 'deposit') {
        selector = {
            _id: {$regex: q.term, $options: 'i'},
            cpanel_branchId: q.branchId,
            $or: [
                {productId: {$not: /^2/}},
                {_performCount: 0}
            ]
        };

        items = Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .map(function (obj) {
                var text = obj._id + ' | ' +
                    obj._client.khName + ' (' + obj._client.gender + ')' + ' | ' +
                    'SO: ' + obj._staff.name;

                return {id: obj._id, text: text};
            });
    } else {
        selector = {
            _id: {$regex: q.term, $options: 'i'},
            cpanel_branchId: q.branchId
        };

        items = Saving.Collection.Account.find(selector, {sort: {_id: 1}})
            .map(function (obj) {
                var getLast = lastPerform(obj._id);
                if (!_.isUndefined(getLast)) {
                    // Check status = F
                    if (getLast.status != 'F') {
                        var text = obj._id + ' | ' +
                            obj._client.khName + ' (' + obj._client.gender + ')' + ' | ' +
                            'SO: ' + obj._staff.name;

                        return {id: obj._id, text: text};
                    }
                }
            });
    }

    this.response.end(JSON.stringify(items));
});
