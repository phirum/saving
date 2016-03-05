Migrations.add({
    version: 1,
    name: 'Add collections cache',
    up: function () {
        // Get data
        var staffDoc = Saving.Collection.Staff.find({}).fetch();
        var clientDoc = Saving.Collection.Client.find({}).fetch();
        var accountDoc = Saving.Collection.Account.find({}).fetch();
        var performDoc = Saving.Collection.Perform.find({}).fetch();

        // Delete data
        Saving.Collection.Perform.remove({});
        Saving.Collection.Account.remove({});
        Saving.Collection.Client.remove({});
        Saving.Collection.Staff.remove({});

        // Add data
        staffDoc.forEach(function (obj) {
            Saving.Collection.Staff.insert(obj);
        });
        clientDoc.forEach(function (obj) {
            delete obj.issuedDate;
            Saving.Collection.Client.insert(obj);
        });
        accountDoc.forEach(function (obj) {
            delete obj.status;
            Saving.Collection.Account.insert(obj);
        });
        performDoc.forEach(function (obj) {
            Saving.Collection.Perform.insert(obj);
        });

    },
    down: function () {
    }
});

// Run migration
Meteor.startup(function () {
    //Migrations.migrateTo('latest');
});
