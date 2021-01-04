import React, { useContext, useEffect, useState } from "react";
import { StickyHeadTableADM } from "../../components/StickyHeadTableADM";
import { FormDialogDetails } from "../FormDialogDetails";
import { GlobalContext } from "../globalState/GlobalState";
import { Navbar } from "../Navbar";
import { cardStyle } from "../TimeLineCardNew";

export const SeeScheduleAdmin = () => {
	const {
		childStates,
		borrowingList,
		getBorrowingData,
		getLoginInfo,
	} = useContext(GlobalContext);
	const [invisible, setInvisible] = useState(true);

	// Decide status for FormDialogDetails:
	const styles = cardStyle(borrowingList);

	useEffect(() => {
		getBorrowingData();
		getLoginInfo();
	}, [childStates.open]);

	return (
		<div style={{ opacity: 90 }}>
			<Navbar user={"adm"} invisible={invisible} setInvisible={setInvisible} />

			<div className='container-schedule'>
				{/* {childStates.open && (
					<FormDialogDetails
						borrowingList={childStates.selectedRow}
						styles={styles}
						open={childStates.open}
					/>
				)} */}
				<StickyHeadTableADM />
			</div>
		</div>
	);
};
