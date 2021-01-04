import React, { useContext, useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { TimeLineCardNew } from "../TimeLineCardNew";
import { GlobalContext } from "../globalState/GlobalState";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import Alerts from "../Alerts";
import { socket } from "../socket";
import { FormDialogWhatsapp } from "../FormDialogWhatsapp";

// Check if logged in
export const checkLogin = (loginInfo) => {
	if (loginInfo[0] !== null) {
		return true;
	} else {
		return false;
	}
};

export const HomeAdmin = () => {
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
	const [showQr, setShowQr] = useState(true);

	useEffect(() => {
		getBorrowingData();
		getLoginInfo();
		setTimeout(() => {
			console.log("borrowingList", borrowingList);
		}, 5000);
		getPictures();
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
						<h1
							style={{
								borderBottom: "2px solid #b8bdb5",
								marginTop: "-20px",
							}}
						>
							Lini Masa
						</h1>
					</label>
					<div style={{ height: "71vh", overflow: "auto" }}>
						{borrowingList.map((list) => (
							<TimeLineCardNew key={list._id} borrowingList={list} />
						))}
					</div>
				</div>
				{showQr === true ? <FormDialogWhatsapp showQr={showQr} /> : null}
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
