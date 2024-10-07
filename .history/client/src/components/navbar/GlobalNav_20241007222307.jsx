import React from 'react'
import { NavLink } from 'react-router-dom'

function GlobalNav() {
  return (
    <div className="buttons-nav">
    <NavLink
      to={"/expenses"}
      // style={{ backgroundColor: "rgb(221, 93, 33)", fontSize: "1.2rem" }}
    >
      <button name="expenses" style={{ color: "white" }}>
        הוצאות
      </button>
    </NavLink>
    <NavLink
      to={"/orders"}
      // style={{ backgroundColor: "rgb(146, 144, 4)", fontSize: "1.2rem" }}
    >
      <button name="sales" style={{ color: "white" }}>
        הצעות/הזמנות
      </button>
    </NavLink>
    <NavLink
      to={"/freeBidPage"}
      // style={{ backgroundColor: "rgb(38, 134, 26)", fontSize: "1.2rem" }}
    >
      <button name="sales" style={{ color: "white" }}>
        הצעה חדשה
      </button>
    </NavLink>
    <NavLink
      to={"/sales"}
      // style={{ backgroundColor: "rgb(116, 44, 134)", fontSize: "1.2rem" }}
    >
      <button name="sales" style={{ color: "white" }}>
        עבודה
      </button>
    </NavLink>
    <NavLink
      to={"/clients"}
      style={{ backgroundColor: "rgb(209, 20, 68)", fontSize: "1.2rem" }}
    >
      <button name="sales" style={{ color: "white" }}>
        לקוחות
      </button>
    </NavLink>
  </div>
  )
}

export default GlobalNav