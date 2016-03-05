Router.route('saving/outstandingReport', function () {
    this.render('saving_outstandingReport');
}, {
    name: 'saving.outstandingReport',
    title: "Outstanding Report",
    header: {title: 'Outstanding Report', sub: '', icon: 'file-text-o'},
    breadcrumb: {title: 'Outstanding Report', parent: 'saving.home'}
});

Router.route('saving/outstandingReportGen', function () {
    // Config layout
    this.layout('reportLayout', {
        // Page size: a4, a5, mini | Orientation: portrait, landscape
        data: {
            pageSize: 'a4',
            orientation: 'portrait'
        }
    });

    /*var q = this.params.query;*/
    this.render('saving_outstandingReportGen', {
        /*data: function () {
            return q;
        }*/
    });
});
