import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "./globalState/GlobalState";
import Alerts from "./Alerts";

export const SearchData = () => {
	const { getSearchData, searchData, clearSearchData } = useContext(
		GlobalContext
	);
	const [searchInput, setSearchInput] = useState("");
	const [open, setOpen] = useState(false);
	const [alertColor, setAlertColor] = useState("");
	const [alertText, setAlertText] = useState("");

	const showAlert = () => {
		setAlertColor("error");
		setAlertText(`Tidak Ditemukan!`);
		setOpen(true);
		setTimeout(() => {
			setOpen(false);
		}, 2000);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
	};

	const onChange = async (e) => {
		setSearchInput(e);
		if (searchInput) {
			await getSearchData(searchInput);
			console.log(searchData);
		} else if (!searchInput) {
			clearSearchData();
		}
	};

	console.log(searchInput);

	useEffect(() => {
		console.log(open);
	}, [open]);

	const inputSearchStyle = {
		backgroundColor: "#ece9e9",
		height: "30px",
		minWidth: "60vh",
		borderRadius: "6px",
		border: "none",
		marginLeft: "170px",
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					value={searchInput}
					onChange={(e) => onChange(e.target.value.toUpperCase())}
					style={inputSearchStyle}
					placeholder='Cari Nama / Ruangan ...'
				/>
			</form>
			<Alerts isOpen={open} alertColor={alertColor} alertText={alertText} />
		</div>
	);
};
