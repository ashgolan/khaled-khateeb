import React from "react";
import { NavLink } from "react-router-dom";

function PersonalNav() {
  return (
    <div className="buttons-nav">
      <NavLink
        to={"/expenses"}
        style={{ backgroundColor: "rgb(218, 168, 7)", fontSize: "1.2rem" }}
      >
        <button name="expenses" style={{ color: "white" }}>
          הוצאות חומרים
        </button>
      </NavLink>
      <NavLink
        to={"/orders"}
        style={{ backgroundColor: "rgb(28, 155, 49)", fontSize: "1.2rem" }}
      >
        <button name="sales" style={{ color: "white" }}>
          ריסוס-קיסוח-ריסוק
        </button>
      </NavLink>
      <NavLink
        to={"/freeBidPage"}
        style={{ backgroundColor: "rgb(201, 113, 87)", fontSize: "1.2rem" }}
      >
        <button name="sales" style={{ color: "white" }}>
          הכנסות פרטי
        </button>
      </NavLink>
      <NavLink
        to={"/sales"}
        style={{ backgroundColor: "rgb(102, 215, 243)", fontSize: "1.2rem" }}
      >
        <button name="sales" style={{ color: "white" }}>
          עובדים
        </button>
      </NavLink>
    </div>
  );
}

export default PersonalNav;
