const { BorrowingData } = require("../server");

//  @desc   Get All Borrowing Data
//  @route  GET /api/v1/borrowingData
//  @access public
exports.getBorrowingData = async (req, res, next) => {
	try {
		const borrowingData = await BorrowingData.find();

		return res.status(200).json({
			success: true,
			count: borrowingData.length,
			data: borrowingData,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: "Server Error",
		});
	}
};

exports.getSpecificBorrowingData = async (req, res, next) => {
	try {
		const borrowingData = await BorrowingData.findById(req.params.id);

		return res.status(200).json({
			success: true,
			count: borrowingData.length,
			data: borrowingData,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: "Server Error",
		});
	}
};

//  @desc   Add Borrowing Data
//  @route  POST /api/v1/borrowingData
//  @access public
exports.addBorrowingData = async (req, res, next) => {
	try {
		const {
			name,
			nim,
			room,
			startDate,
			time,
			status,
			usage,
			fileName,
			phoneNum,
		} = req.body;

		const borrowingData = await BorrowingData.create(req.body);

		return res.status(201).json({
			success: true,
			data: borrowingData,
		});
	} catch (err) {
		if (err.name === "ValidationError") {
			const messages = Object.values(err.errors).map((value) => value.message);

			return res.status(400).json({
				success: false,
				error: messages,
			});
		} else {
			res.status(500).json({
				success: false,
				error: "Server Error",
			});
		}
	}
};

//  @desc   Delete Borrowing Data
//  @route  DELETE /api/v1/borrowingData/:id
//  @access public
exports.deleteBorrowingData = async (req, res, next) => {
	try {
		const borrowingData = await BorrowingData.findById(req.params.id);

		if (!borrowingData) {
			return res.status(404).json({
				success: false,
				error: "No Borrowing Data found",
			});
		}

		await borrowingData.remove();
		return res.status(200).json({
			success: true,
			data: {},
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: "Server Error",
		});
	}
};

//  @desc   Update Borrowing Data
//  @route  UPDATE /api/v1/borrowingData/:id
//  @access public
exports.updateBorrowingData = async (req, res, next) => {
	try {
		const {
			name,
			nim,
			room,
			startDate,
			time,
			status,
			usage,
			fileName,
			phoneNum,
		} = req.body;

		const borrowingData = await BorrowingData.findById(
			req.params.id,
			(err, newData) => {
				newData.status = status;
				newData.save();
			}
		);

		if (!borrowingData) {
			return res.status(404).json({
				success: false,
				error: "No Borrowing Data found",
			});
		}

		return res.status(201).json({
			success: true,
			data: borrowingData,
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			error: "Server Error",
		});
	}
};
