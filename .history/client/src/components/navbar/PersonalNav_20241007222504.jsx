import React from "react";
import { NavLink } from "react-router-dom";

function PersonalNav() {
  return (
    <div className="buttons-nav">
      <NavLink
        to={"/PersonalProductsExpenses"}
        style={{ backgroundColor: "rgb(218, 168, 7)", fontSize: "1.2rem" }}
      >
        <button name="PersonalProductsExpenses" style={{ color: "white" }}>
          הוצאות חומרים
        </button>
      </NavLink>
      <NavLink
        to={"/PersonalRkrExpenses"}
        style={{ backgroundColor: "rgb(28, 155, 49)", fontSize: "1.2rem" }}
      >
        <button name="PersonalRkrExpenses" style={{ color: "white" }}>
          ריסוס-קיסוח-ריסוק
        </button>
      </NavLink>
      <NavLink
        to={"/PersonalSales"}
        style={{ backgroundColor: "rgb(201, 113, 87)", fontSize: "1.2rem" }}
      >
        <button name="PersonalSales" style={{ color: "white" }}>
          הכנסות פרטי
        </button>
      </NavLink>
      <NavLink
        to={"/PersonalWorkers"}
        // style={{ backgroundColor: "rgb(102, 215, 243)", fontSize: "1.2rem" }}
      >
        <button name="PersonalWorkers" style={{ color: "white" }}>
          עובדים
        </button>
      </NavLink>
    </div>
  );
}

export default PersonalNav;
