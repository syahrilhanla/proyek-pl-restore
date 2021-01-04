const mongoose = require("mongoose");

const BorrowingDataSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please add name"],
	},
	nim: {
		type: String,
		required: false,
	},
	startDate: {
		type: String,
		required: [true, "Please add date"],
	},
	room: {
		type: String,
		required: [true, "Please add room"],
	},
	time: {
		type: String,
		required: [true, "Please add time"],
	},
	status: {
		type: Number,
		default: 1,
	},
	usage: {
		type: String,
		required: [true, "Please add usage"],
	},
	phoneNum: {
		type: Number,
		required: [true, "Please add phone number"],
	},
	addedAt: {
		type: Number,
		default: Date.now(),
	},
	fileName: {
		type: String,
		required: true,
	},
	hasRead: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model("BorrowingData", BorrowingDataSchema);
