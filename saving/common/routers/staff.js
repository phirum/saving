Router.route('saving/staff', function () {

    this.render('saving_staff');

}, {
    name: 'saving.staff',
    title: "Staff",
    header: {title: 'Staff', sub: '', icon: 'user-plus'},
    breadcrumb: {title: 'Staff', parent: 'saving.home'}
});