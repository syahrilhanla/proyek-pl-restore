import React, { useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import { cardStyle } from "./TimeLineCardNew";

import { GlobalContext } from "./globalState/GlobalState";
import { Chips } from "./Chips";
import { FormDialogDetails } from "./FormDialogDetails";

const columns = [
	{ id: "usage", label: "Keperluan", minWidth: 140, align: "center" },
	{ id: "status", label: "Status", minWidth: 70, align: "center" },
	{
		id: "room",
		label: "Ruangan",
		minWidth: 110,
		align: "center",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "startDate",
		label: "Awal Pinjam",
		minWidth: 150,
		align: "center",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "time",
		label: "Waktu",
		minWidth: 130,
		align: "center",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "name",
		label: "Nama",
		minWidth: 130,
		align: "center",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "phoneNum",
		label: "No. Tlp",
		minWidth: 130,
		align: "center",
	},
	{
		id: "deleteAction",
		label: "Aksi",
		minWidth: 10,
		align: "center",
		format: (value) => value.toLocaleString("en-US"),
	},
];

function createData(
	usage,
	status,
	room,
	startDate,
	time,
	name,
	phoneNum,
	deleteAction
) {
	return {
		usage: usage,
		status: status,
		room: room,
		startDate: startDate,
		time: time,
		name: name,
		phoneNum: phoneNum,
		deleteAction: deleteAction,
	};
}

const useStyles = makeStyles({
	root: {
		width: "100%",
	},
	container: {
		maxHeight: 440,
	},
	tableHead: {
		backgroundColor: "#2c2b2b",
		color: "#ffffff",
	},
});

const buttonDelete = {
	padding: "8px 20px",
	borderRadius: "4px",
	outline: "none",
	border: "none",
	fontSize: "18px",
	color: "white",
	cursor: "pointer",
	backgroundColor: "#ff1818",
};

export const StickyHeadTableADM = () => {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	// For FormDialogDetails:
	const [open, setOpen] = React.useState(false);
	const [selectedRow, setSelectedRow] = React.useState(false);

	// useEffect when table body clicked
	useEffect(() => {
		const childState = {
			open: open,
			selectedRow: selectedRow,
		};
		getChildStates(childState);
	}, [open]);

	// Fetching data from global state
	const { borrowingList, deleteBorrowingData, getChildStates } = useContext(
		GlobalContext
	);

	// Decide status for FormDialogDetails:
	const styles = cardStyle(borrowingList);

	// Sort table contents based on time added
	const sortedBorrowingList = borrowingList.sort((a, b) => {
		const timeA = a.addedAt;
		const timeB = b.addedAt;

		return timeB - timeA;
	});

	// Turns status to chips
	const statusFormatter = (status) => {
		if (status === 1) {
			return <Chips status={status} size='small' label='Baru' />;
		} else if (status === 2) {
			return <Chips status={status} size='small' label='Proses' />;
		} else if (status === 3) {
			return <Chips status={status} size='small' label='Disetujui' />;
		}
	};

	// putting data from global state to rows
	const rows = sortedBorrowingList.map((content) =>
		createData(
			content.usage,
			statusFormatter(content.status),
			content.room,
			content.startDate,
			content.time,
			content.name,
			"0" + content.phoneNum,
			<button
				onClick={() => deleteBorrowingData(content._id, content.fileName)}
				style={buttonDelete}
			>
				X
			</button>
		)
	);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const showDetails = (row) => {
		console.log(row);
		setSelectedRow(row);
		setOpen(!open);
	};

	return (
		<>
			<Paper className={classes.root}>
				<TableContainer className={classes.container}>
					<Table aria-label='sticky table'>
						<TableHead>
							<TableRow className={classes.tableHead}>
								{columns.map((column) => (
									<TableCell
										className={classes.tableHead}
										key={column.id}
										align={column.align}
										style={{ minWidth: column.minWidth }}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody className='table'>
							{rows
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow
											hover
											role='checkbox'
											tabIndex={-1}
											key={row.code}
											onClick={() => showDetails(row)}
											style={{ cursor: "pointer" }}
										>
											{columns.map((column) => {
												const value = row[column.id];
												return (
													<TableCell key={column.id} align={column.align}>
														{column.format && typeof value === "number"
															? column.format(value)
															: value}
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 20]}
					component='div'
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			{/* Open Card Details of The Proposal */}
			{open === true ? (
				<FormDialogDetails
					borrowingList={selectedRow}
					styles={styles}
					open={open}
				/>
			) : null}
		</>
	);
};
