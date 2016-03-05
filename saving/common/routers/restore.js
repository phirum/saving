Router.route('saving/restore', function () {
    this.render('saving_restore');
}, {
    name: 'saving.restore',
    header: {title: 'Restore', sub: '', icon: 'upload'},
    title: 'Restore'
});