import React, { useState, useEffect } from "react";
import { getSumOfValues } from "../../../utils/getValuesSum";

function InputForQuantity({
  collReq,
  quantityValue,
  option,
  tractorPrice,
  setItemsValues,
  itemsValues, // تمرير الحالة الأصلية هنا لضمان دقة القيم
}) {
  const label = option.label;
  
  // الاحتفاظ بالقيمة محليًا ولكن يجب تحديثها عند تغيّر `itemsValues`
  const [localQuantity, setLocalQuantity] = useState(quantityValue || "");

  // تحديث القيمة المحلية عند تغير `itemsValues`
  useEffect(() => {
    setLocalQuantity(itemsValues.quantitiesOfProduct[label] || "");
  }, [itemsValues, label]);

  const handleQuantityChange = (e) => {
    const newQuantity = +e.target.value || "";
    setLocalQuantity(newQuantity); // تحديث القيمة محليًا فقط

    setItemsValues((prev) => {
      // تحديث القيم المستهدفة فقط دون التأثير على بقية المنتجات
      const updatedQuantities = {
        ...prev.quantitiesOfProduct,
        [label]: newQuantity,
      };

      let pricePerUnit = option.value;
      if (typeof option?.value === "string" && option.value.includes("-")) {
        pricePerUnit = +option.value.split("-").pop();
      } else {
        pricePerUnit = +option.value;
      }

      const updatedProductsPrice = {
        ...prev.pricesOfProducts,
        [label]: newQuantity * pricePerUnit,
      };

      const sumOfPrices = getSumOfValues(updatedProductsPrice);

      return {
        ...prev,
        quantitiesOfProduct: updatedQuantities,
        pricesOfProducts: updatedProductsPrice,
        number: sumOfPrices,
        totalAmount:
          collReq === "/sales"
            ? sumOfPrices + tractorPrice * (prev.quantity || 0)
            : sumOfPrices + (prev.workPrice || 0),
      };
    });
  };

  return (
    <div
      key={option.value}
      style={{
        margin: "2% auto",
        borderBottom: "1px solid gray",
        padding: "2%",
      }}
    >
      <input
        type="number"
        placeholder="כמות"
        className="quantityBoxOfProduct"
        value={localQuantity} // استخدام القيمة المحلية
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
