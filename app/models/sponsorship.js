
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sponsorship', {
        isdeleted             : DataTypes.BOOLEAN,
        child__c              : DataTypes.STRING(18),
        end_date__c           : DataTypes.DATE,
        id                    : { type: DataTypes.INTEGER, primaryKey: true },
        systemmodstamp        : DataTypes.TIME,
        sponsorship_amount__c : DataTypes.DOUBLE,
        name                  : DataTypes.STRING(80),
        _hc_lastop            : DataTypes.STRING(32),
        _hc_err               : DataTypes.STRING,
        createddate           : DataTypes.TIME,
        begin_date__c         : DataTypes.DATE,
        sponsor__c            : DataTypes.STRING(18),
        sfid                  : DataTypes.STRING(18)
	},
	{
        // Config
        tableName: 'salesforce.sponsorship__c',
        freezeTableName: true,
        underscored: false,
        paranoid: true,
        timestamps: false
	});
}
