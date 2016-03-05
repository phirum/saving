// Easy search
EasySearch.createSearchIndex('saving_accountSearch', {
    collection: Saving.Collection.Account, // instanceof Meteor.Collection
    field: ['_id', '_client.khName', '_client.enName', '_staff.name'], // array of fields to be searchable
    //transform: function (doc) { // Support elastic-search only
    //    doc.dobVal = moment(doc.dob).format('DD-MM-YYYY');
    //},
    limit: 10,
    use: 'mongo-db', //  minimongo, elastic-search
    convertNumbers: true,
    props: {
        filteredBranch: 'All',
        sortBy: '_id'
    },
    sort: function () {
        //if (this.props.sortBy === 'khName') {
        //    return {'_client.khName': 1};
        //}

        // default by id
        return {'_id': 1};
    },
    query: function (searchString, opts) {
        // Default query that will be used for the mongo-db selector
        var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

        //console.log(opts);

        // filter
        if (this.props.filteredBranch.toLowerCase() !== 'all') {
            query.cpanel_branchId = this.props.filteredBranch;
        }

        return query;
    }
});
