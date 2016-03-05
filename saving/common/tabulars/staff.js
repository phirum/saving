Saving.TabularTable.Staff = new Tabular.Table({
    name: "savingStaffList",
    collection: Saving.Collection.Staff,
    autoWidth: false,
    columnDefs: [
        {"width": "12px", "targets": 0}
    ],
    order: [['1', 'desc']],
    columns: [
        {title: '<i class="fa fa-bars"></i>', tmpl: Meteor.isClient && Template.saving_staffAction},
        {data: "_id", title: "ID"},
        {data: "name", title: "Name"},
        {data: "gender", title: "Gender"},
        {data: "dob", title: "Date of Birth"},
        {data: "position", title: "Position"},
        {data: "address", title: "Address"},
        {data: "telephone", title: "Telephone"},
        {data: "_accountCount", title: "ACC+"},
        {
            data: "photo",
            title: "Photo",
            render: function (val, type, doc) {
                if (_.isUndefined(val)) {
                    return null;
                } else {
                    var img = Files.findOne(val);
                    return '<img src="' + img.url() + '" class="img-circle" width="45px" height="45px">';
                }
            }
        }

    ]
});