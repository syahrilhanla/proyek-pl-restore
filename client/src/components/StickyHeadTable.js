import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

import { GlobalContext } from "./globalState/GlobalState";
import { Chips } from "./Chips";

const columns = [
	{ id: "usage", label: "Keperluan", minWidth: 170, align: "center" },
	{ id: "status", label: "Status", minWidth: 100, align: "center" },
	{
		id: "room",
		label: "Ruangan",
		minWidth: 140,
		align: "center",
		format: (value) => value.toLocaleString("en-US"),
	},
	{
		id: "startDate",
		label: "Awal Pinjam",
		minWidth: 170,
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
];

function createData(usage, status, room, startDate, time) {
	return {
		usage: usage,
		status: status,
		room: room,
		startDate: startDate,
		time: time,
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

export const StickyHeadTable = () => {
	const classes = useStyles();
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);

	// Fetching data from global state
	const { borrowingList } = useContext(GlobalContext);
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
			content.time
		)
	);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	return (
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
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
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
	);
};
