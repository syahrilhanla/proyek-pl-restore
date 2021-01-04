const express = require("express");
const router = express.Router();
const {
	getBorrowingData,
	addBorrowingData,
	deleteBorrowingData,
	updateBorrowingData,
	getSpecificBorrowingData,
} = require("../controllers/borrowingDataController");

router.route("/").get(getBorrowingData).post(addBorrowingData);

router
	.route("/:id")
	.get(getSpecificBorrowingData)
	.put(updateBorrowingData)
	.delete(deleteBorrowingData);

module.exports = router;
