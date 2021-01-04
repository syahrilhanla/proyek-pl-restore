import React, { useContext } from "react";
import { StickyHeadTable } from "../StickyHeadTable";
import { GlobalContext } from "../globalState/GlobalState";
import { Breadcrumb } from "../Breadcrumb";
import { Navbar } from "../Navbar";

export const SeeScheduleMHS = () => {
	const { loginInfo } = useContext(GlobalContext);

	return (
		<>
			<Navbar user={"mhs"} />
			<div className='container'>
				<Breadcrumb loginInfo={loginInfo} />
			</div>
			<div className='container-schedule'>
				<StickyHeadTable />
			</div>
		</>
	);
};
