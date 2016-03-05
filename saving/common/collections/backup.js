
Saving.Schema.Backup = new SimpleSchema({
    branch:{
        type:String,
        label:"Branch",
        autoform: {
            type: "select2",
            options:function(){
                return Saving.List.branchForUser();
            }
        },
        optional:true
    },

    backupType:{
        type:String,
        label:"Backup Type",
        autoform: {
            type: "select2",
            options:function() {
                return Saving.List.backupAndRestoreTypes();
            }
        }
    }
});