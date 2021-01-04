import React, { useContext, useEffect } from "react";
import { Footer } from "../Footer";
import { GlobalContext } from "../globalState/GlobalState";

export const DisplayPicture = () => {
	const { pictures, getPictures } = useContext(GlobalContext);

	// Getting pathname as endpoint to request to the API
	const pathname = window.location.pathname.split("/")[2];
	// console.log('pathname', pathname);

	useEffect(() => {
		getPictures();
	}, []);

	// Matching Pictures in borrowingList with the collection in GridFS Storage
	const selectedPicture = pictures.filter(
		(picture) => picture.filename === pathname
	);
	// console.log(selectedPicture);

	const style = { width: "100%", height: "100%", alignSelf: "center" };

	return (
		<div style={{ margin: "auto", width: "700px" }}>
			{selectedPicture.map((picture) => (
				<img src={`${pathname}`} alt={picture.filename} style={style} />
			))}
			<Footer />
		</div>
	);
};
