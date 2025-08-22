// import React, { useState, useEffect } from "react";
// import { getSumOfValues } from "../../../utils/getValuesSum";

// function InputForQuantity({
//   collReq,
//   quantityValue,
//   option,
//   tractorPrice,
//   setItemsValues,
//   itemsValues, // تمرير الحالة الأصلية هنا لضمان دقة القيم
// }) {
//   const label = option.label;
  
//   // الاحتفاظ بالقيمة محليًا ولكن يجب تحديثها عند تغيّر `itemsValues`
//   const [localQuantity, setLocalQuantity] = useState(quantityValue || "");

//   // تحديث القيمة المحلية عند تغير `itemsValues`
//   useEffect(() => {
//     setLocalQuantity(itemsValues.quantitiesOfProduct[label] || "");
//   }, [itemsValues, label]);

//   const handleQuantityChange = (e) => {
//     const newQuantity = +e.target.value || "";
//     setLocalQuantity(newQuantity); // تحديث القيمة محليًا فقط

//     setItemsValues((prev) => {
//       // تحديث القيم المستهدفة فقط دون التأثير على بقية المنتجات
//       const updatedQuantities = {
//         ...prev.quantitiesOfProduct,
//         [label]: newQuantity,
//       };

//       let pricePerUnit = option.value;
//       if (typeof option?.value === "string" && option.value.includes("-")) {
//         pricePerUnit = +option.value.split("-").pop();
//       } else {
//         pricePerUnit = +option.value;
//       }

//       const updatedProductsPrice = {
//         ...prev.pricesOfProducts,
//         [label]: newQuantity * pricePerUnit,
//       };

//       const sumOfPrices = getSumOfValues(updatedProductsPrice);

//       return {
//         ...prev,
//         quantitiesOfProduct: updatedQuantities,
//         pricesOfProducts: updatedProductsPrice,
//         number: sumOfPrices,
//         totalAmount:
//           collReq === "/sales"
//             ? sumOfPrices + tractorPrice * (prev.quantity || 0)
//             : sumOfPrices + (prev.workPrice || 0),
//       };
//     });
//   };

//   return (
//     <div
//       key={option.value}
//       style={{
//         margin: "2% auto",
//         borderBottom: "1px solid gray",
//         padding: "2%",
//       }}
//     >
//       <input
//         type="number"
//         placeholder="כמות"
//         className="quantityBoxOfProduct"
//         value={localQuantity} // استخدام القيمة المحلية
//         onChange={handleQuantityChange}
//       />
//       <span style={{ width: "20%" }} htmlFor="">
//         {" : "}
//       </span>
//       <label style={{ width: "50%", textAlign: "right" }} htmlFor="">
//         {" "}
//         {option.label}
//       </label>
//     </div>
//   );
// }

// export default InputForQuantity;


// import React from "react";

// // دوال مساعدة
// const toNum = (v) => Number(v) || 0;

// const InputForQuantity = ({
//   option,
//   itemsValues,
//   setItemsValues,
//   collReq,
//   tractorPrice,
// }) => {
//   // دالة لحساب المجموع حسب النوع
//   const computeTotal = (s) => {
//     if (collReq === "/personalRkrExpenses") {
//       return s.workKind === "ריסוס"
//         ? toNum(s.workPrice) * toNum(s.quantity) + toNum(s.number)
//         : toNum(s.workPrice) + toNum(s.number);
//     }
//     if (
//       collReq === "/expenses" ||
//       collReq === "/personalProductExpenses" ||
//       collReq === "/personalSales"
//     ) {
//       return toNum(s.number) * toNum(s.quantity);
//     }
//     if (collReq === "/sales") {
//       return toNum(s.number) + toNum(tractorPrice) * toNum(s.quantity);
//     }
//     return toNum(s.totalAmount);
//   };

//   const handleQuantityChange = (e) => {
//     const newQuantity = e.target.value;
//     setItemsValues((prev) => {
//       const updated = {
//         ...prev,
//         quantitiesOfProduct: {
//           ...prev.quantitiesOfProduct,
//           [option.label]: newQuantity,
//         },
//         quantity: newQuantity,
//       };
//       return { ...updated, totalAmount: computeTotal(updated) };
//     });
//   };

