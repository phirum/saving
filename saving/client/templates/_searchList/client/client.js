/**
 * Declare template
 */
var indexTpl = Template.saving_clientSearch,
    listTpl = Template.saving_clientSearchList;

/**
 * Index
 */
indexTpl.onRendered(function () {
    var instance = EasySearch.getComponentInstance({
        index: 'saving_clientSearch'
    });

    EasySearch.changeProperty('saving_clientSearch', 'filteredBranch', Session.get('currentBranch'));
    EasySearch.changeLimit('saving_clientSearch', 10);

    instance.paginate(1);
    instance.triggerSearch();
});

/**
 * List
 */
listTpl.helpers({
    data: function () {
        var self = this;
        if (!_.isUndefined(self.photo)) {
            self.photoUrl = Files.findOne(self.photo).url();
        } else {
            self.photoUrl = '/no.jpg';
        }

        return self;
    }
});
