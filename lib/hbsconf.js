const i18n = require('./i18nSetup')();

module.exports = {
    //Setup our default layout
    defaultLayout: 'index',
 
    //More handlebars configuration
    // ..
 
    //Register handlebars helpers
  helpers: {
    //Register your helpers
    // ..
    //Helper for multiple languages
    i18n: function(str){
        //return i18n.__.apply(this, arguments);
        return i18n.__(str);   // Both lines do the same thing
    },
    getLocales: function() {
        return getLocales();
    }
  }
}

// module.exports = hbsconf;
