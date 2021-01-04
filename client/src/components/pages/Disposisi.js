import React, { useContext, useEffect } from "react";
import { Button } from "../Button";
import { GlobalContext } from "../globalState/GlobalState";
import "./Disposisi.css";

export const Disposisi = () => {
	const { getSpecificBorrowingData, specificBorrowingData } = useContext(
		GlobalContext
	);

	// get id from live url
	const id = window.location.href.slice(36, 60);

	useEffect(() => {
		getSpecificBorrowingData(id);
	}, []);

	const DispositionDataTable = ({ index, data }) => {
		return (
			<tr>
				<td>{index}</td>
				<td>{data}</td>
			</tr>
		);
	};

	const DispositionTable = () => {
		const SwitchInput = ({ option }) => {
			const toWhom = [
				"Dekan",
				"Wakil Dekan 1",
				"Wakil Dekan 2",
				"Wakil Dekan 3",
				"Kasubag Umum",
			];
			const dispositionOption = [
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12,
				13,
				14,
				15,
			];

			// Check which column is selected
			const decideOptions = () => {
				if (option === "sender") {
					return (
						<>
							<input
								list='dari'
								type='text'
								placeholder='Masukkan Input...'
								name='dari'
							/>
							<datalist id='dari'>
								{toWhom.map((option) => (
									<option value={option} key={option} />
								))}
							</datalist>
						</>
					);
				} else if (option === "number") {
					return (
						<>
							<input
								list='number'
								type='text'
								placeholder='Masukkan Input...'
								name='number'
							/>
							<datalist id='number'>
								{dispositionOption.map((option) => (
									<option value={option} key={option} />
								))}
							</datalist>
						</>
					);
				}
			};

			return <>{decideOptions()}</>;
		};

		return (
			<tr>
				<td>{specificBorrowingData.startDate}</td>
				<td>{<SwitchInput option='sender' />}</td>
				<td>{<SwitchInput option='number' />}</td>
				<td>{<SwitchInput option='sender' />}</td>
			</tr>
		);
	};

	const Details = () => {
		return (
			<table>
				<tr>
					<td className='long'>Tanggal Surat</td>
					<td>: {specificBorrowingData.startDate}</td>
				</tr>
				<tr>
					<td className='long'>No. Surat</td>
					<td>: Tanggal Surat</td>
				</tr>
				<tr>
					<td className='long'>Dari</td>
					<td>: {specificBorrowingData.name}</td>
				</tr>
				<tr>
					<td className='long'>Isi Ringkas</td>
					<td>: {specificBorrowingData.usage}</td>
				</tr>
			</table>
		);
	};

	const Kop = () => {
		return (
			<table>
				<tr>
					<td>Tanggal Terima</td>
					<td>{specificBorrowingData.startDate}</td>
					<td>Agenda No.</td>
					<td>5624</td>
				</tr>
			</table>
		);
	};

	const dispositionData = [
		"Mohon Pertimbangan",
		"Mohon Pendapat",
		"Mohon Keputusan",
		"Mohon Petunjuk",
		"Mohon Saran",
		"Bicarakan",
		"Teliti/Ikuti Perkembangan",
		"Untuk Perhatian",
		"Siapkan Konsep",
		"Siapkan Laporan",
		"Untuk Diproses",
		"Selesaikan Sesuai Pembicaraan",
		"Edarkan",
		"Tik / Gandakan / Informasikan",
		"Arsip",
	];

	const Status = () => {
		return (
			<div className='status'>
				<span>
					<input type='radio' id='Penting' name='Penting' value='Penting' />
					<label htmlFor='Penting'>Penting</label>
				</span>
				<span>
					<input type='radio' id='Rahasia' name='Rahasia' value='Rahasia' />
					<label htmlFor='Rahasia'>Rahasia</label>
				</span>
				<span>
					<input type='radio' id='Segera' name='Segera' value='Segera' />
					<label htmlFor='Segera'>Segera</label>
				</span>
			</div>
		);
	};

	const PrintLetter = () => {
		const printLetter = () => {
			const letterOnly = document.querySelector(".no-print");
			const container = document.querySelector(".container-disposisi");
			letterOnly.style.display = "none";
			container.style.border = "none";
			window.print();
		};
		return (
			<div
				className='no-print'
				style={{ textAlign: "center" }}
				onClick={() => printLetter()}
			>
				<Button text='Print Surat' toWhom='#' />
			</div>
		);
	};

	return (
		<div className='root'>
			<div className='container-disposisi'>
				<div className='header'>
					<h2>KEMENTRIAN PENDIDIKAN DAN KEBUDAYAAN</h2>
					<h2>UNIVERSITAS LAMBUNG MANGKURAT</h2>
					<h2>FAKULTAS KEGURUAN DAN ILMU PENDIDIKAN</h2>
				</div>

				<div className='title'>
					<h2>LEMBAR DISPOSISI</h2>
				</div>

				<div className='kop'>
					<Kop />
				</div>

				<Status />

				<div className='details'>
					<Details />
				</div>

				<div className='tableInput'>
					<table>
						<tr>
							<th>Tanggal </th>
							<th>Dari </th>
							<th>Isi Disposisi</th>
							<th>Kepada</th>
						</tr>
						<DispositionTable />
					</table>
				</div>

				<div className='addition'>
					<table>
						<tr>
							<th>Disposisi</th>
							<th>:</th>
						</tr>
						{dispositionData.map((data, index) => (
							<DispositionDataTable key={index} index={index + 1} data={data} />
						))}
					</table>
				</div>
				<PrintLetter />
			</div>
		</div>
	);
};
