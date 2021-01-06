import React, { useContext } from "react";
import { StickyHeadTable } from "../StickyHeadTable";
import { GlobalContext } from "../globalState/GlobalState";
import { Breadcrumb } from "../Breadcrumb";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";
import { socket } from "../socket";

export const SeeScheduleMHS = () => {
	const { loginInfo, getBorrowingData } = useContext(GlobalContext);

	socket.on("notification", (notification) => {
		getBorrowingData();
	});

	return (
		<>
			<Navbar user={"mhs"} />
			<div className='container'>
				<Breadcrumb loginInfo={loginInfo} />
			</div>
			<div className='container-schedule'>
				<StickyHeadTable />
			</div>
			<Footer />
		</>
	);
};
