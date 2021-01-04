import React, { useState, useEffect } from "react";
import { socket } from "../socket";

export const QrTesting = () => {
	const [src, setSrc] = useState("");
	const [show, setShow] = useState(false);

	const QrCode = ({ src }) => <img src={src} alt='qr code' />;

	useEffect(() => {
		socket.emit("testing", "testing");
		socket.on("qr", (qr) => {
			setSrc(qr);
			setShow(true);
		});
	}, []);

	return <>{show === true ? <QrCode src={src} /> : null}</>;
};
