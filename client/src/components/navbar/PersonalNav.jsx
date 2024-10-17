import React from "react";
import { NavLink } from "react-router-dom";

function PersonalNav() {
  return (
    <div className="buttons-nav">
      <NavLink
        to={"/PersonalProductsExpenses"}
      >
        <button name="PersonalProductsExpenses" style={{ color: "white" }}>
          הוצאות חומרים
        </button>
      </NavLink>
      <NavLink
        to={"/PersonalRkrExpenses"}
      >
        <button name="PersonalRkrExpenses" style={{ color: "white" }}>
          ריסוס-קיסוח-ריסוק
        </button>
      </NavLink>
      <NavLink
        to={"/PersonalSales"}
      >
        <button name="PersonalSales" style={{ color: "white" }}>
          הכנסות פרטי
        </button>
      </NavLink>
      <NavLink
        to={"/PersonalWorkers"}
      >
        <button name="PersonalWorkers" style={{ color: "white" }}>
          עובדים
        </button>
      </NavLink>
      <NavLink
        to={"/personalInvestments"}
      >
        <button name="PersonalInvestments" style={{ color: "white" }}>
          השקעות
        </button>
      </NavLink>
    </div>
  );
}

export default PersonalNav;
