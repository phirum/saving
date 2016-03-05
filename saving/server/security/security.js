// Setting
Saving.Collection.Setting.permit(['update'])
    .saving_ifAdmin()
    .apply();

// Product
Saving.Collection.Product.permit(['insert', 'update', 'remove'])
    .saving_ifGeneral()
    .apply();

// Staff
Saving.Collection.Staff.permit(['insert', 'update', 'remove'])
    .saving_ifGeneral()
    .apply();

// Client
Saving.Collection.Client.permit(['insert', 'update', 'remove'])
    .saving_ifGeneral()
    .apply();

// Account
Saving.Collection.Account.permit(['insert', 'update', 'remove'])
    .saving_ifGeneral()
    .apply();

// Dep and With
Saving.Collection.Perform.permit(['insert', 'update', 'remove'])
    .saving_ifGeneral()
    .apply();
