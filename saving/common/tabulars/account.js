Saving.TabularTable.Account = new Tabular.Table({
    name: "savingAccountList",
    collection: Saving.Collection.Account,
    pagingType: "full_numbers",
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_accountAction},
        {data: "_id", title: "ID"},
        {data: "accDate", title: "Acc Date"},
        {data: "cpanel_currencyId", title: "Currency"},
        {data: "productId", title: "Product"},
        {data: "term", title: "Term"},
        {data: "maturityDate", title: "Maturity"},
        {data: "cycle", title: "Cycle"},
        {data: "clientId", title: "Client ID"},
        {data: "_client.khName", title: "Client Kh Name"},
        //{data: "_client.enName", title: "Client En Name"},
        {
            data: "_performCount",
            title: "DW+",
            render: function (val, type, doc) {
                var count = _.isUndefined(val) ? 0 : val;
                if (count > 0) {
                    return '<span class="label label-primary">' + count + '</span>';
                }
                return '<span class="label label-danger">' + count + '</span>';
            }
        }
        //{data: "staffId", title: "Staff ID"},
        //{data: "_staff.name", title: "Staff Name"}
    ]
});