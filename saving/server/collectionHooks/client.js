Saving.Collection.Client.before.insert(function (userId, doc) {
    var prefix = doc.cpanel_branchId + "-";
    doc._id = idGenerator.genWithPrefix(Saving.Collection.Client, prefix, 6);
});
