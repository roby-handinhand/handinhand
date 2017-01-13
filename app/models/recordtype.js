
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('recordtype', {
        createddate     : DataTypes.TIME,
        systemmodstamp  : DataTypes.TIME,
        developername   : DataTypes.STRING(80),
        namespaceprefix : DataTypes.STRING(15),
        name            : DataTypes.STRING(80),
        sfid            : DataTypes.STRING(18),
        _hc_err         : DataTypes.STRING,
        _hc_lastop      : DataTypes.STRING(32),
        description     : DataTypes.STRING(255),
        id              : { type: DataTypes.INTEGER, primaryKey: true },
        isactive        : DataTypes.BOOLEAN,
        sobjecttype     : DataTypes.STRING(40),
    },
    {
        // Config
        tableName: 'salesforce.recordtype',
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
