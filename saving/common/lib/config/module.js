// Module
Module = typeof Module === 'undefined' ? {} : Module;
Meteor.isClient && Template.registerHelper('Module', Module);

Module.Saving = {
    name: 'Saving System',
    version: '0.0.2',
    summary: 'Saving Management System is ...',
    roles: [
        'admin',
        'general',
        'reporter'
    ]
};
