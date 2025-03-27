import React from "react";
import InputForQuantity from "../Add_Item/InputForQuantity"; // تأكد من أن هذا المكون موجود في المسار الصحيح
import { getSumOfValues } from "../../../utils/getValuesSum"; // تأكد من وجود هذه الدالة أيضًا

const TooltipSidebar = ({
  itemsValues,
  changeStatus = { disabled: false },
  collReq,
  tractorPrice,
  setItemsValues,
}) => {
  // دالة لحذف المنتج
  const handleDeleteProduct = (productLabel) => {

    setItemsValues((prev) => {
      // إزالة المنتج من itemsValues.product
      const updatedProducts = prev.product.filter((option) => option.label !== productLabel);
      
      // إزالة الكميات والأسعار المرتبطة بالمنتج المحذوف بناءً على `productLabel`
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

      // حساب المجموع الجديد
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
      <div style={styles.tooltipContainer}>
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
                onClick={(e) =>{
                  e.preventDefault(); // يمنع إرسال النموذج
                  handleDeleteProduct(option.label)}}
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
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    backgroundColor: "gold",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
    borderRadius: "10px",
    padding: "10px",
    width: "350px",
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
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default TooltipSidebar;
