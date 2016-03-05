Saving.TabularTable.Product = new Tabular.Table({
    name: "savingProductList",
    collection: Saving.Collection.Product,
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    //order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_productAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "rate", title: "Rate"}
    ]
});