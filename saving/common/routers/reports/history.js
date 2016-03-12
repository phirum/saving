Router.route('saving/historyReport', function () {
    this.render('saving_historyReport');
}, {
    name: 'saving.historyReport',
    title: "History Report",
    header: {title: 'History Report', sub: '', icon: 'file-text-o'},
    breadcrumb: {title: 'History Report', parent: 'saving.home'},
   /* waitOn: function () {
        return [
            Meteor.subscribe('saving_client'),
            Meteor.subscribe('saving_account')
        ];
    }*/
});


Router.route('saving/historyReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini | Orientation: portrait, landscape
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });


    /* var q = this.params.query;*/
    this.render('saving_historyReportGen', {
        /* data: function () {
         return q;
         }*/
    });

});
