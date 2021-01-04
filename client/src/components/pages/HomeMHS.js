import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../globalState/GlobalState";
import { Breadcrumb } from "../Breadcrumb";
import { StickyHeadTable } from "../StickyHeadTable";
import { Navbar } from "../Navbar";
import { checkLogin } from "./HomeAdmin";
import { Redirect, useHistory } from "react-router-dom";
import { Footer } from "../Footer";

const HomeMHS = () => {
	const [invisible, setInvisible] = useState(true);
	const { getBorrowingData, getLoginInfo, loginInfo, updateState } = useContext(
		GlobalContext
	);

	const history = useHistory();

	// useEffect when updateState updated
	useEffect(() => {
		setInvisible(false);
	}, [updateState]);

	// useEffect after page loaded for the first time
	useEffect(() => {
		getBorrowingData();
		getLoginInfo();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const HomeMHS = () => {
		return (
			<>
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

	return (
		<>
			<Navbar user={"mhs"} invisible={invisible} setInvisible={setInvisible} />
			{checkLogin(loginInfo, history) ? <HomeMHS /> : <Redirect to='/' />}
		</>
	);
};
export default HomeMHS;
