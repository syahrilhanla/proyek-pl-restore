import React from "react";
import { Link } from "react-router-dom";
import "./Button.css";

export const Button = ({ text, goTo, color }) => {
	return (
		<Link to={("/", goTo)}>
			<button style={{ background: color }} className='btn'>
				{text}
			</button>
		</Link>
	);
};
