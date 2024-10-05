import "./App.css";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import { FetchingStatus } from "./utils/context";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./components/login/Login";
import HomePage from "./components/homepage/HomePage";
import IdleTimer from "./utils/IdleTimer";
import { clearTokens } from "./utils/tokensStorage";
import Expenses from "./components/expenses/Expenses";
import Sales from "./components/sales/Sales";
import ChartHomepage from "./components/charts/ChartHomepage";
import Calender from "./components/calender/Calender";
import Clients from "./components/clients/Clients";
import PersonalWorkers from "./components/personal/PersonalWorkers";
import FreeBidPage from "./components/Bid_components/FreeBidPage";
import OrderPage from "./components/Order_Components/OrderPage";
import PersonalProductsExpenses from "./components/personal/PersonalProductsExpenses";
import PersonalSales from "./components/personal/PersonalSales";
import PersonalRkrExpenses from "./components/personal/PersonalRkrExpenses";
function App() {
  const navigate = useNavigate();
  
  const [isPersonal, setIsPersonal] = useState((JSON.parse(localStorage.getItem("isPersonalNavBar")))||0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useState({
    loading: false,
    error: false,
    status: false,
    message: null,
  });
  const handleIdle = () => {
    if (!loggedIn) return;
    clearTokens();
    setLoggedIn(false);
    navigate("/homepage");
  };

  return (
    <div>
      <IdleTimer timeout={20 * 60 * 1000} onIdle={handleIdle} />
      <Navbar isPersonal={isPersonal} setIsPersonal={setIsPersonal}></Navbar>
      {fetchingStatus.message && (
        <h5 className="message">{fetchingStatus.message}</h5>
      )}
      {fetchingStatus.loading && (
        <div className="loading">
          <span className="loader"></span>
        </div>
      )}
      <FetchingStatus.Provider value={[fetchingStatus, setFetchingStatus]}>
        <Routes>
          <Route
            exact
            path="/"
            element={<Login setLoggedIn={setLoggedIn}></Login>}
          ></Route>

          <Route path="/expenses" element={<Expenses></Expenses>}></Route>

          <Route path="/sales" element={<Sales></Sales>}></Route>
          <Route path="/clients" element={<Clients></Clients>}></Route>
          <Route
            path="/freeBidPage"
            element={<FreeBidPage></FreeBidPage>}
          ></Route>
          <Route path="/orders" element={<OrderPage></OrderPage>}></Route>

          <Route
            path="/PersonalRkrExpenses"
            element={<PersonalRkrExpenses></PersonalRkrExpenses>}
          ></Route>
          <Route
            path="/personalWorkers"
            element={<PersonalWorkers></PersonalWorkers>}
          ></Route>

          <Route
            path="/personalSales"
            element={<PersonalSales></PersonalSales>}
          ></Route>
          <Route
            path="/personalProductsExpenses"
            element={<PersonalProductsExpenses></PersonalProductsExpenses>}
          ></Route>
          <Route
            path="/chartHomepage"
            element={<ChartHomepage></ChartHomepage>}
          ></Route>
          <Route
            path="/homePage"
            element={<HomePage setIsPersonal={setIsPersonal}></HomePage>}
          ></Route>
          <Route path="/calender" element={<Calender></Calender>}></Route>
        </Routes>
      </FetchingStatus.Provider>
    </div>
  );
}

export default App;
