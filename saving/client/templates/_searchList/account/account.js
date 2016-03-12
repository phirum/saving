/**
 * Declare template
 */
var indexTpl = Template.saving_accountSearch,
    listTpl = Template.saving_accountSearchList;

/**
 * Index
 */
indexTpl.onRendered(function () {
    var instance = EasySearch.getComponentInstance({
        index: 'saving_accountSearch'
    });

    EasySearch.changeProperty('saving_accountSearch', 'filteredBranch', Session.get('currentBranch'));
    EasySearch.changeLimit('saving_accountSearch', 10);

    instance.paginate(1);
    instance.triggerSearch();
});

/**
 * List
 */
listTpl.helpers({
    data: function () {
        var self = this;
        self._client.photoUrl = null;

        if (!_.isUndefined(self._client.photo)) {
            self._client.photoUrl = Files.findOne(self._client.photo).url();
        } else {
            self.photoUrl = '/no.jpg';
        }

        return self;
    }
});
