import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Dashboard } from "./pages/Dashboard";
import { JobDetailPage } from "./pages/JobDetailPage";
import "./styles/tailwind.css";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard/>}/>
          <Route path="/job/:id" element={<JobDetailPage/>}/>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
