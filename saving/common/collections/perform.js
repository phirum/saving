// Collection
Saving.Collection.Perform = new Mongo.Collection("saving_perform");

// Schema
Saving.Schema.Perform = new SimpleSchema({
    performDate: {
        type: String,
        label: "Active Date",
        defaultValue: function () {
            var currentDate = moment(ReactiveMethod.call("currentDate"), 'YYYY-MM-DD H:mm:ss').format('YYYY-MM-DD');
            return currentDate;
        }
    },
    dayNumber: {
        type: Number,
        optional: true
    },
    principalRe: {
        type: Number,
        decimal: true,
        optional: true
    },
    interestRe: {
        type: Number,
        decimal: true,
        optional: true
    },
    amount: {
        type: Number,
        decimal: true
    },
    principalBal: {
        type: Number,
        decimal: true,
        optional: true
    },
    interestBal: {
        type: Number,
        decimal: true,
        optional: true
    },
    status: {
        type: String,
        optional: true
    },
    withFields: {
        type: Object,
        optional: true
    },
    'withFields.tax': {
        type: Number,
        decimal: true,
        optional: true
    },
    'withFields.offsetInterest': {
        type: Number,
        decimal: true,
        optional: true
    },
    'withFields.penalty': {
        type: Number,
        decimal: true,
        optional: true
    },
    voucherId: {
        type: String
        //optional:true
        //unique: true
        //custom: function () {
        //    if (this.value !== this.field('password').value) {
        //        return "voucherIdIsUnique";
        //    }
        //}
    },
    accountId: {
        type: String
    },
    memo: {
        type: String,
        optional: true
    },
    cpanel_branchId: {
        type: String
    }
});

/**
 * Attach schema
 */
Saving.Collection.Perform.attachSchema(Saving.Schema.Perform);

/**
 * Errors message
 */
SimpleSchema.messages({
    "performDateIsGte": "[label] must be granter than or equal the last doc",
    "voucherIdIsUnique": "[label] is unique"
});