//   const handleNumberChange = (e) => {
//     const newNumber = e.target.value;
//     setItemsValues((prev) => {
//       const updated = {
//         ...prev,
//         pricesOfProducts: {
//           ...prev.pricesOfProducts,
//           [option.label]: newNumber,
//         },
//         number: newNumber,
//       };
//       return { ...updated, totalAmount: computeTotal(updated) };
//     });
//   };

//   const handleWorkPriceChange = (e) => {
//     const newPrice = e.target.value;
//     setItemsValues((prev) => {
//       const updated = { ...prev, workPrice: newPrice };
//       return { ...updated, totalAmount: computeTotal(updated) };
//     });
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
//       {/* حقل الكمية */}
//       <input
//         type="number"
//         value={itemsValues.quantitiesOfProduct[option.label] || ""}
//         onChange={handleQuantityChange}
//         style={{ width: "50px", textAlign: "center" }}
//       />
//       {/* حقل السعر لكل منتج */}
//       <input
//         type="number"
//         value={itemsValues.pricesOfProducts[option.label] || ""}
//         onChange={handleNumberChange}
//         style={{ width: "50px", textAlign: "center" }}
//       />
//       {/* حقل workPrice إذا كان النوع يتطلب */}
//       {(collReq === "/personalRkrExpenses" || collReq === "/sales") && (
//         <input
//           type="number"
//           value={itemsValues.workPrice || ""}
//           onChange={handleWorkPriceChange}
//           style={{ width: "50px", textAlign: "center" }}
//         />
//       )}
//       <span>{option.label}</span>
//     </div>
//   );
// };

// export default InputForQuantity;
import React, { useState, useEffect } from "react";
import { getSumOfValues } from "../../../utils/getValuesSum";

function InputForQuantity({
  collReq,
  quantityValue,
  option,
  tractorPrice,
  setItemsValues,
  itemsValues,
}) {
  const label = option.label;

  // الاحتفاظ بالقيمة محليًا
  const [localQuantity, setLocalQuantity] = useState(quantityValue || "");

  // تحديث القيمة المحلية عند تغيّر itemsValues
  useEffect(() => {
    setLocalQuantity(itemsValues.quantitiesOfProduct[label] || "");
  }, [itemsValues, label]);

  const handleQuantityChange = (e) => {
  const newQuantity = e.target.value; // خليها string
  setLocalQuantity(newQuantity);

  setItemsValues((prev) => {
    const updatedQuantities = {
      ...prev.quantitiesOfProduct,
      [label]: newQuantity,
    };

    let pricePerUnit = option.value;
    if (typeof option?.value === "string" && option.value.includes("-")) {
      pricePerUnit = parseFloat(option.value.split("-").pop());
    } else {
      pricePerUnit = parseFloat(option.value);
    }

    // هنا فقط نعمل parseFloat للحساب
    const quantityNum = parseFloat(newQuantity) || 0;

    const updatedProductsPrice = {
      ...prev.pricesOfProducts,
      [label]: quantityNum * pricePerUnit,
    };

    const sumOfPrices = getSumOfValues(updatedProductsPrice);

    let total = 0;
    if (collReq === "/sales") {
      total = sumOfPrices + (tractorPrice || 0) * (parseFloat(prev.quantity) || 0);
    } else if (collReq === "/personalRkrExpenses") {
      total =
        prev.workKind === "ריסוס"
          ? (parseFloat(prev.workPrice) || 0) * (parseFloat(prev.quantity) || 0) + sumOfPrices
          : (parseFloat(prev.workPrice) || 0) + sumOfPrices;
    } else {
      total = sumOfPrices + (parseFloat(prev.workPrice) || 0);
    }

    return {
      ...prev,
      quantitiesOfProduct: updatedQuantities,
      pricesOfProducts: updatedProductsPrice,
      number: sumOfPrices.toFixed(1),
      totalAmount: total.toFixed(1),
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
        display: "flex",
        flexDirection : "row-reverse" ,
        justifyContent: "space-between",
        alignItems: "center",
        direction: "rtl", // ترتيب من اليمين لليسار
      }}
    >
      <input
        type="number"
        placeholder="כמות"
        className="quantityBoxOfProduct"
        style={{margin : "0 2%" , textAlign : "center"}}
        value={localQuantity}
        onChange={handleQuantityChange}
      />
      <span style={{ width: "20%" }}>{" : "}</span>
      <label style={{ width: "50%", textAlign: "right" }}>{option.label}</label>
    </div>
  );
}

export default InputForQuantity;
