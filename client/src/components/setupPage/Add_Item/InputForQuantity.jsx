import React, { useState, useEffect } from "react";
import { getSumOfValues } from "../../../utils/getValuesSum";

function InputForQuantity({
  quantityValue,
  option,
  tractorPrice,
  setItemsValues,
}) {
  const label = option.label;
  const [letersOfProduct, setLetersOfProduct] = useState(quantityValue || "");
  useEffect(() => {
    setLetersOfProduct(quantityValue || "");
  }, [quantityValue]);

  const handleQuantityChange = (e) => {
    const newQuantity = +e.target.value || "";

    setItemsValues((prev) => {
      const updatedQuantities = {
        ...prev.quantitiesOfProduct,
        [label]: +newQuantity,
      };

      const updatedProductsPrice = {
        ...prev.pricesOfProducts,
        [label]: +newQuantity * +option.value.split("-").pop(),
      };

      const sumOfPrices = getSumOfValues(updatedProductsPrice);

      return {
        ...prev,
        quantitiesOfProduct: updatedQuantities,
        pricesOfProducts: updatedProductsPrice,
        number: sumOfPrices,
        totalAmount: +sumOfPrices + +(tractorPrice * prev.quantity),
      };
    });

    setLetersOfProduct(newQuantity);
  };

  return (
    <div
      key={option.value}
      style={{ margin: "1%", borderBottom: "1px solid gray" }}
    >
      <input
        type="number"
        placeholder="כמות"
        className="quantityBoxOfProduct"
        value={letersOfProduct}
        onChange={handleQuantityChange}
      />
      <span style={{ width: "20%" }} htmlFor="">
        {" : "}
      </span>
      <label style={{ width: "50%", textAlign: "right" }} htmlFor="">
        {" "}
        {option.label}
      </label>
    </div>
  );
}

export default InputForQuantity;
