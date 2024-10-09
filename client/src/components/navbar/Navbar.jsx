import React, { useState } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";
import {
  clearTokens,
  getAccessToken,
  getUserId,
} from "../../utils/tokensStorage";
import { Api } from "../../utils/Api";
import GlobalNav from "./GlobalNav";
import PersonalNav from "./PersonalNav";
import TaxValuesModal from "./TaxValuesModal";
export default function Navbar({ isPersonal, setIsPersonal }) {
  const [taxValues, setTaxValues] = useState({});

  const openModal = async () => {
    navigate('/')
    setIsOpen(true);
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    try {
      const { data: taxValuesData } = await Api.get("/taxValues", {
        headers,
      });

      setTaxValues(taxValuesData[0]);
    } catch (e) {
      console.log(e);
    }
  };
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const navigate = useNavigate();
  const logout = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: getAccessToken() };
      await Api.post(
        "/users/logout",
        {
          _id: getUserId(),
          key: process.env.REACT_APP_ADMIN,
        },
        { headers }
      );
      setIsPersonal(0);
      localStorage.clear();
      clearTokens();
      navigate("/");
    } catch (e) {
      clearTokens();
      navigate("/");
    }
  };

  return (
    <nav style={{ pointerEvents: getAccessToken() ? "auto" : "none" }}>
      <div className="upper-nav">
        <div className="img-bottomNav-left">
          <label htmlFor="">created by : Alaa Shaalan</label>
        </div>

        <div className="img-uppernav-logo">
          <label htmlFor="" className="titleBar">
            ח.א חקלאות
          </label>
          <img
            style={{
              width: "11%",
            }}
            alt={""}
            src="/flowers2.png"
          />
        </div>
        <div className="img-bottomNav">
          <img
            style={{
              cursor: "pointer",
              width: "25%",
            }}
            alt={""}
            onClick={() => {
              setIsPersonal(0);
              localStorage.setItem("isPersonalNav", JSON.stringify(0));
              navigate("/homepage");
            }}
            src="/homepage.png"
          />
          <img
            style={{
              cursor: "pointer",
              width: "15%",
            }}
            alt={""}
            onClick={() => {
              navigate("/chartHomepage");
            }}
            src="/draw.png"
          />

          {/* <img
            src="./bid.png"
            style={{
              cursor: "pointer",
              width: "15%",
            }}
            onClick={() => {
              navigate("/freeBidPage");
            }}
            alt=""
          /> */}
          <img
            style={{
              cursor: "pointer",
              width: "15%",
            }}
            alt={""}
            onClick={() => {
              navigate("/calender");
            }}
            src="/calender.png"
          />
          <img
            style={{
              cursor: "pointer",
              width: "15%",
            }}
            alt={""}
            onClick={() => openModal()}
            src="/taxValues.png"
          />
        
          <img
            className="logout-img"
            style={{
              display: getAccessToken() ? "block" : "none",
              cursor: "pointer",
              width: "15%",
            }}
            alt={""}
            src="/switch2.png"
            onClick={logout}
          />
        </div>
      </div>
      {(isPersonal === 2 ||
        JSON.parse(localStorage.getItem("isPersonalNav") == 2)) && (
        <GlobalNav></GlobalNav>
      )}
      {(isPersonal === 1 ||
        JSON.parse(localStorage.getItem("isPersonalNav") == 1)) && (
        <PersonalNav></PersonalNav>
      )}
      <TaxValuesModal
          modalIsOpen={modalIsOpen}
          setIsOpen={setIsOpen}
          taxValues={taxValues}
          setTaxValues={setTaxValues}
        ></TaxValuesModal>
    </nav>
  );
}
