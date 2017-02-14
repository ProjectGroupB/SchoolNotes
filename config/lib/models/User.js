var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 * // TODO This isn't being used right now either since all this is done in user.server.model.js
 * // leaving this as an example for a KeystoneJS model, which is just a variation of a schema
 */
var User = new keystone.List('User');

User.add({
    name: { type: Types.Name, required: true, index: true },
    email: { type: Types.Email, initial: true, required: true, index: true },
    password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
    isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
    return this.isAdmin;
});


/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
