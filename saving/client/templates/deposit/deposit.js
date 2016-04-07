/**
 * Declare reactive obj
 */
var state = new ReactiveObj({
    depCycle: 'new',
    lastDepDate: ''
});

/**
 * Index
 */
Template.saving_deposit.onCreated(function () {
    // Create new  alertify
    createNewAlertify(['deposit', 'accountSearch', 'depositShow']);
});
Template.saving_deposit.onRendered(function () {
    Session.set('depositSelectorSession', null);
    DateTimePicker.dateRange($('#deposit-date-filter'));
});

Template.saving_deposit.helpers({
    selector: function () {
        var selectorSession = Session.get('depositSelectorSession');
        if (selectorSession) {
            return selectorSession;
        } else {
            var pattern = Session.get('currentBranch');
            var selector = {amount: {$gt: 0}, cpanel_branchId: pattern};
            var today = moment().format('YYYY-MM-DD');
            selector.performDate = {$gte: today, $lte: today};
            return selector;
        }
    }

});
Template.saving_deposit.events({
    'change #deposit-date-filter': function () {
        setDepositSelectorSession();
    },
    'click .insert': function (e, t) {
        alertify.deposit(fa("plus", "Deposit"), renderTemplate(Template.saving_depositInsert))
            .maximize();
    },
    'click .update': function (e, t) {
        Meteor.subscribe('saving_accountById',this.accountId);
        Meteor.call('findOneRecord', 'Saving.Collection.Perform', {_id: this._id}, {}, function (error, perform) {
            if (error) {
                alertify.error(error.message);
            } else {
                Meteor.call('getLastPerform', perform.accountId, function (err, getLast) {
                    if (err) {
                        alertify.error(err.message);
                    } else {
                        if (getLast._id == perform._id) {
                            Meteor.call('findOneRecord', 'Saving.Collection.Account', {_id: perform.accountId}, {}, function (er, accountDoc) {
                                if (er) {
                                    alertify.error(er.message);
                                } else {
                                    // Set new state for update form
                                    state.set('depCycle', 'new');
                                    state.set('lastDepDate', accountDoc.accDate);
                                    Meteor.call('getLastPerformExcept', perform.accountId, perform._id, function (le, getLastExcept) {
                                        if (le) {
                                            alertify.error(le.message);
                                        } else {
                                            state.set('depCycle', 'old');
                                            state.set('lastDepDate', getLastExcept.performDate);

                                            alertify.deposit(fa("pencil", "Deposit"), renderTemplate(Template.saving_depositUpdate, perform))
                                                .maximize();
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            // Check dep or with
                            var type = 'deposit';
                            if (getLast.amount < 0) {
                                type = 'withdrawal';
                            }
                            var info = '(Voucher ID: ' + getLast.voucherId + ' in ' + type + ')';

                            alertify.warning('You can\'t update this, because don\'t last doc ' + info);
                        }
                    }
                });

            }
        });


    },
    'click .remove': function (e, t) {
        var self = this;

        // Check last record or not
        Meteor.call('getLastPerform', self.accountId, function (error, getLast) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (getLast._id == self._id) {
                    alertify.confirm(
                        fa("remove", "Deposit"),
                        "Are you sure to delete [" + self._id + "]?",
                        function () {
                            Saving.Collection.Perform.remove(self._id, function (error) {
                                if (error) {
                                    alertify.error(error.message);
                                } else {
                                    alertify.success("Success");
                                }
                            });
                        },
                        null
                    );

                }
                else {
                    // Check dep or with
                    var type = 'deposit';
                    if (getLast.amount < 0) {
                        type = 'withdrawal';
                    }
                    var info = '(Voucher ID: ' + getLast.voucherId + ' in ' + type + ')';

                    alertify.warning('You can\'t remove this, because don\'t last doc ' + info);
                }
            }
        });


    },
    'click .show': function (e, t) {
        Meteor.call('findOneRecord', 'Saving.Collection.Perform', {_id: this._id}, {}, function (er, perform) {
            if (er) {
                alertify.error(er.message);
            } else {
                alertify.depositShow(fa("eye", "Deposit"), renderTemplate(Template.saving_depositShow, perform));
            }
        });
    }
});

/**
 * Insert
 */
Template.saving_depositInsert.onRendered(function () {
    configOnRender();

    // Remote select2
    //var branchId = Session.get('currentBranch');
    //$('[name="accountId"]').select2({
    //    placeholder: "Search account id...",
    //    allowClear: true,
    //    ajax: {
    //        url: Router.url('saving.remoteAccount'),
    //        type: "GET",
    //        dataType: 'json',
    //        delay: 250,
    //        data: function (params) {
    //            return {term: params, branchId: branchId, type: 'deposit'};
    //        },
    //        results: function (data, page) {
    //            return {results: data};
    //        },
    //        cache: true
    //    },
    //    minimumInputLength: 3
    //});
});
Template.saving_depositInsert.helpers({
    accountId: function () {
        return Saving.List.accountForDeposit();
    }
});

Template.saving_depositInsert.events({
    'click [name="accountId"]': function (e, t) {
        var val = $('[name="accountId"]').val();
        var data = {data: val};

        alertify.accountSearch(fa("list", "Account Search List"), renderTemplate(Template.saving_depositAccountSearch, data));
    },
    'change [name="accountId"]': function (e, t) {
        var accountId = t.$('[name="accountId"]').val();
        var depDate = t.$('[name="performDate"]');
        depDate.removeAttr('readonly');

        if (!_.isEmpty(accountId)) {
            // Check last perform exist
            Meteor.call('getLastPerform', accountId, function (error, getLast) {
                if (error) {
                    alertify.error(error.message);
                } else {
                    if (getLast) {
                        depDate.val(getLast.performDate);
                        depDate.data("DateTimePicker").minDate(getLast.performDate);
                    } else {
                        Meteor.call('findOneRecord', 'Saving.Collection.Account', {_id: accountId}, {}, function (err, accountDoc) {
                            if (err) {
                                alertify.error(err.message);
                            } else {
                                depDate.val(accountDoc.accDate);
                                depDate.attr('readonly', 'true');
                            }
                        });

                    }
                }
            });

        }
    }
});

/**
 * Update
 */
Template.saving_depositUpdate.onRendered(function () {
    configOnRender();

    var depDate = $('[name="performDate"]');
    if (state.get('depCycle') == 'new') {
        depDate.val(state.get('lastDepDate'));
        depDate.attr('readonly', 'true');
    } else {
        depDate.data("DateTimePicker").minDate(state.get('lastDepDate'));
        depDate.removeAttr('readonly');
    }
});

/**
 * Account search
 */
Template.saving_depositAccountSearch.events({
    'click .item': function (e, t) {
        debugger;
        var $account = $('[name="accountId"]');
        Meteor.subscribe('saving_accountById',this._id);
        $account.val(this._id);
        $account.change();

        alertify.accountSearch().close();
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_depositInsert: {
        before: {
            insert: function (doc) {
                if (_.isEmpty(doc.accountId)) {
                    alertify.error('Account is required.');
                    return false;
                } else {
                    if (doc.amount <= 0) {
                        alertify.error('Account must be granter than zero (0)');
                        return false;
                    } else {
                        doc.amount = roundCurrency(doc.amount, doc.accountId);
                        //move to server
                        /*
                         var prefix = doc.accountId;
                         doc._id = idGenerator.genWithPrefix(Saving.Collection.Perform, prefix, 4);
                         doc.amount = roundCurrency(doc.amount, doc.accountId);

                         // Get last perform
                         var getLast = lastPerform(doc.accountId);
                         if (!_.isUndefined(getLast)) { // for the 2, 3... time
                         var newCal = interestCal(getLast.performDate, doc.performDate, getLast.principalBal, doc.accountId);
                         doc.dayNumber = newCal.dayNumber;
                         doc.principalRe = roundCurrency(getLast.principalBal, doc.accountId);
                         doc.interestRe = roundCurrency(getLast.interestBal + newCal.interest, doc.accountId);
                         doc.principalBal = roundCurrency(getLast.principalBal + doc.amount, doc.accountId);
                         doc.interestBal = roundCurrency(doc.interestRe, doc.accountId);
                         doc.status = 'A';
                         } else { // for the 1st time
                         // check with account date
                         var accountDoc = Saving.Collection.Account.findOne(doc.accountId);
                         if (accountDoc.accDate != doc.performDate) {
                         alertify.warning('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
                         return false;
                         }
                         doc.dayNumber = 0;
                         doc.principalRe = 0;
                         doc.interestRe = 0;
                         doc.principalBal = roundCurrency(doc.amount, doc.accountId);
                         doc.interestBal = 0;
                         doc.status = 'N';
                         }
                         */
                        doc.cpanel_branchId = Session.get('currentBranch');

                        return doc;
                    }
                }
            }
        },
        onSuccess: function (formType, result) {
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        formToDoc: function (doc) {
            if (!_.isEmpty(doc.voucherId)) {
                doc.voucherId = Session.get('currentBranch') + '-D' + _.padLeft(doc.voucherId, 6, '0');
            }
            return doc;
        }
    },
    saving_depositUpdate: {
        before: {
            update: function (doc) {

                doc.$set.amount = roundCurrency(doc.$set.amount, doc.$set.accountId);

                if (doc.$set.amount <= 0) {
                    alertify.error('Account must be granter than zero (0)');
                    return false;
                } else {
                    //move to server
                    /*
                     // Get last perform
                     var getLast = lastPerformExcept(doc.$set.accountId, this.docId);
                     if (!_.isUndefined(getLast)) { // for the 2, 3... time
                     var newCal = interestCal(getLast.performDate, doc.$set.performDate, getLast.principalBal, doc.$set.accountId);

                     doc.$set.dayNumber = newCal.dayNumber;
                     doc.$set.principalRe = roundCurrency(getLast.principalBal, doc.$set.accountId);
                     doc.$set.interestRe = roundCurrency(getLast.interestBal + newCal.interest, doc.$set.accountId);
                     doc.$set.principalBal = roundCurrency(getLast.principalBal + doc.$set.amount, doc.$set.accountId);
                     doc.$set.interestBal = roundCurrency(doc.$set.interestRe, doc.$set.accountId);
                     doc.$set.status = 'A';
                     }
                     else {
                     // check with account date
                     var accountDoc = Saving.Collection.Account.findOne(doc.$set.accountId);
                     if (accountDoc.accDate != doc.$set.performDate) {
                     alertify.warning('Deposit date must be equal to account date (' + accountDoc.accDate + ') for the first time.');
                     return false;
                     }

                     doc.$set.dayNumber = 0;
                     doc.$set.principalRe = 0;
                     doc.$set.interestRe = 0;
                     doc.$set.principalBal = roundCurrency(doc.$set.amount, doc.$set.accountId);
                     doc.$set.interestBal = 0;
                     doc.$set.status = 'N';
                     }
                     */
                    doc.$set.voucherId = Session.get('currentBranch') + '-D' + _.padLeft(doc.$set.voucherId, 6, '0');

                    return doc;
                }
            }
        },
        onSuccess: function (formType, result) {
            alertify.deposit().close();
            alertify.success('Success');
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        },
        docToForm: function (doc, ss) {
            var voucherId = doc.voucherId;
            doc.voucherId = voucherId.slice(-6);

            return doc;
        }
    }
});

/**
 * Config on rendere
 */
var configOnRender = function () {
    var performDate = $('[name="performDate"]');
    DateTimePicker.date(performDate);
};

function setDepositSelectorSession() {
    var pattern = Session.get('currentBranch');
    var selector = {amount: {$gt: 0}, cpanel_branchId: pattern};
    var dateRange = $('#deposit-date-filter').val();
    if (dateRange != "") {
        var date = dateRange.split(" To ");
        selector.performDate = {$gte: date[0], $lte: date[1]};
    } else {
        var today = moment().format('YYYY-MM-DD');
        selector.performDate = {$gte: today, $lte: today};
    }
    Session.set('depositSelectorSession', selector);
}
