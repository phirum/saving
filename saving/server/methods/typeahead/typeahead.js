Meteor.methods({
    searchClient: function (query, options) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        options = options || {};
        // guard against client-side DOS: hard limit to 50
        if (options.limit) {
            options.limit = Math.min(50, Math.abs(options.limit));
        } else {
            options.limit = 50;
        }
        // TODO fix regexp to support multiple tokens
        var regex = new RegExp(query, 'i');
        return Saving.Collection.Client.find({
            $or: [{_id: {$regex: regex}}, {khName: {$regex: regex}}, {enName: {$regex: regex}}]
        }, options).fetch();

    }
});
