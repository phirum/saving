/**
 * Schema
 */
Saving.Schema.HistoryReport = new SimpleSchema({
    client: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.client();
            }
        }
    },
    account: {
        type: String,
        autoform: {
            type: "select2",
            options: function () {
                return Saving.ListForReport.accountForClient();
            }
        }
    },
    date:{
        type:String,
        optional:true
    }
});