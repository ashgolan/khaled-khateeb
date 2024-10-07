import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Api } from "../../utils/Api";
import {
  clearTokens,
  deleteUserId,
  getAccessToken,
  getUserId,
} from "../../utils/tokensStorage";
import "./HomePage.css";
export default function HomePage({ setIsPersonal }) {
  const navigate = useNavigate();
  const logoutAll = async (e) => {
    try {
      await Api.post(`/users/logoutAll/${getUserId()}`, {
        key: process.env.REACT_APP_ADMIN,
      });
      clearTokens();
      local
      deleteUserId();
      navigate("/");
    } catch (e) {
      clearTokens();
      navigate("/");
    }
  };
  return (
    <div className="home-container">
      <div className="title-homepage">
        <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>מערכת לניהול</h1>
        <div className="welcome">
          <p style={{ color: "#f36710" }}>ח.א חקלאות</p>
          <p style={{ color: "#98ca3b" }}>שירות חקלאי</p>
        </div>

        {!getAccessToken() && (
          <Link to="/">
            <button className="home-log-btn">יציאה</button>
          </Link>
        )}
        {!getAccessToken() && (
          <Link>
            <button
              style={{
                backgroundColor: "#586d38",
                color: "whitesmoke",
              }}
              onClick={logoutAll}
              className="home-log-btn"
            >
              יציאה מכל המכשירים
            </button>
          </Link>
        )}
        {getAccessToken() && (
          <label
            style={{
              fontSize: "1rem",
              color: "brown",
              fontWeight: "bold",
            }}
            htmlFor=""
          >
            המערכת פתוחה לשימוש חופשי
          </label>
        )}
      </div>
      <div className="logos-home-page-container">
        {/* <img
          onClick={() => setIsPersonal(1)}
          className="logos-home-page"
          src="/logohome5.png"
          alt=""
        /> */}
        <img
          onClick={() => {
            setIsPersonal(1);
            localStorage.setItem("isPersonalNav", JSON.stringify(1));
          }}
          className="logos-home-page-kind"
          src="/personal1.png"
          alt=""
        />
        <img
     onClick={() => {
            setIsPersonal(2);
            localStorage.setItem("isPersonalNav", JSON.stringify(2));
          }}          className="logos-home-page-kind"
          src="/global1.png"
          alt=""
        />
        {/* <img
          onClick={() => setIsPersonal(2)}
          className="logos-home-page"
          src="/logohome6.png"
          alt=""
        /> */}
      </div>
    </div>
  );
}
