import React, { useContext, useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import { GlobalContext } from "../globalState/GlobalState";
import { Navbar } from "../Navbar";
import Alerts from "../Alerts";
import { Button } from "@material-ui/core";
import axios from "axios";

export const AddScheduleMHS = () => {
	const { addNewBorrowing, loginInfo } = useContext(GlobalContext);

	// loginInfo NIM
	const localLoginInfo = JSON.parse(localStorage.getItem("loginInfo"));
	const userNim = localLoginInfo.nim;

	// STATE
	const [name, setName] = useState("");
	// eslint-disable-next-line
	const [nim, setNim] = useState(userNim);
	const [usage, setUsage] = useState("");
	const [phoneNum, setPhoneNum] = useState("");
	const [room, setRoom] = useState("");
	const [startDate, setDate] = useState("");
	const [startTime, setStartTime] = useState("");
	const [finishTime, setFinishTime] = useState("");
	// eslint-disable-next-line
	const [status, setStatus] = useState(1);
	const [open, setOpen] = useState(false);
	const [alertColor, setAlertColor] = useState("");
	const [alertText, setAlertText] = useState("");
	const [fileName, setFileName] = useState("");
	const [file, setFile] = useState({});

	// HISTORY
	const history = useHistory();

	// REFS
	const refName = useRef("");

	// Make focus to input name
	useEffect(() => {
		refName.current.focus();
	}, []);

	// info Logger
	const log = (information) => {
		console.log(information);
	};

	// Turns date into formatted data
	const dateFormatter = (date, month, year) => {
		const months = [
			"Januari",
			"Februari",
			"Maret",
			"April",
			"Mei",
			"Juni",
			"Juli",
			"Agustus",
			"September",
			"Oktober",
			"November",
			"Desember",
		];
		const formattedMonth = months.filter(
			(element, index) => index === month - 1
		);

		return `${date} ${formattedMonth} ${year}`;
	};

	// Entering file to state
	const inputFile = (e) => {
		setFile(e.target.files[0]);
		setFileName(e.target.files[0].name);
	};

	const uploadFile = async () => {
		const formData = new FormData();
		formData.append("file", file);

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};

		try {
			// eslint-disable-next-line
			const res = await axios.post("/upload", formData, config);
		} catch (err) {
			console.log(err);
		}
	};

	const handleSubmit = (e) => {
		// GET FORMATTED DATA
		const time = `${startTime}-${finishTime}`;
		const year = startDate.slice(0, 4);
		const month = startDate.slice(5, 7);
		const date = startDate.slice(8, 11);

		// Creates new Object to push to database every time submit hit
		const newData = {
			name: name,
			nim: nim,
			room: room,
			usage: usage,
			phoneNum: phoneNum,
			startDate: dateFormatter(date, month, year),
			time: time,
			status: status,
			fileName: fileName,
		};

		//CHECK EMPTY FIELDS NOT DONE YET
		const fields = [
			name,
			nim,
			usage,
			phoneNum,
			room,
			startDate,
			startTime,
			finishTime,
			fileName,
		];

		const errorFound = () => {
			setAlertColor("error");
			setAlertText("Semua Kolom Harus Diisi!");
			setOpen(true);
			setTimeout(() => {
				setOpen(false);
			}, 3000);
		};

		const executeAddSchedule = () => {
			setAlertColor("success");
			setAlertText("Permintaan Berhasil Diajukan");
			setOpen(true);
			addNewBorrowing(newData);
			uploadFile();
			history.push("/mhs");
			setTimeout(() => {
				setOpen(false);
			}, 3000);
		};

		const checkFields = (fields) => {
			const value = fields.map((field) => {
				if (field === "") {
					e.preventDefault();
					return true;
				} else {
					return false;
				}
			});
			return value;
		};
		const isEmpty = checkFields(fields);
		console.log(isEmpty);
		const isAllEmpty = isEmpty.every((value) => value === true);
		if (isAllEmpty === false) {
			const verifyElements = isEmpty.every((value) => value === isEmpty[0]);
			console.log(verifyElements);
			verifyElements ? executeAddSchedule() : errorFound();
		} else {
			errorFound();
		}
		log(newData);
		// isEmpty(newData);
	};

	// ROOMS GENERATOR
	const rooms = ["Aula Hasan Bondan", "Aula Ki Hajar D."];
	const roomGen = () => {
		for (let i = 1; i <= 38; i++) {
			let room = `Ruang ${i}`;
			rooms.push(room);
		}
	};
	roomGen();
	// ###############################

	// A.N List
	const names = [
		"Pend. Komputer",
		"HIMPIKOM",
		"Pend. Kimia",
		"HIMKI",
		"Pend. Biologi",
		"HIMBIO",
	];
	// ################################

	const required = (text) => <span style={{ color: "red" }}>*{text}</span>;

	return (
		<>
			<Navbar user={"mhs"} />

			<div className='container'>
				<h1>Peminjaman Baru</h1>

				<form onSubmit={handleSubmit}>
					<div className='form-control'>
						<label htmlFor='names'>
							<h3>{required()} Atas Nama (Prodi/Organisasi)</h3>
						</label>
						<input
							ref={refName}
							list='names'
							type='text'
							placeholder='Masukkan Nama Organisasi/Program Studi'
							name='names'
							value={name}
							onChange={(e) => setName(e.target.value.toUpperCase())}
							className='input-normal'
						/>
						<datalist id='names'>
							{names.map((name) => (
								<option value={name} key={name} />
							))}
						</datalist>
					</div>
					<div className='form-control'>
						<label htmlFor='nim'>
							<h3>NIM</h3>
						</label>
						<input
							type='text'
							placeholder={nim}
							value={nim}
							className='input-normal nim'
							disabled
						/>
					</div>

					<div className='form-control'>
						<label htmlFor='noTelp'>
							<h3>{required()} Nomor Telepon/WA</h3>
						</label>
						<input
							type='text'
							placeholder='Masukkan Nomor Telepon/WA...'
							value={phoneNum}
							onChange={(e) => setPhoneNum(e.target.value)}
							className='input-normal'
						/>
					</div>

					<div className='form-control'>
						<label htmlFor='room'>
							<h3>{required()} Ruangan</h3>
						</label>
						<input
							list='room'
							type='text'
							placeholder='Masukkan Ruangan...'
							name='room'
							value={room}
							onChange={(e) => setRoom(e.target.value)}
							className='input-normal'
						/>
						<datalist id='room'>
							{rooms.map((room) => (
								<option value={room} key={room} />
							))}
						</datalist>
					</div>

					<div className='form-control'>
						<label htmlFor='keperluan'>
							<h3>{required()} Keperluan</h3>
						</label>
						<input
							type='text'
							placeholder='Masukkan Keperluan...'
							value={usage}
							onChange={(e) => setUsage(e.target.value.toUpperCase())}
							className='input-normal'
						/>
					</div>

					<div className='form-control'>
						<label>
							<h3>{required()} Tanggal Peminjaman</h3>
						</label>
						<br />
						<input
							type='date'
							value={startDate}
							placeholder='dd-mm-yyyy'
							onChange={(e) => setDate(e.target.value)}
							className='input-normal'
						/>
					</div>
					<div className='form-control '>
						<label>
							<h3>{required()} Waktu Peminjaman</h3>
						</label>
						<br />
						<div className='time'>
							<label htmlFor='starts'>
								<h4>Mulai</h4>
							</label>
							<input
								type='time'
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								className='input-half'
							/>

							<label htmlFor='finishes'>
								<h4>Sampai</h4>
							</label>
							<input
								type='time'
								value={finishTime}
								onChange={(e) => setFinishTime(e.target.value)}
								className='input-half'
							/>
						</div>

						<div className='form-control'>
							<label htmlFor='upload'>
								<h3>{required()}Foto Surat Pemberitahuan Dekan</h3>
								<span>{required("File Tidak Menggunakan Spasi")}</span>
								<br />
							</label>
							<br />

							<label htmlFor='file' style={{ marginTop: "-50px" }}>
								<input
									style={{ display: "none" }}
									id='file'
									name='file'
									type='file'
									accept='.jpg, .jpeg, .png'
									onChange={(e) => inputFile(e)}
								/>

								<Button
									color='secondary'
									variant='contained'
									component='span'
									style={{ minWidth: "450px" }}
								>
									Unggah Foto
								</Button>
							</label>
						</div>
					</div>

					<input
						type='submit'
						value='Ajukan Peminjaman'
						className='btn btn-primary'
						id='submit-btn'
					/>
					<br />
					<br />
				</form>
				<Alerts isOpen={open} alertColor={alertColor} alertText={alertText} />
			</div>
		</>
	);
};
