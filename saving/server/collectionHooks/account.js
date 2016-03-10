Saving.Collection.Account.before.insert(function (userId, doc) {
    doc._id = idGenerator.gen(Pos.Collection.Categories, 7);
});