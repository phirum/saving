
Saving.Schema.Restore = new SimpleSchema({
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
    restoreType:{
        type:String,
        label:"Restore Type",
        autoform: {
            type: "select2",
            options:function(){
               return Saving.List.backupAndRestoreTypes();
            }
        }
    }
});