// file app/models/contact.js
// define the model for User


// load the things we need

var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('contact', {
        name                        : DataTypes.STRING(121),
        npo02__averageamount__c     : DataTypes.DOUBLE,
        createddate                 : DataTypes.TIME,
        mailingcity                 : DataTypes.STRING(40),
        id                          : { type: DataTypes.INTEGER, primaryKey: true },
        npo02__lastoppamount__c     : DataTypes.DOUBLE,
        sex__c                      : DataTypes.STRING(255),
        mailingstate                : DataTypes.STRING(80),
        handicap__c                 : DataTypes.BOOLEAN,
        homephone                   : DataTypes.STRING(40),
        email                       : DataTypes.STRING(80),
        extended_family__c          : DataTypes.STRING(255),
        npo02__oppamountthisyear__c : DataTypes.DOUBLE,
        lastname                    : DataTypes.STRING(80),
        mailingstreet               : DataTypes.STRING(255),
        gender__c                   : DataTypes.STRING(255),
        systemmodstamp              : DataTypes.TIME,
        _hc_lastop                  : DataTypes.STRING(32),
        firstname                   : DataTypes.STRING(40),
        orphan_status__c            : DataTypes.STRING(4099),
        mailingcountry              : DataTypes.STRING(80),
        category__c                 : DataTypes.STRING(255),
        npo02__lastclosedate__c     : DataTypes.DATE,
        sfid                        : DataTypes.STRING(18),
        _hc_err                     : DataTypes.STRING,
        isdeleted                   : DataTypes.BOOLEAN,
        mailingpostalcode           : DataTypes.STRING(20),
        recordtypeid                : DataTypes.STRING(18)
    },
    {
        // Config
        tableName: 'salesforce.contact',
        freezeTableName: true,
        underscored: false,
        paranoid: true,
        timestamps: false

        /*
        classMethods: {
        },
        instanceMethods: {
        },
        getterMethods: {
        },
        setterMethods: {
        }
        */
    });
}


