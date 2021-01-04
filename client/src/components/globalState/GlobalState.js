import React, { createContext, useReducer, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

const AppReducer = (state, action) => {
	switch (action.type) {
		case "GET_BORROWING_DATA":
			return {
				...state,
				borrowingList: action.payload,
			};
		case "GET_SPECIFIC_BORROWING_DATA":
			return {
				...state,
				specificBorrowingData: action.payload,
			};
		case "GET_CHILD_STATES":
			return {
				...state,
				childStates: action.payload,
			};
		case "GET_PICTURES":
			return {
				...state,
				pictures: action.payload,
			};
		case "ADD_NEW_DATA":
			return {
				...state,
				borrowingList: [action.payload, ...state.borrowingList],
			};
		case "TAKE_LOGIN_INFO":
			return {
				...state,
				loginInfo: [action.payload],
				loggedIn: action.payload.loggedIn,
			};
		case "FETCHING_ERROR":
			return {
				...state,
				error: action.payload,
			};
		case "DELETE_BORROWING_DATA":
			return {
				...state,
				borrowingList: state.borrowingList.filter(
					(data) => data._id !== action.payload
				),
			};
		case "DELETE_LOGIN_DATA":
			return {
				...state,
				loginInfo: [],
				loggedIn: action.payload,
			};
		case "UPDATE_BORROWING_DATA":
			return {
				...state,
				borrowingList: [...state.borrowingList, action.payload],
			};

		default:
			return state;
	}
};

const initialState = {
	borrowingList: [],
	loginInfo: [],
	specificBorrowingData: [],
	childStates: [],
	loggedIn: [],
	pictures: [],
};

export const GlobalContext = createContext(initialState);

// NOTIFICATION STUFF ##############

// Show notification based on data
// Takes a single array element as argument and a string as a type
const showNotification = (updatedData, type) => {
	const body = () => {
		if (updatedData.status === 1 && type === "update") {
			console.log(type);
			return `Permintaan ${updatedData.name} sudah diproses!`;
		} else if (updatedData.status === 2 && type === "update") {
			console.log(type);
			return `Permintaan ${updatedData.name} diterima!`;
		} else if (type === "newData") {
			console.log(type);
			return `${updatedData.name} mengajukan peminjaman!`;
		} else if (type === "delete") {
			console.log(type);
			return `Pengajuan ${updatedData.name} telah dihapus/tolak!`;
		}
	};

	const text = body();
	// eslint-disable-next-line
	const notification = new Notification("Pemberitahuan!", {
		body: text,
	});
};

// Check notification setting
// If notification is not denied then try to show the notification
// Takes a single array element as argument and a string as a type
const checkNotification = (updatedData, type) => {
	if (Notification.permission !== "denied") {
		Notification.requestPermission().then((permission) => {
			if (permission === "granted") showNotification(updatedData, type);
		});
	} else if (Notification.permission === "granted") {
		showNotification(updatedData, type);
	}
};

// Data format to be emitted to notification
const notificationData = (selectedData) => {
	return {
		name: selectedData[0].name,
		room: selectedData[0].room,
		status: selectedData[0].status + 1,
		phoneNum: selectedData[0].phoneNum,
	};
};

// NOTIFICATION STUFF ##############

export const GlobalProvider = ({ children }) => {
	const [state, dispatch] = useReducer(AppReducer, initialState);

	// to check if there's any recent update
	const [anyUpdate, setAnyUpdate] = useState(false);

	const getBorrowingData = async () => {
		try {
			const res = await axios.get("/api/v1/borrowingData");

			dispatch({
				type: "GET_BORROWING_DATA",
				payload: res.data.data,
			});
		} catch (err) {
			dispatch({
				type: "FETCHING_ERROR",
				payload: err.response,
			});
		}
	};

	const getLoginInfo = async () => {
		try {
			// get login info from localStorage, so when the page refreshes it loads the data from there
			const loginInfo = localStorage.getItem("loginInfo");

			if (initialState.loginInfo.length >= 1) {
				delete initialState.loginInfo[1];
			}

			initialState.loginInfo.push(JSON.parse(loginInfo));
		} catch (err) {
			alert("tidak bisa mengambil login info");
		}
	};

	const getChildStates = (states) => {
		try {
			dispatch({
				type: "GET_CHILD_STATES",
				payload: states,
			});
		} catch (err) {
			alert("failed to get child states");
		}
	};

	const getSpecificBorrowingData = async (id) => {
		try {
			const res = await axios.get(`/api/v1/borrowingData/${id}`);

			dispatch({
				type: "GET_SPECIFIC_BORROWING_DATA",
				payload: res.data.data,
			});
		} catch (err) {
			dispatch({
				type: "FETCHING_ERROR",
				payload: err.response,
			});
		}
	};

	const getPictures = async () => {
		try {
			const res = await axios.get("/files");

			dispatch({
				type: "GET_PICTURES",
				payload: res.data,
			});
		} catch (err) {
			dispatch({
				type: "FETCHING_ERROR",
				payload: err.response,
			});
		}
	};

	const addNewBorrowing = async (newData) => {
		try {
			const config = {
				headers: {
					"Content-Type": "application/json",
				},
			};

			const res = await axios.post("/api/v1/borrowingData", newData, config);

			// takes new Data from the form and add to array, because notification data takes the first array element as an argument
			const selectedData = [newData];
			console.log(selectedData);

			socket.emit("newBorrowing", notificationData(selectedData));
			// if triggered then fires back to HomeAdmin page, then triggers to re-render the page
			setAnyUpdate(!anyUpdate);
			console.log(anyUpdate);

			dispatch({
				type: "ADD_NEW_DATA",
				payload: res.data.data,
			});
		} catch (err) {
			dispatch({
				type: "FETCHING_ERROR",
				payload: err.response.data.error,
			});
		}
	};

	const takeLoginInfo = (newLogin) => {
		// Save loginInfo to local storage so it can be retrieved when the page refreshes
		localStorage.setItem("loginInfo", JSON.stringify(newLogin));
		const loggedIn = true;

		dispatch({
			type: "TAKE_LOGIN_INFO",
			payload: { newLogin, loggedIn },
		});
	};

	const deleteBorrowingData = async (id, filename) => {
		try {
			// GETTING DATA TO SENT AS NOTIFICATION BEFORE GOT DELETED
			// Select data and distribute to server as notification body
			const selectedData = state.borrowingList.filter(
				(item) => item._id === id
			);

			await socket.emit("deleteData", notificationData(selectedData));

			await socket.on("notification", (notification) => {
				const updatedData = state.borrowingList.filter(
					(item) => item._id === id
				);
				console.log(updatedData);
				checkNotification(updatedData[0], "delete");
			});

			await axios.delete(`/api/v1/borrowingData/${id}`);
			await axios.delete(`/files/${filename}`);

			// if triggered then fires back to HomeAdmin page, then triggers to re-render the page
			setAnyUpdate(!anyUpdate);
			console.log(anyUpdate);

			dispatch({
				type: "DELETE_BORROWING_DATA",
				payload: id,
			});
		} catch (err) {
			dispatch({
				type: "FETCHING_ERROR",
				payload: err.response.data.error,
			});
		}
	};

	const deleteLoginData = async () => {
		try {
			localStorage.removeItem("loginInfo");

			dispatch({
				type: "DELETE_LOGIN_DATA",
				payload: false,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const updateBorrowingData = async (id, status) => {
		try {
			const res = await axios.put(`/api/v1/borrowingData/${id}`, {
				status: status + 1,
			});

			// if triggered then fires back to HomeAdmin page, then triggers to re-render the page
			setAnyUpdate(!anyUpdate);
			console.log(anyUpdate);

			// Select data and distribute to server as notification body
			const selectedData = state.borrowingList.filter(
				(item) => item._id === id
			);

			socket.emit("newStatus", notificationData(selectedData));

			socket.on("notification", (notification) => {
				const updatedData = state.borrowingList.filter(
					(item) => item._id === id
				);
				console.log(updatedData);
				checkNotification(updatedData[0], "update");
			});

			dispatch({
				type: "UPDATE_BORROWING_DATA",
				payload: res.data.data,
			});
		} catch (err) {
			dispatch({
				type: "FETCHING_ERROR",
				payload: err,
			});
			console.log(err);
		}
	};

	return (
		<GlobalContext.Provider
			value={{
				borrowingList: state.borrowingList,
				loginInfo: state.loginInfo,
				specificBorrowingData: state.specificBorrowingData,
				childStates: state.childStates,
				loggedIn: state.loggedIn,
				pictures: state.pictures,
				anyUpdate,
				addNewBorrowing,
				takeLoginInfo,
				getBorrowingData,
				deleteBorrowingData,
				updateBorrowingData,
				getSpecificBorrowingData,
				deleteLoginData,
				getLoginInfo,
				getChildStates,
				getPictures,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};
