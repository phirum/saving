Meteor.methods({
    isRelationExist: function (arr) {

        var getArray = _.isArray(arr) ? arr : [];
        var exist = false;

        getArray.forEach(function (obj) {
            var collection = eval(obj.collection);
            var getRelation = collection.findOne(obj.selector);
            if (getRelation) {
                exist = true;
                return false;
            }
        });
        return exist;

    }
});

