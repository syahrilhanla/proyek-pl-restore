import React, { useContext, useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import { Link, useHistory } from "react-router-dom";
import { GlobalContext } from "../globalState/GlobalState";

const GoogleOAuth = () => {
	const clientId =
		"943373440851-0d888p5eldjd8n17ev5o5cnkbeo1s502.apps.googleusercontent.com";

	const { takeLoginInfo } = useContext(GlobalContext);
	const history = useHistory();

	// Checks if the email is ULM email
	const emailFormatter = (email) => {
		const nim = email.slice(0, 13);
		const emailFormatTrue = `${nim}@mhs.ulm.ac.id`;

		return emailFormatTrue === email ? true : false;
	};

	const checkLoginInfo = () => {
		// login info object from local storage
		const localStorageLoginInfo = JSON.parse(localStorage.getItem("loginInfo"));
		if (localStorageLoginInfo !== null) {
			if (localStorageLoginInfo.email === "kaipajuang@gmail.com") {
				history.push("/wd-2");
			} else if (emailFormatter(localStorageLoginInfo.email) === true) {
				history.push("/mhs");
			} else {
				history.push("/adm");
			}
		} else {
			return console.log("null", null);
		}
	};

	const responseGoogle = (response) => {
		const name = response.profileObj.givenName;
		const email = response.profileObj.email;
		const nim = email.slice(0, 13);
		const photo = response.profileObj.imageUrl;
		console.log(response);

		const insertLoginData = (name, email, nim, photo) => {
			return {
				email: email,
				name: name,
				nim: nim,
				photo: photo,
			};
		};

		// If ULM emails then returns link to MHS page, if not then returns to ADM
		if (emailFormatter(response.profileObj.email) === true) {
			const newLoginData = insertLoginData(name, email, nim, photo);
			takeLoginInfo(newLoginData);
			console.log(newLoginData);
			history.push("/mhs");
		} else if (email === "kaipajuang@gmail.com") {
			const newLoginData = insertLoginData(name, email, nim, photo);
			takeLoginInfo(newLoginData);
			console.log(newLoginData);
			history.push("/wd-2");
		} else {
			const newLoginData = insertLoginData(name, email, nim, photo);
			takeLoginInfo(newLoginData);
			console.log("syahrilhanla");
			history.push("/adm");
		}
	};

	const customStyle = {
		padding: "8px 20px",
		borderRadius: "4px",
		outline: "none",
		border: "none",
		fontSize: "18px",
		color: "white",
		cursor: "pointer",
		backgroundColor: "#1888ff",
		marginBottom: "2rem",
		textDecoration: "none",
	};

	// If not logged out then redirect to user dashboard
	checkLoginInfo();

	return (
		<>
			<GoogleLogin
				clientId={clientId}
				buttonText='Masuk'
				onSuccess={responseGoogle}
				onFailure={responseGoogle}
				cookiePolicy={"single_host_origin"}
				render={(renderProps) => (
					<Link onClick={renderProps.onClick} style={customStyle} to={""}>
						Masuk
					</Link>
				)}
			/>
		</>
	);
};

export default GoogleOAuth;
