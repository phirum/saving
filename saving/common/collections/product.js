/**
 * Collection
 */
Saving.Collection.Product = new Mongo.Collection("saving_product");

/**
 * Schema
 */
Saving.Schema.Product = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        unique: true,
        max: 200
    },
    rate: {
        type: Number,
        decimal: true,
        label: "Rate"
    },
    memo: {
        type: String,
        label: "Memo",
        max: 500,
        optional: true
    }
});

/**
 * Attach schema
 */
Saving.Collection.Product.attachSchema(Saving.Schema.Product);
