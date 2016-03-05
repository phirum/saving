Router.route('saving/client', function () {

    this.render('saving_client');

}, {
    name: 'saving.client',
    title: "Client",
    header: {title: 'Client', sub: '', icon: 'user-plus'},
    breadcrumb: {title: 'Client', parent: 'saving.home'}
});