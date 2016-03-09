/**
 * Index
 */
Template.saving_staff.onCreated(function () {
    // Create new  alertify
    createNewAlertify('staff');
});

Template.saving_staff.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {cpanel_branchId: pattern};
    }
});
Template.saving_staff.events({
    'click .insert': function (e, t) {
        alertify.staff(fa("plus", "Staff"), renderTemplate(Template.saving_staffInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        Meteor.call('findOneRecord', 'Saving.Collection.Staff', {_id: this._id}, {}, function (er, staff) {
            if (er) {
                alertify.error(er.message);
            } else {
                alertify.staff(fa("pencil", "Staff"), renderTemplate(Template.saving_staffUpdate, staff))
                    .maximize();
            }
        });
        //var data = Saving.Collection.Staff.findOne(this._id);

    },
    'click .remove': function (e, t) {
        var self = this;

        if (_.isUndefined(self._accountCount) || self._accountCount == 0) {
            alertify.confirm(
                fa("remove", "Staff"),
                "Are you sure to delete [" + self._id + "]?",
                function () {
                    Saving.Collection.Staff.remove(self._id, function (error) {
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
    'click .show': function () {
        var data = Saving.Collection.Staff.findOne({_id: this._id});
        data.photoUrl = null;

        if (!_.isUndefined(data.photo)) {
            data.photoUrl = Files.findOne(data.photo).url();
        }

        alertify.alert(fa("eye", "Staff"), renderTemplate(Template.saving_staffShow, data));
    }
});

/**
 * Insert
 */
Template.saving_staffInsert.onRendered(function () {
    datePicker();
});

/**
 * Update
 */
Template.saving_staffUpdate.onRendered(function () {
    datePicker();
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_staffInsert: {
        before: {
            insert: function (doc) {
                var prefix = Session.get('currentBranch') + '-';
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Staff, prefix, 4);
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
    saving_staffUpdate: {
        onSuccess: function (formType, result) {
            alertify.staff().close();
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
};
