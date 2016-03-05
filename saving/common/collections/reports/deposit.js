/**
 * Schema
 */
Saving.Schema.DepositReport = new SimpleSchema({
    branch: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.branch();
            }
        }
    },
    currency: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.currency();
            }
        }
    },
    product: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.product();
            }
        }
    },
    staff: {
        type: String,
        optional: true,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.staff();
            }
        }
    },
    date: {
        type: String
    },
    exchange: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.exchange();
            }
        }
    }
});