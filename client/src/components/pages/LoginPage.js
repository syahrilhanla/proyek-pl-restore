import React from "react";
import GoogleOAuth from "./GoogleOAuth";
import "./LoginPage.css";

export const LoginPage = () => {
	return (
		<div className='login-page-root'>
			<div className='container'>
				<h1 className='login-page'>Masuk dengan Akun ULM</h1>
				<form>
					<div className='choose-user'>
						<i className='fas fa-user-circle' />

						<GoogleOAuth />
					</div>
				</form>
			</div>
		</div>
	);
};
