import React, { useState } from "react";

import "./Dropdown.css";

export const Dropdown = ({ notRead, hasBeenRead }) => {
	const [click, setClick] = useState(false);

	const handleClick = () => {
		setClick(!click);
	};

	const OldNotification = () => {
		if (hasBeenRead.length > 0) {
			return (
				<>
					{hasBeenRead.reverse().map((item, index) => {
						return (
							<div className='notification'>
								<li key={index}>
									<div>{item}</div>
								</li>
							</div>
						);
					})}
				</>
			);
		} else
			return (
				<div className='notification'>
					<li>
						<div>Tidak Ada Berita</div>
					</li>
				</div>
			);
	};

	const NewNotification = () => {
		if (notRead.reverse().length > 0) {
			return (
				<>
					{notRead.map((item, index) => {
						return (
							<div className='notification'>
								<li key={index}>
									<div>{item}</div>
								</li>
							</div>
						);
					})}
				</>
			);
		} else
			return (
				<div className='notification'>
					<li>
						<div>Tidak Ada Berita Terbaru</div>
					</li>
				</div>
			);
	};

	return (
		<div className='dropdown-menu'>
			<ul
				onClick={handleClick}
				className={click ? "dropdown-menu clicked" : "dropdown-menu"}
			>
				<h2 className='title'>Terbaru:</h2>
				<NewNotification />
				<hr />
				<h2 className='title'>Terdahulu:</h2>
				<OldNotification />
			</ul>
		</div>
	);
};
