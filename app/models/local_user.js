// file app/models/user.js
// define the model for User


// load the things we need

var bcrypt   = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('local_user', {
		local_email			: DataTypes.STRING,
		local_password		: DataTypes.STRING,
		facebook_id			: DataTypes.STRING,
		facebook_token		: DataTypes.STRING,
		facebook_email		: DataTypes.STRING,
		facebook_name		: DataTypes.STRING,
		google_id			: DataTypes.STRING,
		google_token			: DataTypes.STRING,
		google_email			: DataTypes.STRING,
		google_name				: DataTypes.STRING
	},
	{
		underscored: true,
		underscoredAll: true,
		classMethods: {
			generateHash : function(password) {
				var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
				return hash;
			},
		},
		instanceMethods: {
			validPassword : function(password) {
				return bcrypt.compareSync(password, this.local_password);
			}
		},
        /*
		getterMethods: {
			someValue: function() {
				return this.someValue;
			}
		},
		setterMethods: {
			someValue: function(value) {
				this.someValue = value;
			}
		}
        */
	});
}
