/**
 * Index
 */
Template.saving_client.onCreated(function () {
    // Create new  alertify
    createNewAlertify('client');
});

Template.saving_client.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {cpanel_branchId: pattern};
    }
});
Template.saving_client.events({
    'click .insert': function (e, t) {
        alertify.client(fa("plus", "Client"), renderTemplate(Template.saving_clientInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        // var data = Saving.Collection.Client.findOne(this._id);
        Meteor.call('findOneRecord', 'Saving.Collection.Client', {_id: this._id}, {}, function (er, client) {
            if (er) {
                alertify.error(er.message);
            } else {
                alertify.client(fa("pencil", "Client"), renderTemplate(Template.saving_clientUpdate, client))
                    .maximize();
            }
        });

    },
    'click .remove': function (e, t) {
        var self = this;

        // Check _accountCount
        if (_.isUndefined(self._accountCount) || self._accountCount == 0) {
            alertify.confirm(
                fa("remove", "Client"),
                "Are you sure to delete [" + self._id + "]?",
                function () {
                    Saving.Collection.Client.remove(self._id, function (error) {
                        if (error) {
                            alertify.error(error.message);
                        } else {
                            alertify.success("Success");
                        }
                    });
                },
                null
            );
        } else {
            alertify.error('You can\'t remove this, because it has been using.');
        }
    },
    'click .show': function (e, t) {
        var data = Saving.Collection.Client.findOne({_id: this._id});
        data.photoUrl = null;

        if (!_.isUndefined(data.photo)) {
            data.photoUrl = Files.findOne(data.photo).url();
        }

        alertify.alert(fa("eye", "Client"), renderTemplate(Template.saving_clientShow, data));
    }
});

/**
 * Insert
 */
Template.saving_clientInsert.onRendered(function () {
    datePicker();
});

/**
 * Update
 */
Template.saving_clientUpdate.onRendered(function () {
    datePicker();
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_clientInsert: {
        before: {
            insert: function (doc) {
                var branchPre = Session.get('currentBranch') + '-';
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Client, branchPre, 6);
                doc.cpanel_branchId = Session.get('currentBranch');
                return doc;
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    },
    saving_clientUpdate: {
        onSuccess: function (formType, result) {
            alertify.client().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

/**
 * Config date picker
 */
var datePicker = function () {
    DateTimePicker.date($('[name="dob"]'));
    DateTimePicker.date($('[name="issuedDate"]'));
    DateTimePicker.date($('[name="expiryDate"]'));
};
