// Get last performance
lastPerform = function (accountId, activeDate) {
    var selector = {accountId: accountId};
    if (!_.isUndefined(activeDate)) {
        selector.performDate = {$lte: activeDate};
    }
    var getLast = Saving.Collection.Perform.findOne(selector, {sort: {_id: -1}});

    return getLast;
};

// Get last performance except id
lastPerformExcept = function (accountId, exceptId, activeDate) {
    var selector = {
        _id: {$ne: exceptId},
        accountId: accountId
    };
    if (!_.isUndefined(activeDate)) {
        selector.performDate = {$lte: activeDate};
    }
    var getLast = Saving.Collection.Perform.findOne(selector, {sort: {_id: -1}});

    return getLast;
};