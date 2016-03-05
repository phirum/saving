/**
 * Index
 */
var indexTpl = Template.saving_account;
indexTpl.onCreated(function () {
    // Create new  alertify
    createNewAlertify(['account', 'client', 'clientSearchList', 'staff']);
});

indexTpl.helpers({
    selector: function () {
        var pattern = Session.get('currentBranch');
        //var pattern = new RegExp("^" + branchId.current.branch);
        return {cpanel_branchId: pattern};
    }
});
indexTpl.events({
    'click .insert': function (e, t) {
        alertify.account(fa("plus", "Account"), renderTemplate(Template.saving_accountInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        // check status
        if (this.status == 'Inactive') {
            var data = Saving.Collection.Account.findOne(this._id);
            alertify.account(fa("pencil", "Account"), renderTemplate(Template.saving_accountUpdate, data))
                .maximize();
        } else {
            alertify.error('You can\'t update this, because it has been using.');
        }
    },
    'click .remove': function (e, t) {
        // check status
        if (_.isUndefined(this._performCount) || this._performCount == 0) {
            var id = this._id;
            alertify.confirm(fa("remove", "Account"), "Are you sure to delete [" + id + "]?", function () {
                    Saving.Collection.Account.remove(id, function (error) {
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
        var data = Saving.Collection.Account.findOne({_id: this._id});
        data.inheritorVal = JSON.stringify(data.inheritor, null, '\t');

        alertify.alert(fa("eye", "Account"), renderTemplate(Template.saving_accountShow, data));
    }
});

/**
 * Insert
 */
var insertTpl = Template.saving_accountInsert;
insertTpl.onRendered(function () {
    datePicker();
});
insertTpl.events({
    'change [name="productId"]': function (e, t) {
        var productId = t.$('[name="productId"]').val();
        Session.set('productIdOnForm', productId);
    },
    'click .clientInsertAddon': function () {
        alertify.client(fa("plus", "Client"), renderTemplate(Template.saving_clientInsert));
    },
    'click .staffInsertAddon': function () {
        alertify.staff(fa("plus", "Staff"), renderTemplate(Template.saving_staffInsert));
    },
    // Search list
    'click [name="clientId"]': function () {
        var data = {data: $('[name="clientId"]').val()};

        alertify.clientSearchList(fa("list", "Client Search List"), renderTemplate(Template.saving_accountClientSearchList, data));
    }
});

/**
 * Update
 */
var updateTpl = Template.saving_accountUpdate;
updateTpl.onRendered(function () {
    datePicker();
});
updateTpl.events({
    'click .clientInsertAddon': function () {
        alertify.client(fa("plus", "Client"), renderTemplate(Template.saving_clientInsert));
    },
    'click .staffInsertAddon': function () {
        alertify.staff(fa("plus", "Staff"), renderTemplate(Template.saving_staffInsert));
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_accountInsert: {
        before: {
            insert: function (doc) {
                var currencyNum = '';
                if (!_.isEmpty(doc.cpanel_currencyId)) {
                    var currencyDoc = Cpanel.Collection.Currency.findOne(doc.cpanel_currencyId);
                    currencyNum = currencyDoc.num;
                }

                var prefix = doc.clientId + currencyNum + doc.productId;
                doc._id = idGenerator.genWithPrefix(Saving.Collection.Account, prefix, 3);

                // Maturity date
                if (_.startsWith(doc.productId, '2')) {
                    var maturityDate = moment(doc.accDate, 'YYYY-MM-DD').add(doc.term, 'months').toDate();
                    doc.maturityDate = moment(maturityDate).format('YYYY-MM-DD');
                }

                // cal cycle
                var cycle = 1;
                var lastAccount = Saving.Collection.Account.findOne({clientId: doc.clientId}, {sort: {cycle: -1}});
                if (!_.isUndefined(lastAccount)) {
                    cycle = lastAccount.cycle + 1;
                }

                doc.cycle = cycle;
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
    }
});

/**
 * Config date picker
 */
var datePicker = function () {
    DateTimePicker.date($('[name="accDate"]'));
};

Template.saving_accountClientSearchList.events({
    'click .item': function (e, t) {
        $('[name="clientId"]').val(this._id);
        alertify.clientSearchList().close();
    }
});