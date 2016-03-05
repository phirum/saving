function getBackupType(type) {
    var settingType = [
        // For cpanel module
        'Cpanel.Collection.Currency',
        'Cpanel.Collection.Branch',
        'Cpanel.Collection.Company',
        'Cpanel.Collection.Setting',
        'Cpanel.Collection.Currency',
        'Meteor.roles',
        'Meteor.users',
        // For saving module
        'Saving.Collection.Setting',
        'Saving.Collection.Product'
    ];
    var defaultType = [
        'Saving.Collection.Account',
        'Saving.Collection.Client',
        'Saving.Collection.Perform',
        'Saving.Collection.Staff'
    ];

    if (type == 'Setting') {
        return settingType;
    } else if (type == 'Default') {
        return defaultType;
    } else {// for all
        return defaultType.concat(settingType);
    }
}

AutoForm.hooks({
    saving_backup: {
        onSubmit: function (doc) {
            debugger;
            var backupType = doc.backupType;
            var collections = getBackupType(backupType);
            var module = Session.get('currentModule');
            backup(module, "cpanel_branchId", backupType, collections, doc.branch);
            return false;
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});