/**
 * Admin
 */
Security.defineMethod("saving_ifAdmin", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['admin'], 'Saving');
    }
});

/**
 * General
 */
Security.defineMethod("saving_ifGeneral", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['general'], 'Saving');
    }
});

/**
 * Reporter
 */
Security.defineMethod("saving_ifReporter", {
    fetch: [],
    transform: null,
    deny: function (type, arg, userId) {
        return !Roles.userIsInRole(userId, ['reporter'], 'Saving');
    }
});
