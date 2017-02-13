/**
 * Created by JosephDSinclair on 2/11/2017.
 */
require('dotenv').load();
var keystone = require('keystone');
var serve = require('serve-static');
var multer = require('multer');
var cookieSecret = 'secretCookie';
var Types = keystone.Field.Types;


keystone.init({
    'name': 'School Notes Magazine',
    'brand': 'Website Brand',
    'session': true,
    'updates': 'updates',
    'auth': false,
    'user model': 'User',
    'auto update': true,
    'cookie secret': cookieSecret,
    'port': 3001
});

//    'port': 3001


// Load project's Models
keystone.import('models');


// Setup common locals for your emails. The following are required by Keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
    logo_src: '/images/logo-email.gif',
    logo_width: 194,
    logo_height: 76,
    theme: {
        email_bg: '#f9f9f9',
        link_color: '#2697de',
        buttons: {
            color: '#fff',
            background_color: '#2697de',
            border_color: '#1a7cb7'
        }
    }
});

// Setup replacement rules for emails, to automate the handling of differences
// between development a production.

// Be sure to update this rule to include your site's actual domain, and add
// other rules your email templates require.

keystone.set('email rules', [{
    find: '/images/',
    replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/images/' : 'http://localhost:3000/images/'
}, {
    find: '/keystone/',
    replace: (keystone.get('env') == 'production') ? 'http://www.your-server.com/keystone/' : 'http://localhost:3000/keystone/'
}]);

// Load your project's email test routes

keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
    'users': 'users'
});

module.exports = keystone;
