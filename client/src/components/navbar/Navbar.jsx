import React from "react";
import "./navbar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  clearTokens,
  getAccessToken,
  getUserId,
} from "../../utils/tokensStorage";
import { Api } from "../../utils/Api";
export default function Navbar() {
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
              width: "15%",
            }}
            alt={""}
            onClick={() => {
              navigate("/chartHomepage");
            }}
            src="/draw.png"
          />
          <img
            style={{
              cursor: "pointer",
              width: "25%",
            }}
            alt={""}
            onClick={() => {
              navigate("/clients");
            }}
            src="/clients.png"
          />
          <img
            src="./bid.png"
            style={{
              cursor: "pointer",
              width: "15%",
            }}
            onClick={() => {
              navigate("/freeBidPage");
            }}
            alt=""
          />
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
      <div className="buttons-nav">
        <NavLink
          to={"/expenses"}
          style={{ backgroundColor: "rgb(80, 163, 77)", fontSize: "1.2rem" }}
        >
          <button name="expenses" style={{ color: "white" }}>
            הוצאות
          </button>
        </NavLink>
        <NavLink
          to={"/orders"}
          style={{ backgroundColor: "rgb(80, 163, 77)", fontSize: "1.2rem" }}
        >
          <button name="sales" style={{ color: "white" }}>
            הצעות/הזמנות
          </button>
        </NavLink>
        <NavLink
          to={"/sales"}
          style={{ backgroundColor: "rgb(80, 163, 77)", fontSize: "1.2rem" }}
        >
          <button name="sales" style={{ color: "white" }}>
            עבודה
          </button>
        </NavLink>
      </div>
    </nav>
  );
}
