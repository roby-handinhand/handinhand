
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
var Sponsorship = sequelize.import('./models/sponsorship');

// Join operations & quick ways to query data w/o mucking with the model
// This is specifically necessary because we want to join across tables w/o any foreign keys
// The crux of every ORM is the limitations
var sponsor_fields = [
    'name', 'npo02__averageamount__c', 'mailingcity', 'id',
    'npo02__lastoppamount__c', 'sex__c', 'mailingstate', 'homephone',
    'email', 'npo02__oppamountthisyear__c', 'lastname', 'mailingstreet',
    'gender__c', 'firstname', 'mailingcountry', 'category__c',
    'npo02__lastclosedate__c', 'sfid', 'mailingpostalcode', 'recordtypeid'
];

var child_fields = [
    'name',
    'createddate',
    'id',
    'sex__c',
    'mailingstate',
    'handicap__c',
    'extended_family__c',
    'lastname',
    'gender__c',
    'firstname',
    'orphan_status__c',
    'category__c',
    'sfid',
];

function getSponsoredChildrenForUser(local_user, optional_fields) {
    return getContactForUser(local_user).then(function(sponsor) {
        return getSponsoredChildrenForSponsor(sponsor, optional_fields);
    });
}

function getSponsoredChildrenForSponsor(sponsor, optional_fields) {
    if (!optional_fields) {
        optional_fields = child_fields;
    }
    return sequelize.query("SELECT " + optional_fields.join(',') + " " +
        "FROM salesforce.sponsorship__c AS sponsorship " +
        "JOIN salesforce.contact ON contact.sfid = sponsorship.child__c " +
        "WHERE sponsorship.sponsor__c = :sponsorid", {
            replacements: {
                sponsorid: sponsor.sfid
            },
            type: sequelize.QueryTypes.SELECT
        }
    );
}

function getContactForUser(local_user) {
	return Contact.findOne({
        attributes: sponsor_fields,
        where: {
            'email': local_user.local_email
        }
    });
}
// Explicitly do NOT sync Contact. This is a Heroku Connect managed table, and we don't want to modify it

module.exports = {
    LocalUser: LocalUser,
    Contact: Contact,
    RecordType: RecordType,
    Utils: {
        getSponsoredChildrenForUser,
        getSponsoredChildrenForSponsor,
        getContactForUser
    }
}
