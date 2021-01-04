import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";

const useStyles = makeStyles((theme) => ({
	new: {
		background: "#e94646",
	},
	onProgress: {
		background: "#0eb2e7",
	},
	verified: {
		background: "#7fe13b",
	},
}));

export const Chips = ({ label, status }) => {
	const classes = useStyles();

	const colorDefiner = (status) => {
		if (status === 1) {
			return classes.new;
		} else if (status === 2) {
			return classes.onProgress;
		} else if (status === 3) {
			return classes.verified;
		}
	};

	return (
		<>
			<Chip label={label} size='small' className={colorDefiner(status)} />
		</>
	);
};
