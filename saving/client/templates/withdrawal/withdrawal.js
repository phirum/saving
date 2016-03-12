/**
 * Index
 */
Template.saving_withdrawal.onCreated(function () {
    // Create new  alertify
    createNewAlertify(['withdrawal', 'accountSearch', 'withdrawalShow', 'showConfirm']);
});
Template.saving_withdrawal.onRendered(function () {
    Session.set('withdrawalSelectorSession', null);
    DateTimePicker.dateRange($('#withdrawal-date-filter'));
});

Template.saving_withdrawal.helpers({
    selector: function () {
        var selectorSession = Session.get('withdrawalSelectorSession');
        if (selectorSession) {
            return selectorSession;
        } else {
            var pattern = Session.get('currentBranch');
            var selector = {amount: {lt: 0}, cpanel_branchId: pattern};
            var today = moment().format('YYYY-MM-DD');
            selector.performDate = {$gte: today, $lte: today};
            return selector;
        }
    }
});
Template.saving_withdrawal.events({
    'change #withdrawal-date-filter': function () {
        setWithdrawalSelectorSession();
    },
    'click .insert': function (e, t) {
        alertify.withdrawal(fa("plus", "Withdrawal"), renderTemplate(Template.saving_withdrawalInsert))
            .maximize();
    },
    'click .remove': function (e, t) {
        var id = this._id;

        // Check last record or not
        Meteor.call('getLastPerform', {_id: this.accountId}, function (error, getLast) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (getLast._id == id) {
                    alertify.confirm(
                        fa("remove", "Withdrawal"),
                        "Are you sure to delete [" + id + "]?",
                        function () {
                            Saving.Collection.Perform.remove(id, function (error) {
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
                alertify.withdrawalShow(fa("eye", "Withdrawal"), renderTemplate(Template.saving_withdrawalShow, perform));
            }
        });
    }
});

/**
 * Insert
 */
Template.saving_withdrawalInsert.onRendered(function () {
    datePicker();
});
Template.saving_withdrawalInsert.helpers({
    accountId: function () {
        return Saving.List.accountForWithdrawal();
    }
});
Template.saving_withdrawalInsert.events({
    'click [name="accountId"]': function (e, t) {
        var val = $('[name="accountId"]').val();
        var data = {data: val};

        alertify.accountSearch(fa("list", "Account Search List"), renderTemplate(Template.saving_depositAccountSearch, data));
    },
    'change [name="accountId"]': function (e, t) {
        var accountId = t.$('[name="accountId"]').val();
        Meteor.call('getLastPerform', accountId, function (error, getLast) {
            if (error) {
                alertify.error(error.message);
            } else {
                if (getLast) {
                    var withDate = t.$('[name="performDate"]');
                    withDate.data("DateTimePicker").minDate(getLast.performDate);
                }
                t.$('[type="submit"]').attr('disabled', 'disabled');
            }
        });

    },
    'focus [name="performDate"]': function (e, t) {
        t.$('[type="submit"]').attr('disabled', 'disabled');
    },
    'click .confirm': function (e, t) {
        confirm(e, t, 'insert');
    }
});
Template.saving_withdrawalInsert.onDestroyed(function () {
    //
});

/**
 * Account search
 */
Template.saving_withdrawalAccountSearch.events({
    'click .item': function (e, t) {
        var $account = $('[name="accountId"]');
        $account.val(this._id);
        $account.change();

        alertify.accountSearch().close();
    }
});

/**
 * Hook
 */
AutoForm.hooks({
    saving_withdrawalInsert: {
        before: {
            insert: function (doc) {
                if (_.isEmpty(doc.accountId)) {
                    alertify.error('Account is required.');
                    return false;
                } else {
                    // Check amount
                    if (doc.amount <= 0) {
                        alertify.error('Account must be granter than zero (0)');
                        return false;
                    } else {
                        //move to server
                        // Get info
                        /*
                         var accountDoc = Saving.Collection.Account.findOne(doc.accountId);
                         var settingDoc = Saving.Collection.Setting.findOne();
                         var taxRate = settingDoc.tax.currentDeposit;
                         if (s.startsWith(accountDoc.productId, '2')) {
                         taxRate = settingDoc.tax.fixDeposit;
                         }

                         var prefix = doc.accountId;
                         doc._id = idGenerator.genWithPrefix(Saving.Collection.Perform, prefix, 4);
                         */
                        var totalRe = roundCurrency(doc.principalRe + doc.interestRe, doc.accountId);
                        // Check amount
                        doc.amount = roundCurrency(doc.amount, doc.accountId);
                        if (doc.amount > totalRe) {
                            alertify.warning('Withdrawal amount is greater than amount receivable');
                            return false;
                        } else {
                            // calculate principal and interest balance
                            //move to server
                            /*  doc.status = 'P';

                             if (doc.amount > doc.interestRe) {
                             doc.principalBal = roundCurrency(doc.principalRe - (doc.amount - doc.interestRe), doc.accountId);
                             doc.interestBal = 0;
                             if (doc.principalBal == 0) {
                             doc.status = 'F';
                             }

                             // Cal tax amount
                             doc.withFields.tax = roundCurrency(doc.interestRe * taxRate / 100, doc.accountId);

                             } else {
                             doc.principalBal = doc.principalRe;
                             doc.interestBal = roundCurrency(doc.interestRe - doc.amount, doc.accountId);

                             // Cal tax amount
                             doc.withFields.tax = roundCurrency(doc.amount * taxRate / 100, doc.accountId);
                             }*/
                            doc.amount = doc.amount * -1;
                            //doc.withFields = withFields;
                            doc.cpanel_branchId = Session.get('currentBranch');

                            return doc;
                        }
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
                doc.voucherId = Session.get('currentBranch') + '-W' + _.padLeft(doc.voucherId, 6, '0');
            }
            return doc;
        }
    }
});

//----------------------------------------------------------------

// Config date picker
var datePicker = function () {
    DateTimePicker.date($('[name="performDate"]'));
};

// Confirm
var confirm = function (e, t) {
    var performDate = t.$('[name="performDate"]').val();
    var accountId = t.$('[name="accountId"]').val();

    if (_.isEmpty(performDate) || _.isEmpty(accountId)) {
        alertify.error('Active date and account id is required');
    } else {
        // Get detail info
        Meteor.call('findOneRecord', 'Saving.Collection.Account', {_id: accountId}, {}, function (error, accountDoc) {
            if (error) {
                alertify.error(error.message);
            } else {
                Meteor.call('findOneRecord', 'Saving.Collection.Client', {_id: accountDoc.clientId}, {}, function (err, clientDoc) {
                    if (err) {
                        alertify.error(err.message);
                    }
                    else {
                        var currencyDoc = Cpanel.Collection.Currency.findOne(accountDoc.cpanel_currencyId);
                        var productDoc = Saving.Collection.Product.findOne(accountDoc.productId);

                        // Get setting info: tax, penalty
                        var settingDoc = Saving.Collection.Setting.findOne();

                        Meteor.call('getLastPerform', accountId, performDate, function (er, getLast) {
                            if (er) {
                                alertify.error(er.message);
                            } else {
                                // For last performance record
                                if (!getLast) {
                                    alertify.warning('This account don\'t have deposit yet.');
                                }
                                else {
                                    Meteor.call('getLastPerform', accountId, function (le, getLastNoPerformDate) {
                                        if (le) {
                                            alertify.error(le.message);
                                        } else {

                                            // Receivable interest
                                            var interestCalResult = interestCalWithRate(getLast.performDate, performDate, getLast.principalBal, productDoc.rate, accountId);
                                            var dayNumberResult = interestCalResult.dayNumber;
                                            t.$('[name="dayNumber"]').val(dayNumberResult);

                                            var principalResult = roundCurrency(getLast.principalBal, accountId);
                                            var interestResult = roundCurrency(getLast.interestBal + interestCalResult.interest, accountId);
                                            var totalResult = roundCurrency(principalResult + interestResult, accountId);
                                            var confirmData;

                                            // Tax
                                            var taxRate = settingDoc.tax.currentDeposit;
                                            if (s.startsWith(productDoc._id, '2')) {
                                                taxRate = settingDoc.tax.fixDeposit;
                                            }
                                            var tax = roundCurrency(interestResult * taxRate / 100, accountId);

                                            // Check product
                                            // Fix deposit
                                            if (s.startsWith(productDoc._id, '2')) {
                                                // Maturity date
                                                var maturityDate = {};
                                                maturityDate.label = 'primary';
                                                maturityDate.value = accountDoc.maturityDate;

                                                // Get easy product
                                                var easyProductId = '101';
                                                var easyProductDoc = Saving.Collection.Product.findOne(easyProductId);
                                                var offsetInterest = 0; // get back interest if withdrawal before contract
                                                var penalty = 0;

                                                // Check perform date with maturity date
                                                if (performDate < maturityDate.value) {
                                                    maturityDate.label = 'warning';

                                                    // Cal penalty interest with easy rate
                                                    var sumOfInterest = 0;
                                                    var sumOfInterestWithNew;
                                                    /*    console.log(sumOfInterest);
                                                     Meteor.call('findRecords', 'Saving.Collection.Perform', {accountId: accountId}, {}, function (lle, performs) {
                                                     if (lle) {
                                                     alertify.error(lle.message);
                                                     } else {
                                                     performs.forEach(function (perform) {
                                                     sumOfInterest += perform.interestRe;
                                                     });
                                                     console.log('------sum inside the method-----');
                                                     sumOfInterest += 1;
                                                     console.log(sumOfInterest);

                                                     }
                                                     });
                                                     console.log('--------after finish call method---------');
                                                     console.log(sumOfInterest);*/

                                                    /* var fetcherParams = "getPerform" + accountId;
                                                     Fetcher.setDefault(fetcherParams, false);
                                                     Fetcher.retrieve(fetcherParams, 'findRecords', 'Saving.Collection.Perform', {accountId: accountId});
                                                     var performs = Fetcher.get(fetcherParams);*/

                                                    Saving.Collection.Perform.find({accountId: accountId})
                                                        .forEach(function (obj) {
                                                            sumOfInterest += obj.interestRe;
                                                        });
                                                    sumOfInterestWithNew = roundCurrency(sumOfInterest + interestResult, accountId);

                                                    var varianceOfRate = roundCurrency(productDoc.rate - easyProductDoc.rate, accountId);
                                                    offsetInterest = roundCurrency((varianceOfRate * sumOfInterestWithNew) / productDoc.rate, accountId);
                                                    penalty = roundCurrency(sumOfInterestWithNew * settingDoc.penaltyForFixDeposit / 100, accountId);
                                                }

                                                // Set new value on form object
                                                t.find('[name="principalRe"]').value = principalResult;
                                                t.find('[name="interestRe"]').value = interestResult;
                                                t.find('[name="withFields.offsetInterest"]').value = offsetInterest;
                                                t.find('[name="withFields.penalty"]').value = penalty;
                                                t.find('[name="amount"]').value = totalResult;
                                                t.find('[name="memo"]').value = 'Offset Interest: ' + numeral(offsetInterest).format('0,0.00')
                                                    + ' | Penalty: ' + numeral(penalty).format('0,0.00');

                                                t.$('[type="submit"]').removeAttr('disabled');
                                                t.$('[name="amount"]').attr('readonly', 'readonly');

                                                confirmData = {
                                                    dayNumber: dayNumberResult,
                                                    principal: numeral(principalResult).format('0,0.00'),
                                                    interest: numeral(interestResult).format('0,0.00'),
                                                    tax: numeral(tax).format('0,0.00') + ' (Rate: ' + taxRate + '%)',
                                                    total: numeral(totalResult).format('0,0.00'),
                                                    offsetInterest: numeral(offsetInterest).format('0,0.00') + ' (Rate: ' + easyProductDoc.rate + '%)',
                                                    penalty: numeral(penalty).format('0,0.00') + ' (Penalty: ' + settingDoc.penaltyForFixDeposit + '%)',
                                                    client: clientDoc.khName,
                                                    accDate: accountDoc.accDate,
                                                    currency: currencyDoc._id,
                                                    product: productDoc._id + ' | ' + productDoc.name,
                                                    rate: numeral(productDoc.rate).format('0,0.00') + '%',
                                                    maturityDate: maturityDate,
                                                    lastActiveDate: getLastNoPerformDate.performDate
                                                };

                                                // For product = 201, 202
                                                if (productDoc._id == '201' || productDoc._id == '202') {
                                                    alertify.alert(
                                                        'Confirm',
                                                        renderTemplate(Template.saving_withdrawalConfirmForActiveInterest, confirmData).html,
                                                        function () {
                                                            var withdrawalOpt = $('[name="withdrawalConfirmRadio"]:checked').val();
                                                            if (withdrawalOpt == 'interest') {
                                                                t.find('[name="amount"]').value = parseFloat(interestResult);
                                                                t.find('[name="memo"]').value = '';
                                                                t.find('[name="withFields.offsetInterest"]').value = 0;
                                                                t.find('[name="withFields.penalty"]').value = 0;
                                                            }
                                                        });

                                                }
                                                else if (productDoc._id == '203' || productDoc._id == '204') {// For product = 203, 204
                                                    alertify.alert(
                                                        'Confirm',
                                                        renderTemplate(Template.saving_withdrawalConfirmForAchievment, confirmData).html
                                                    );
                                                }

                                            }
                                            else { // Current deposit
                                                confirmData = {
                                                    dayNumber: dayNumberResult,
                                                    principal: numeral(principalResult).format('0,0.00'),
                                                    interest: numeral(interestResult).format('0,0.00'),
                                                    tax: numeral(tax).format('0,0.00') + ' (Rate: ' + taxRate + '%)',
                                                    total: numeral(totalResult).format('0,0.00'),
                                                    client: clientDoc.khName,
                                                    accDate: accountDoc.accDate,
                                                    currency: currencyDoc._id,
                                                    product: productDoc._id + ' | ' + productDoc.name,
                                                    rate: numeral(productDoc.rate).format('0,0.00'),
                                                    lastActiveDate: getLastNoPerformDate.performDate
                                                };

                                                alertify.alert(
                                                    'Confirm',
                                                    renderTemplate(Template.saving_withdrawalConfirm, confirmData).html, function () {
                                                        t.find('[name="principalRe"]').value = principalResult;
                                                        t.find('[name="interestRe"]').value = interestResult;
                                                        t.find('[name="amount"]').value = parseFloat(totalResult);

                                                        t.$('[type="submit"]').removeAttr('disabled');
                                                        t.$('[name="amount"]').removeAttr('readonly');
                                                    });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            }
        });

    }
};


function setWithdrawalSelectorSession() {
    var pattern = Session.get('currentBranch');
    var selector = {amount: {$lt: 0}, cpanel_branchId: pattern};
    var dateRange = $('#withdrawal-date-filter').val();
    if (dateRange != "") {
        var date = dateRange.split(" To ");
        selector.performDate = {$gte: date[0], $lte: date[1]};
    } else {
        var today = moment().format('YYYY-MM-DD');
        selector.performDate = {$gte: today, $lte: today};
    }
    Session.set('withdrawalSelectorSession', selector);
}