// Collection
Saving.Collection.Setting = new Mongo.Collection("saving_setting");

// Schema
Saving.Schema.Setting = new SimpleSchema({
    tax: {
        type: Object
    },
    'tax.currentDeposit': {
        type: Number,
        decimal: true
    },
    'tax.fixDeposit': {
        type: Number,
        decimal: true
    },
    penaltyForFixDeposit: {
        type: Number,
        decimal: true
    }
});

// Attach schema
Saving.Collection.Setting.attachSchema(Saving.Schema.Setting);
