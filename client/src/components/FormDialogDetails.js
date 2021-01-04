import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles, Typography } from "@material-ui/core";

export function FormDialogDetails({ borrowingList, styles, open }) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setIsOpen(open);
	}, [open]);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const useStyles = makeStyles({
		root: {
			width: "100%",
			margin: "auto",
			opacity: "90",
		},
		title: {
			fontSize: 24,
			color: "#413F3F",
			fontFamily: "Arial, Helvetica, sans- serif",
			fontWeight: 700,
			cursor: "pointer",
		},
		pos: {
			marginBottom: 12,
		},
		wrapper: {
			margin: "15px auto",
			padding: "15px 90px",
		},
		key: {
			border: "1px solid #dddddd",
			textAlign: "left",
			padding: "8px",
			textAlign: "center",
		},
	});

	const classes = useStyles();

	const TableContent = ({ keyText, value }) => (
		<tr className='table-light'>
			<td>{keyText}</td>
			<td>: {value}</td>
		</tr>
	);

	const Text = ({ keyText, value }) => (
		<Typography variant='h5' component='h4'>
			{/* <table className={classes.table}>
				<tbody>
					<tr>
						<td className={classes.key}>{keyText}</td>
						<td className={classes.key}>:</td>
						<td className={classes.key} style={{ justifyContent: "flex-end" }}>
							{value}
						</td>
					</tr>
				</tbody>
			</table> */}
			<table className='table table-hover'>
				<tbody>
					<TableContent keyText={"Status"} value={styles.title} />
					<TableContent keyText={"Peminjam"} value={borrowingList.name} />
					<TableContent keyText={"Ruangan"} value={borrowingList.room} />
					<TableContent keyText={"NIM"} value={borrowingList.nim} />
					<TableContent
						keyText={"No. Telepon"}
						value={`0${borrowingList.phoneNum}`}
					/>
					<TableContent keyText={"Keperluan"} value={borrowingList.usage} />
					<TableContent keyText={"Tanggal"} value={borrowingList.startDate} />
					<TableContent
						keyText={"Waktu"}
						value={`${borrowingList.time} WITA`}
					/>
				</tbody>
			</table>
		</Typography>
	);

	return (
		<div>
			<Dialog
				open={isOpen}
				aria-labelledby='form-dialog-title'
				className={classes.root}
				onClick={() => handleClick()}
			>
				<div className={classes.wrapper}>
					<Typography
						variant='h2'
						component='h2'
						style={{ fontSize: "30px", margin: "15px auto" }}
					>
						Detail Peminjaman
					</Typography>

					<Text />
				</div>
			</Dialog>
		</div>
	);
}
