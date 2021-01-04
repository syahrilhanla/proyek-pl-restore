import React from "react";
import "./Breadcrumb.css";
import { Button } from "./Button";
import { Sidebar } from "./Sidebar";
import { SidebarData } from "./SidebarData";

export const Breadcrumb = () => {
	const checkLoginInfo = () => {
		const localLoginInfo = JSON.parse(localStorage.getItem("loginInfo"));

		if (localLoginInfo !== null) {
			return (
				<span>
					<h3>Selamat Datang, {localLoginInfo.name}!</h3>
				</span>
			);
		} else {
			return null;
		}
	};
	return (
		<div className='breadcrumb'>
			{checkLoginInfo()}
			<Button text='Ajukan Peminjaman' goTo='/mhs/add-schedule' />
		</div>
	);
};
