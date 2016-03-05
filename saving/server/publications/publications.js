// Setting
Meteor.publish('saving_setting', function () {
    if (this.userId) {
        return Saving.Collection.Setting.find();
    }
});

// Product
Meteor.publish('saving_product', function () {
    if (this.userId) {
        return Saving.Collection.Product.find();
    }
});

// Staff
Meteor.publish('saving_staff', function () {
    if (this.userId) {
        return Saving.Collection.Staff.find();
    }
});

// Client
Meteor.publish('saving_client', function () {
    if (this.userId) {
        return Saving.Collection.Client.find();
    }
});
// Account
Meteor.publish('saving_account', function () {
    if (this.userId) {
        return Saving.Collection.Account.find();
    }
});
// Deposit and Withdrawal
Meteor.publish('saving_perform', function () {
    if (this.userId) {
        return Saving.Collection.Perform.find();
    }
});
