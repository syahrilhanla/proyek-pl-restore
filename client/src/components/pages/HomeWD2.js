import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../globalState/GlobalState";
import { Navbar } from "../Navbar";
import { Redirect } from "react-router-dom";
import { checkLogin } from "./HomeAdmin";
import { TimeLineCardNew } from "../TimeLineCardNew";
import { Footer } from "../Footer";
import { socket } from "../socket";
import Alerts from "../Alerts";
import { FormDialogWhatsApp } from "../FormDialogWhatsApp";

export const HomeWD2 = () => {
	const {
		borrowingList,
		getBorrowingData,
		getLoginInfo,
		anyUpdate,
		getPictures,
	} = useContext(GlobalContext);

	const [invisible, setInvisible] = useState(true);
	const [alertColor, setAlertColor] = useState("");
	const [alertText, setAlertText] = useState("");
	const [open, setOpen] = useState(false);
	// eslint-disable-next-line
	const [showQr, setShowQr] = useState(true);

	useEffect(() => {
		getBorrowingData();
		getLoginInfo();
		setTimeout(() => {
			console.log("borrowingList", borrowingList);
		}, 5000);
		getPictures();
		// eslint-disable-next-line
	}, [anyUpdate]);

	socket.on("notification", (notification) => {
		setAlertColor("error");
		setAlertText(`Terdapat Pembaruan, Halaman Telah Diperbarui!`);
		setInvisible(false);
		// eliminate alert after a certain time
		setTimeout(() => {
			setOpen(false);
		}, 5000);
		setOpen(true);
	});

	const Home = () => {
		return (
			<>
				<div className='container'>
					<label>
						<h1 style={{ borderBottom: "2px solid #b8bdb5" }}>Lini Masa</h1>
					</label>
					<div style={{ height: "71vh", overflow: "auto" }}>
						{borrowingList
							.filter((list) => list.status === 2)
							.map((list) => (
								<TimeLineCardNew key={list._id} borrowingList={list} />
							))}
					</div>
				</div>
				{showQr === true ? <FormDialogWhatsApp showQr={showQr} /> : null}
			</>
		);
	};

	return (
		<>
			<Navbar user={"adm"} invisible={invisible} setInvisible={setInvisible} />
			<>{checkLogin ? <Home /> : <Redirect to='/' />}</>
			<Alerts isOpen={open} alertColor={alertColor} alertText={alertText} />
			<Footer />
		</>
	);
};
