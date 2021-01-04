import React, { useContext, useEffect, useState } from "react";
import { StickyHeadTableADM } from "../../components/StickyHeadTableADM";
import { GlobalContext } from "../globalState/GlobalState";
import { Navbar } from "../Navbar";
import { Footer } from "../Footer";

export const SeeScheduleAdmin = () => {
	const { childStates, getBorrowingData, getLoginInfo } = useContext(
		GlobalContext
	);
	const [invisible, setInvisible] = useState(true);

	useEffect(() => {
		getBorrowingData();
		getLoginInfo();
		// eslint-disable-next-line
	}, [childStates.open]);

	return (
		<div style={{ opacity: 90 }}>
			<Navbar user={"adm"} invisible={invisible} setInvisible={setInvisible} />

			<div className='container-schedule'>
				<StickyHeadTableADM />
			</div>
			<Footer />
		</div>
	);
};
