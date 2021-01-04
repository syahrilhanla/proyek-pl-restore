import { Avatar, Badge } from "@material-ui/core";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import NotificationsIcon from "@material-ui/icons/Notifications";
import "./Navbar.css";
import { Sidebar } from "./Sidebar";
import { SidebarDataADM } from "./SidebarDataADM";
import { SidebarData } from "./SidebarData";
import { Dropdown } from "./Dropdown";
import { GlobalContext } from "./globalState/GlobalState";
import logo from "../assets/logo.png";
import { socket } from "./socket";

export const Navbar = ({ user, invisible, setInvisible }) => {
	const [click, setClick] = useState(false);
	const [dropdown, setDropdown] = useState(false);

	const { deleteLoginData } = useContext(GlobalContext);

	// Get READ notification from local storage, if there's none then take/make an empty array
	const hasBeenRead = JSON.parse(localStorage.getItem("hasBeenRead") || "[]");
	// Get UNREAD notification from local storage, if there's none then take/make an empty array
	const notRead = JSON.parse(localStorage.getItem("notRead") || "[]");

	useEffect(() => {
		socket.on("notification", (notification) => {
			notRead.push(notification);
			localStorage.setItem("notRead", JSON.stringify(notRead));
		});
	});

	// Checks if its mhs or adm to choose sidebar
	const chooseSidebar = (user) => {
		if (user === "adm") {
			return SidebarDataADM;
		} else {
			return SidebarData;
		}
	};

	const handleClick = () => {
		setClick(!click);
		console.log(click);
	};
	const closeMobileMenu = () => {
		setClick(false);
	};

	const showNotification = () => {
		setInvisible(true);
		notRead.map((element) => hasBeenRead.push(element));
		setDropdown(!dropdown);
		// if more than 4, than only display 2 from the oldest notification
		if (hasBeenRead.length > 4) {
			if (dropdown === true) {
				if (notRead.length > 0) {
					localStorage.setItem(
						"hasBeenRead",
						JSON.stringify(hasBeenRead.slice(1))
					);
				}
				localStorage.removeItem("notRead");
			}
		} else {
			if (dropdown === true) {
				if (notRead.length > 0) {
					localStorage.setItem("hasBeenRead", JSON.stringify(hasBeenRead));
				}
				localStorage.removeItem("notRead");
			}
		}
	};

	const logOut = () => {
		closeMobileMenu();
		deleteLoginData();
	};

	const localLoginInfo = JSON.parse(localStorage.getItem("loginInfo"));

	const displayAvatar = () => {
		if (localLoginInfo !== null) {
			return localLoginInfo.photo;
		} else return null;
	};

	return (
		<>
			<nav className='navbar'>
				<Sidebar sideBarData={chooseSidebar(user)} />

				<div className='logo-menu'>
					<Link to={`/${user}`} className='navbar-logo.png'>
						<img
							src={logo}
							alt='logo'
							style={{
								width: "200px",
								height: "60px",
								marginLeft: "30px",
								marginTop: "5px",
							}}
						/>
					</Link>
				</div>

				<div className='menu-icon' onClick={handleClick}>
					<i className={click ? "fas fa-times" : "fas fa-bars"} />
				</div>

				<ul className={click ? "nav-menu active" : "nav-menu"}>
					{user === "mhs" ? null : (
						<li className='nav-item' onClick={() => showNotification()}>
							<div className='nav-links not' onClick={closeMobileMenu}>
								<Badge
									badgeContent={notRead.length}
									invisible={notRead.length < 1 ? true : false}
									color='secondary'
								>
									<NotificationsIcon />
								</Badge>
							</div>
							{dropdown && (
								<Dropdown notRead={notRead} hasBeenRead={hasBeenRead} />
							)}
						</li>
					)}

					<li className='nav-item'>
						<Avatar alt='user' src={displayAvatar()} />
					</li>

					<li className='nav-item'>
						<Link to='/' className='nav-links' onClick={() => logOut()}>
							<i className='fas fa-sign-out-alt'></i>
						</Link>
					</li>
				</ul>
			</nav>
		</>
	);
};
