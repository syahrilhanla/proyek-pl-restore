import React, { useState, useEffect } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

function Alert(props) {
	return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
		"& > * + *": {
			marginTop: theme.spacing(6),
		},
	},
}));

export default function CustomizedSnackbars({
	isOpen,
	alertColor,
	alertText,
	transition,
}) {
	const classes = useStyles();
	const [open, setOpen] = useState(isOpen);
	const [position, setPosition] = useState({
		vertical: "top",
		horizontal: "center",
	});

	useEffect(() => {
		setOpen(isOpen);
	}, [isOpen]);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};

	const { vertical, horizontal } = position;

	return (
		<div className={classes.root}>
			<Snackbar
				open={open}
				autoHideDuration={6000}
				onClose={handleClose}
				anchorOrigin={{ vertical, horizontal }}
			>
				<Alert onClose={handleClose} severity={alertColor}>
					{alertText}
				</Alert>
			</Snackbar>
		</div>
	);
}
