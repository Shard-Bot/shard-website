import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const serverConfigs = new Schema({
	ServerID: {
		type: String,
		required: true,
		unique: true,
	},
	Prefix: {
		type: String,
		default: 's!',
	},
	Channels: {
		type: Object,
	},
	Roles: {
		type: Object,
	},
	Users: {
		type: Object,
	},
	Modules: {
		type: Object,
	},
});

export default mongoose.model('serverConfigs', serverConfigs, 'serverconfigs');
