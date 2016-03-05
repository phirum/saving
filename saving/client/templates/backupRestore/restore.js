AutoForm.hooks({
    saving_restore: {
        onSubmit: function (doc) {
            var zipFileToLoad = $("#file-restore").prop('files')[0];
            var module = Session.get('currentModule');
            restore(zipFileToLoad, module, doc.restoreType, doc.branch);
            return false
        },
        onError: function (formType, error) {
            alertify.error(error.message);
        }
    }
});

