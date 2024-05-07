import React from "react";
import logo from "./logo.svg";
import "./App.css";
// import Authentication from "./component/Authentication";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./component/SignIn";
import SignUp from "./component/SignUp";
import Dashboard from "./component/DashBoard";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path ='/dashboard' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
