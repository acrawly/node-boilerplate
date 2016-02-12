module.exports = function(config) {
    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host     : config.database_URL,
            user     : config.database_user,
            password : config.database_password,
            database : config.database,
            charset  : config.database_charset
        }
    });
    return require('bookshelf')(knex);
} 