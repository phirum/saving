Router.route('saving/product', function () {

    this.render('saving_product');

}, {
    name: 'saving.product',
    title: "Product",
    header: {title: 'Product', sub: '', icon: 'user-plus'},
    breadcrumb: {title: 'Product', parent: 'saving.home'}
});