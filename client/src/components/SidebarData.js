import React from "react";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";

export const SidebarData = [
	{
		title: "Beranda",
		path: "/mhs",
		icon: <AiIcons.AiFillHome />,
		iconClosed: <RiIcons.RiArrowDownSFill />,
		iconOpened: <RiIcons.RiArrowUpSFill />,
	},
	{
		title: "Peminjaman Tempat",
		path: "#",
		icon: <IoIcons.IoIosPaper />,
		iconClosed: <RiIcons.RiArrowDownSFill />,
		iconOpened: <RiIcons.RiArrowUpSFill />,

		subNav: [
			{
				title: "Jadwal Peminjaman",
				path: "/mhs",
				icon: <AiIcons.AiOutlineSchedule />,
				cName: "sub-nav",
			},
			{
				title: "Ajukan Peminjaman",
				path: "/mhs/add-schedule",
				icon: <SiGoogleclassroom />,
				cName: "sub-nav",
			},
		],
	},
	,
	{
		title: "Pengajuan Surat",
		path: "#",
		icon: <IoIcons.IoIosPaper />,
		iconClosed: <RiIcons.RiArrowDownSFill />,
		iconOpened: <RiIcons.RiArrowUpSFill />,

		subNav: [
			{
				title: "Aktif Kuliah",
				path: "#",
				icon: <IoIcons.IoIosPaper />,
				cName: "sub-nav",
			},
			{
				title: "Ajukan BPJS",
				path: "#",
				icon: <IoIcons.IoIosPaper />,
				cName: "sub-nav",
			},
		],
	},
	{
		title: "Log Out",
		path: "/",
		icon: <RiIcons.RiLogoutBoxRLine />,
	},
];
