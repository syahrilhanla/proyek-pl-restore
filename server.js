const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");
const colors = require("colors");
// #1 middleware to see request in dev mode
const morgan = require("morgan");
// #1
const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const { BorrowingDataSchema } = require("./models/BorrowingData");
// whats app api
const qrcode = require("qrcode");
const { Client } = require("whatsapp-web.js");
const fs = require("fs");

const app = express();
app.use(cors());

// define the session for whats app user session login
const SESSION_FILE_PATH = "./whatsapp-session.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
	sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({
	restartOnAuthFail: true,
	puppeteer: {
		headless: true,
		args: [
			"--no-sandbox",
			"--disable-setuid-sandbox",
			"--disable-dev-shm-usage",
			"--disable-accelerated-2d-canvas",
			"--no-first-run",
			"--no-zygote",
			"--disable-gpu",
		],
	},
	session: sessionCfg,
});

// SOCKET IO STUFF (FOR REALTIME FEATURES) ####################
const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});
client.initialize();
// Fires when there's new connection
io.on("connection", (socket) => {
	socket.on("wa-login", (testing) => {
		console.log(testing);
		client.on("qr", (qr) => {
			console.log("QR RECEIVED", qr);
			qrcode.toDataURL(qr, (err, url) => {
				socket.emit("qr", url);
			});
		});
	});

	client.on("authenticated", (session) => {
		// console.log("AUTHENTICATED", session);
		socket.emit("authenticated", "Anda sudah Terautentikasi!");
		sessionCfg = session;
		fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
			if (err) {
				console.error(err);
			}
		});
	});

	client.on("auth_failure", function (session) {
		socket.emit("message", "Gagal Autentikasi, Mencoba Kembali...");
	});

	client.on("disconnected", (reason) => {
		socket.emit("message", "Whatsapp Terputus!");
		fs.unlinkSync(SESSION_FILE_PATH, function (err) {
			if (err) return console.log(err);
			console.log("Session file deleted!");
		});
		client.destroy();
		client.initialize();
	});

	// Fires when status is updated
	socket.on("newStatus", (newStatus) => {
		const { name, room, status, phoneNum } = newStatus;
		console.log(name, room, status, `62${phoneNum}`);

		const message = () => {
			if (status === 2) {
				return `Permintaan Peminjaman ${name} atas ${room} Sedang Diproses!`;
			} else if (status === 3) {
				return `Permintaan Peminjaman ${name} atas ${room} Disetujui!`;
			}
		};

		const text = message();
		io.emit("notification", text);
		client.sendMessage(
			`62${phoneNum}@c.us`,
			`Assalamu'alaikum Wr. Wb. Ini merupakan pesan satu arah secara otomatis. Permohonan ${name} atas peminjaman ${room} telah masuk daftar antrian. Tunggu informasi lebih lanjut di ruang pesan ini. Terima kasih.`
		);
	});

	// Fires when there's a new proposal
	socket.on("newBorrowing", (newBorrowing) => {
		const { name, room, status, phoneNum } = newBorrowing;
		console.log(name, room, status, phoneNum);

		const message = () => {
			return `${name} Mengajukan Peminjaman atas ${room}`;
		};

		const text = message();
		io.emit("notification", text);
		client.sendMessage(
			`62${phoneNum}@c.us`,
			`Assalamu'alaikum Wr. Wb. Ini merupakan pesan satu arah secara otomatis. Permohonan ${name} atas peminjaman ${room} sedang menunggu persetujuan Dekan. Tunggu informasi lebih lanjut di ruang pesan ini. Terima kasih.`
		);
	});

	// Fires when delete a data
	socket.on("deleteData", (deleteData) => {
		const { name, room, status, phoneNum } = deleteData;
		console.log(name, room, status, phoneNum);

		const message = () => {
			return `Permohonan Izin ${name} atas ${room} Ditolak!`;
		};

		const text = message();
		io.emit("notification", text);
		client.sendMessage(
			`62${phoneNum}@c.us`,
			`Assalamu'alaikum Wr. Wb. Ini merupakan pesan satu arah secara otomatis. Permohonan ${name} atas peminjaman ${room} telah ditolak. Terima kasih.`
		);
	});

	socket.on("disconnect", () => console.log("disconnected"));
});

// ############################################################

dotenv.config({ path: "./config/config.env" });
conn = new mongoose.createConnection(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

// Data Model
exports.BorrowingData = conn.model("BorrowingData", BorrowingDataSchema);

console.log(`MongoDB Connected: ${conn.host}`.cyan.underline.bold);

// PAGE ROUTING
const borrowingData = require("./routes/borrowingData");

app.use(express.json());

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// app.use('/mhs/api/v1/borrowingData', borrowingData);
app.use("/api/v1/borrowingData", borrowingData);

// FILE UPLOAD ###############
// Init gfs
let gfs;

conn.once("open", () => {
	// Init stream
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection("uploads");
});

// Create storage engine with crypto
const storage = new GridFsStorage({
	url: process.env.MONGO_URI,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = "" + file.originalname;
				const fileInfo = {
					filename: filename,
					bucketName: "uploads",
				};
				resolve(fileInfo);
			});
		});
	},
});
const upload = multer({ storage });

// @route GET /files
// @desc  Display all files in JSON
app.get("/files", (req, res) => {
	gfs.files.find().toArray((err, files) => {
		// Check if files
		if (!files || files.length === 0) {
			return res.status(404).json({
				err: "No files exist",
			});
		}

		// Files exist
		return res.json(files);
	});
});

// @route GET /files/:filename
// @desc Display Image
app.get(
	["/files", "/:filename", "/adm/:filename", "/wd-2/:filename"],
	(req, res) => {
		gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
			// Check if file
			if (!file || file.length === 0) {
				return res.status(404).json({
					err: "No file exists",
				});
			}

			// Check if image
			if (
				file.contentType === "image/jpeg" ||
				file.contentType === "image/png"
			) {
				// Read output to browser
				const readstream = gfs.createReadStream(file.filename);
				readstream.pipe(res);
			} else {
				res.status(404).json({
					err: "Not an image",
				});
			}
		});
	}
);

// @route POST /upload
// @desc  Uploads file to DB
app.post("/upload", upload.single("file"), (req, res) => {
	// res.json({ file: req.file });
	res.redirect("/");
});

// @route GET /files/:filename
// @desc  Display single file object
app.get("/image/:filename", (req, res) => {
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: "No file exists",
			});
		}
		// File exists
		return res.json(file);
	});
});

// @route DELETE /files/:id
// @desc  Delete file
app.delete("/files/:filename", (req, res) => {
	gfs.remove(
		{ filename: req.params.filename, root: "uploads" },
		(err, gridStore) => {
			if (err) {
				return res.status(404).json({ err: err });
			}

			res.redirect("/");
		}
	);
});

// ############################################

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
	// Set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;

server.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
);
