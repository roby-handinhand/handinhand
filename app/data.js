
// load up the user model
var configDB = require('../config/database.js');
var Sequelize = require('sequelize');
var pg = require('pg').native;
var pghstore = require('pg-hstore');
console.log("Database is configured with URL: " + configDB.url);
var sequelize = new Sequelize(configDB.url, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: configDB.url.indexOf('localhost')==-1
  },
  // quoteIdentifiers will stop double-quoting table names & column names. That would make dealing with
  // HerokuConnect easier, but breaks case-sensitive columns
  quoteIdentifiers: false
});
var LocalUser        = sequelize.import('./models/local_user');
LocalUser.sync();
var Contact     = sequelize.import('./models/contact');
var RecordType  = sequelize.import('./models/recordtype');
// Explicitly do NOT sync Contact. This is a Heroku Connect managed table, and we don't want to modify it

module.exports = {
    LocalUser: LocalUser,
    Contact: Contact,
    RecordType: RecordType
}
