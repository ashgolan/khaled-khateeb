import React, { useRef, useState, useEffect } from "react";
import InputForQuantity from "../Add_Item/InputForQuantity";
import { getSumOfValues } from "../../../utils/getValuesSum";

const TooltipSidebar = ({
  itemsValues,
  changeStatus = { disabled: false },
  collReq,
  tractorPrice,
  setItemsValues,
}) => {
  const sidebarRef = useRef(null);
  const [position, setPosition] = useState({ x: 10, y: window.innerHeight / 2 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const isDragging = useRef(false);
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    const rect = sidebarRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    isDragging.current = true;
  };

  const handleDeleteProduct = (productLabel) => {
    setItemsValues((prev) => {
      const updatedProducts = prev.product.filter((option) => option.label !== productLabel);
      const updatedQuantities = Object.fromEntries(
        Object.entries(prev.quantitiesOfProduct).filter(
          ([key]) => key !== productLabel
        )
      );
      const updatedPrices = Object.fromEntries(
        Object.entries(prev.pricesOfProducts).filter(
          ([key]) => key !== productLabel
        )
      );
      const sumOfPrices = getSumOfValues(updatedPrices);

      return {
        ...prev,
        quantitiesOfProduct: updatedQuantities,
        pricesOfProducts: updatedPrices,
        number: sumOfPrices,
        product: updatedProducts,
        totalAmount:
          collReq === "/sales"
            ? +sumOfPrices + +(+tractorPrice * prev.quantity)
            : +sumOfPrices + +prev.workPrice,
      };
    });
  };

  return (
    itemsValues?.product?.length > 0 &&
    !changeStatus.disabled && (
      <div
        ref={sidebarRef}
        style={{
          ...styles.tooltipContainer,
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(0, 0)", // لا حاجة لـ translateY مع السحب
        }}
      >
        <div
          style={styles.dragHandle}
          onMouseDown={handleMouseDown}
        >
          תפוס לגרירה 🖐
        </div>

        <div style={styles.tooltipContent}>
          {itemsValues?.product.map((option, index) => (
            <div key={index} style={styles.productContainer}>
              <InputForQuantity
                collReq={collReq}
                tractorPrice={+tractorPrice}
                itemsValues={itemsValues}
                setItemsValues={setItemsValues}
                option={option}
                quantityValue={
                  Object.values(itemsValues?.quantitiesOfProduct ?? {})[index]
                }
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteProduct(option.label);
                }}
                className="delete-button"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
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
    backgroundColor: "gold",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    padding: "10px",
    width: "350px",
    zIndex: 1000,
    cursor: "move", // إشارة السحب
  },
  dragHandle: {
    backgroundColor: "white",
    padding: "5px 10px",
    textAlign : "center" ,
    borderRadius: "5px",
    color: "brown",
    marginBottom: "10px",
    cursor: "grab",
    userSelect: "none",
    fontWeight: "bold",
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
    backgroundColor: "white",
    textAlign: "center",
    fontSize: "14px",
  },
  productContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
};

export default TooltipSidebar;
