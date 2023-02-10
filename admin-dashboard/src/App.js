import React from "react";
import { Routes, Route, useSearchParams, Navigate } from "react-router-dom";
import Auth from "./app/Auth/Auth";
import Admin from "./app/Admin/Admin";
import './App.css';

function App() {
	const [ URLSearchParams ] = useSearchParams();
	return (
		<div className="main">
			<Routes>
				<Route path="/" element={<Admin />}/>
				<Route path="/auth/*" element={<Auth token={localStorage.getItem("token")} />} />
				<Route path="/redirect" element={<Navigate to={URLSearchParams.get("url") || "/"}/>} />
			</Routes>
		</div>
	);
}

export default App;
