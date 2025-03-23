import React from "react";
import InputForQuantity from "../Add_Item/InputForQuantity";
import { getSumOfValues } from "../../../utils/getValuesSum";

const TooltipSidebar = ({ itemsValues, changeStatus, collReq, tractorPrice, setItemsValues }) => {
  return (
    itemsValues?.product?.length > 0 && !changeStatus.disabled && (
      <div style={styles.tooltipContainer}>
        <div style={styles.tooltipContent}>
          {itemsValues?.product.map((option, index) => (
            <InputForQuantity
              key={index}
              collReq={collReq}
              tractorPrice={+tractorPrice}
              itemsValues={itemsValues}
              setItemsValues={setItemsValues}
              option={option}
              quantityValue={
                Object.values(itemsValues?.quantitiesOfProduct ?? {})[index]
              }
            />
          ))}

          <div style={styles.totalContainer}>
            <input
              name="quantitiesOfProducts"
              id="quantitiesOfProducts"
              style={styles.inputStyle}
              disabled
              placeholder={"כ.חומר"}
              value={getSumOfValues(itemsValues.quantitiesOfProduct)}
            />
            <label>: כמות החומר</label>
          </div>
        </div>
      </div>
    )
  );
};

const styles = {
  tooltipContainer: {
    position: "fixed",
    top: "80%",
    right: "10px", 
    transform: "translateY(-50%)",
    backgroundColor: "gold",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    padding: "10px",
    width: "250px",
    zIndex: 1000,
  },
  tooltipContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
},
totalContainer: {
    display: "flex",
    justifyContent: "center",
    color: "brown",
    marginTop: "10px",
  },
  inputStyle: {
    width: "40%",
    border: "none",
    backgroundColor :"white",
    textAlign: "center",
    fontSize: "14px",
  },
};

export default TooltipSidebar;