// Collection
Saving.Collection.Staff = new Mongo.Collection("saving_staff");

// Schema
Saving.Schema.Staff = new SimpleSchema({
    name: {
        type: String,
        label: "Name",
        max: 200
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
    position: {
        type: String,
        label: "Position",
        autoform: {
            type: "select2",
            options: function () {
                return Saving.List.position();
            }
        }
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
        type: String
    }
});

/**
 * Attach schema
 */
Saving.Collection.Staff.attachSchema(Saving.Schema.Staff);
