import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core";
import { socket } from "./socket";

export function FormDialogWhatsApp({ showQr }) {
	const [isOpen, setIsOpen] = useState(false);
	const [src, setSrc] = useState("");
	const [show, setShow] = useState(false);
	const [message, setMessage] = useState("");
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		setIsOpen(showQr);
	}, [showQr]);

	const handleClick = () => {
		setIsOpen(!isOpen);
	};

	const useStyles = makeStyles({
		root: {
			width: "100%",
			margin: "auto",
			opacity: "90",
		},
		wrapper: {
			margin: "15px auto",
			padding: "15px 90px",
		},
	});

	const classes = useStyles();
	const QrCode = ({ src, isAuthenticated }) => {
		if (!isAuthenticated) {
			return (
				<>
					<img src={src} alt='qr code' />
					<p style={{ marginLeft: "1rem" }}>{message}</p>
				</>
			);
		} else {
			return (
				<>
					<p>{message}</p>
				</>
			);
		}
	};

	useEffect(() => {
		socket.emit("wa-login", "wa-login");
		socket.on("qr", (qr) => {
			setSrc(qr);
			setShow(true);
			setMessage("Autentikasi Terlebih Dahulu!");
		});
		socket.on("authenticated", (authenticated) => {
			console.log(authenticated);
			setIsAuthenticated(true);
			setShow(true);
			setMessage(authenticated);
			setTimeout(() => setShow(false), 1500);
		});
		socket.on("message", (message) => {
			setShow(true);
			setMessage(message);
		});
	}, []);

	return (
		<div>
			<Dialog
				open={show}
				aria-labelledby='form-dialog-title'
				className={classes.root}
				onClick={() => handleClick()}
			>
				<div className={classes.wrapper}>
					{show === false ? <p>Menyambungkan Whatsapp...</p> : null}
					{show === true ? (
						<QrCode src={src} isAuthenticated={isAuthenticated} />
					) : null}
				</div>
			</Dialog>
		</div>
	);
}
