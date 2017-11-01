'use strict';

/* let register = function(Handlebars) {
    let helpers = {
        i18nHelper: function() { return 'AABB';}
    }
};
for (let prop in register.helpers) {
    Handlebars.registerHelper(prop, helpers[prop]);
}

module.exports.register = register;
module.exports.helpers = register(null);
*/

exports.yell = function(msg) {
    return msg.toUpperCase();
}