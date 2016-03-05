// Collection
Saving.Collection.Client = new Mongo.Collection("saving_client");

// Easy search
Saving.Collection.Client.initEasySearch([
    '_id',
    'khName',
    'enName',
    'idNumber'
]);

// Schema
Saving.Schema.Client = new SimpleSchema({
    khName: {
        type: String,
        label: "Kh Name",
        max: 200
    },
    khNickName: {
        type: String,
        label: "Kh Nick Name",
        max: 200,
        optional: true
    },
    enName: {
        type: String,
        label: "En Name",
        max: 200
    },
    enNickName: {
        type: String,
        label: "En Nick Name",
        max: 200,
        optional: true
    },
    gender: {
        type: String,
        label: "Gender",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.gender();
            }
        }
    },
    dob: {
        type: String,
        label: "Date of Birth"
    },
    idType: {
        type: String,
        label: "ID Type",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.idType();
            }
        }
    },
    idNumber: {
        type: String,
        label: "ID Number",
        max: 200,
        optional: true
    },
    //issuedDate: {
    //    type: String,
    //    label: "Issued Date",
    //    optional: true
    //},
    expiryDate: {
        type: String,
        label: "Expiry Date",
        optional: true
    },
    address: {
        type: String,
        label: "Address",
        max: 500
    },
    telephone: {
        type: String,
        label: "Telephone",
        max: 100,
        optional: true
    },
    email: {
        type: String,
        label: "Email",
        regEx: SimpleSchema.RegEx.Email,
        max: 100,
        optional: true
    },
    //occupation: {
    //    type: String,
    //    label: "Occupation",
    //    max: 200
    //},
    //occupationAddress: {
    //    type: String,
    //    label: "Occupation Address",
    //    max: 500
    //},
    photo: {
        type: String,
        autoform: {
            afFieldInput: {
                type: 'fileUpload',
                collection: 'Files',
                accept: 'image/*'
            }
        },
        optional: true
    },
    cpanel_branchId: {
        type: String,
        label: "Branch"
    }
});

/**
 * Attach schema
 */
Saving.Collection.Client.attachSchema(Saving.Schema.Client);
