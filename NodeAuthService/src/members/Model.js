const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = new mongoose.Schema({
	firstname: {
		type: String,
	},
	lastname: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	address: String,
	addressDetails: String,
	zipcode: String,
	city: String,
	phoneNumber: String,
	confirmed: {
		type: Boolean,
		defaultValue: false,
	},
	role: {
		type: Number,
		defaultValue: 0,
	}
});

Schema.pre('save', function (next) {
	bcrypt.hash(this.password, 12, (err, hash) => {
		if (!err) { this.set('password', hash); } else { console.log(err); }
		next();
	});
});

Schema.methods.comparePwd = function (plainPwd) {
	return bcrypt.compareSync(plainPwd, this.password);
};

module.exports = mongoose.model('Member', Schema);
