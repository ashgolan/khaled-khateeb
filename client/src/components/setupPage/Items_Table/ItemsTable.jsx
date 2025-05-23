import React, { useState } from "react";
import { useEffect } from "react";
import DeleteItem from "../Delete_Item/DeleteItem";
import EditItem from "../Edit_Item/EditItem";
import "./Item_Table.css";
import Select from "react-select";
import InputForQuantity from "../Add_Item/InputForQuantity";
import { getSumOfValues } from "../../../utils/getValuesSum";
import { getProductKeys } from "../../../utils/getProductKeys";
import { Tooltip } from "react-tooltip";
import TooltipSidebar from "./TooltipSidebar";

export default function ItemsTable({
  item,
  itemInChange,
  setItemInChange,
  myData,
  setItemIsUpdated,
  collReq,
  selectData,
  report,
  expenses,
  personalProductExpenses,
  tractorPrice,
}) {
  const [changeStatus, setChangeStatus] = useState({
    editText: "עריכה",
    delete: "מחיקה",
    disabled: true,
    itemId: null,
  });
  const [itemsValues, setItemsValues] = useState({
    name: "",
    clientName: "",
    number: "",
    purpose: "",
    strains: "",
    product: [],
    water: "",
    workKind: "",
    other: "",
    quantity: "",
    workPrice: "",
    weightKind: "",
    colored: false,
    date: "",
    tax: false,
    pricesOfProducts: {},
    quantitiesOfProduct: {},
    totalAmount: 0,
  });
  console.log(itemsValues);
  
  useEffect(() => {
    const getData = async () => {
      const thisItem = myData?.find((t) => t._id === item._id);
      setItemsValues((prev) => {
        return {
          name: thisItem.name ? thisItem.name : "",
          clientName: thisItem.clientName ? thisItem.clientName : "",
          number: thisItem.number ? thisItem.number : "",
          purpose: thisItem.purpose ? thisItem.purpose : "",
          strains: thisItem.strains ? thisItem.strains : "",
          other: thisItem.other ? thisItem.other : "",
          product: thisItem.product ? thisItem.product : [],
          workPrice: thisItem.workPrice ? thisItem.workPrice : "",
          weightKind: thisItem.weightKind ? thisItem.weightKind : "",
          workKind: thisItem.workKind ? thisItem.workKind : "",
          pricesOfProducts: thisItem.pricesOfProducts
            ? thisItem.pricesOfProducts
            : {},
          water: thisItem.water ? thisItem.water : "",
          quantity: thisItem.quantity ? thisItem.quantity : "",
          colored: thisItem.colored ? thisItem.colored : false,
          date: thisItem.date ? thisItem.date : "",
          quantitiesOfProduct: thisItem.quantitiesOfProduct
            ? thisItem.quantitiesOfProduct
            : {},
          tax: thisItem.tax ? thisItem.tax : false,
          totalAmount: thisItem.totalAmount ? thisItem.totalAmount : "",
        };
      });
    };
    getData();
  }, [item._id, myData]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      textAlign: "right",
      border: "none",
      backgroundColor: "white",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxHeight: changeStatus.disabled && "40px",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      // display: report?.type !== undefined && "none",
      display: "none",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "10px", // Adjust padding as needed
      background: state.isFocused ? "gold" : "rgb#ffd900",
      color: state.isFocused ? "rgb(48, 45, 45)" : "inherit",
    }),
    singleValue: (provided, styles, state) => ({
      ...provided,
      ...styles,

      margin: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "black",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
  };

  const changeColorOfClientName = (e) => {
    setItemsValues((prev) => {
      return { ...prev, colored: !prev.colored };
    });
  };
  const ids = selectData.map(({ clientName }) => clientName);
  const filtered = selectData.filter(
    ({ clientName }, index) => !ids.includes(clientName, index + 1)
  );
  const allSelectData = filtered?.map((item) => {
    return { value: item._id, label: item.clientName };
  });
  const productsData =
    collReq === "/sales" ? expenses : personalProductExpenses;

  const idsOfProduct = productsData?.map(({ name }) => name);

  const filteredProducts = productsData?.filter(
    ({ product }) => !idsOfProduct.includes(product)
  );

  const customSingleValue = ({ data }) => (
    <div
      data-tooltip-id={`tooltip-${data.value}`}
      data-tooltip-content={data.date} // إضافة التاريخ داخل التولتيب
      style={{ cursor: 'pointer' }} // إضافة مؤشر الفأرة لجعلها تفاعلية
    >
      {data.label}
      <Tooltip id={`tooltip-${data.value}`} place="top" effect="solid" />
    </div>
  );
  
  const customOption = ({ data, innerRef, innerProps, isFocused }) => {
    // Set styles based on whether the option is focused
    const optionStyles = {
      padding: "5px",
      cursor: "pointer",
      backgroundColor: isFocused ? "gold" : "transparent", // Change background color when focused
      color: isFocused ? "black" : "initial", // Change text color when focused
    };
  
    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={optionStyles} // Apply the styles here
      >
        <span
          data-tooltip-id={`tooltip-${data.value}`}
          data-tooltip-content={data.date}
        >
          {data.label}
        </span>
        <Tooltip id={`tooltip-${data.value}`} place="top" effect="solid" />
      </div>
    );
  };
  
  const allSelectProducts = filteredProducts
  ?.sort((a, b) => a.name.localeCompare(b.name))
  .map((item, index) => ({
    value: `${index}-${item.number}`,
    label: `${item.name} - ${item.number} ש"ח`,
    date: item.date, // يجب أن يكون تاريخاً صحيحاً
  }));
  // const filteredOptions = allSelectProducts.filter(
  //   (option) => !itemsValues?.product.includes(option)
  // );
console.log(itemsValues);

  const allSelectLandData = selectData?.filter((item) => {
    return itemsValues.clientName === item.clientName;
  });
  const allSelectLandNames = allSelectLandData?.map((item) => {
    return { value: item._id, label: item.name };
  });
  const quantitiesInArray = Object?.entries(
    itemsValues?.quantitiesOfProduct || {}
  );

  const PricesInArray = Object.entries(itemsValues?.pricesOfProducts || {});

  const getTotalsOfProducts = () => {
    let sum = 0;
    quantitiesInArray?.map((product, index) => {
      
      sum += +PricesInArray[index][1];
    });
    return sum;
  };
 
  
  return (
    <>
      <form className="form-container-in-table">
        <div
          className="Item_form"
          key={`form${item.id}`}
          style={{
            width:
              collReq === "/clients" ? "80%" : report?.type ? "100%" : "98%",
          }}
        >
          <label
            id="colored"
            className={itemsValues?.colored ? "inner" : "notInner"}
            disabled={changeStatus.disabled}
            onDoubleClick={changeColorOfClientName}
            style={{
              pointerEvents: changeStatus.disabled ? "none" : "auto", // Disable clicks when disabled
              cursor: changeStatus.disabled ? "not-allowed" : "pointer", // Change cursor to indicate it's disabled
            }}
          />
          {(collReq === "/expenses" ||
            collReq === "/personalProductExpenses" ||
            collReq === "/sales" ||
            collReq === "/personalInvestments" ||
            collReq === "/personalRkrExpenses" ||
            collReq === "/personalSales" ||
            collReq === "/personalWorkers") && (
            <input
              id="date"
              type="date"
              className="input_show_item date-input"
              style={{
                width: report?.type ? "15%" : "11%",
                textAlign: "center",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.date}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, date: e.target.value };
                });
              }}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            ></input>
          )}

          {collReq === "/personalRkrExpenses" && (
            <Select
              id="workKind"
              isDisabled={changeStatus.disabled}
              options={[
                { value: "risos", label: "ריסוס" },
                { value: "kisoah", label: "קיסוח" },
                { value: "risok", label: "ריסוק" },
              ]}
              placeholder={
                itemsValues?.workKind ? itemsValues.workKind : "סוג עבודה"
              }
              className="input_show_item select-product-head "
              styles={customStyles}
              value={itemsValues.workKind}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    workKind: e.label,
                    number: e.label === "ריסוס" ? prev.number : "",
                    pricesOfProducts:
                      e.label === "ריסוס" ? prev.pricesOfProducts : {},
                    quantitiesOfProduct:
                      e.label === "ריסוס" ? prev.quantitiesOfProduct : {},
                    product: e.label === "ריסוס" ? prev.product : [],
                    totalAmount : e.label === "ריסוס" ? +prev.workPrice + +prev.number :+prev.workPrice
                  };
                });
              }}
            />
          )}

          {(collReq === "/clients" || collReq === "/personalWorkers") && (
            <input
              id="clientName"
              className="input_show_item"
              style={{
                width: collReq === "/clients" ? "25%" : "10%",
                color: itemsValues.colored ? "rgb(255, 71, 46)" : "black",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.clientName}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, clientName: e.target.value };
                });
              }}
            ></input>
          )}
          {collReq === "/sales" && (
            <Select
              options={allSelectData}
              className="input_show_item select-product-head "
              placeholder={
                itemsValues?.clientName ? itemsValues.clientName : "בחר חקלאי"
              }
              isDisabled={changeStatus.disabled}
              styles={customStyles}
              menuPlacement="auto"
              required
              value={itemsValues.clientName}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    name: "",
                    clientName: e.label,
                  };
                });
              }}
            ></Select>
          )}
          {collReq === "/sales" && (
            <Select
              options={allSelectLandNames}
              className="input_show_item select-product-head "
              placeholder={itemsValues?.name ? itemsValues.name : "בחר מוצר"}
              isDisabled={changeStatus.disabled}
              styles={customStyles}
              menuPlacement="auto"
              required
              value={itemsValues.name}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    name: e.label,
                  };
                });
              }}
            ></Select>
          )}

          {(collReq === "/clients" ||
            collReq === "/expenses" ||
            collReq === "/personalSales" ||
            collReq === "/personalInvestments" ||

            collReq === "/personalRkrExpenses" ||
            collReq === "/personalProductExpenses" ||
            collReq === "/personalWorkers") && (
            <input
              id="name"
              className="input_show_item"
              style={{
                color: itemsValues.colored && itemsValues.clientName === '' ? "rgb(255, 71, 46)" : "black",

                maxWidth:
                  collReq === "/clients" || collReq === "/expenses" ||      collReq === "/personalInvestments" 
                    ? "32%"
                    : collReq === "/sales" ||
                      collReq === "/expenses" ||
                      collReq === "/personalWorkers" ||
                      collReq === "/personalSales" ||
                      collReq === "/personalRkrExpenses" ||
                      collReq === "/personalProductExpenses"
                    ? "10%"
                    : report?.type
                    ? "55%"
                    : "15%",

                minWidth:
                  collReq === "/clients" || collReq === "/expenses"    ||      collReq === "/personalInvestments" 

                    ? "32%"
                    : collReq === "/sales" ||
                      collReq === "/expenses" ||
                      collReq === "/personalSales" ||
                      collReq === "/personalRkrExpenses" ||
                      collReq === "/personalWorkers" ||
                      collReq === "/personalProductExpenses"
                    ? "10%"
                    : report?.type
                    ? "55%"
                    : "15%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.name}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, name: e.target.value };
                });
              }}
            ></input>
          )}
          {collReq === "/sales" && (
            <input
              id="purpose"
              className="input_show_item"
              style={{
                width: report?.type ? "10%" : "7%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.purpose}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, purpose: e.target.value };
                });
              }}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            />
          )}
          {(collReq === "/personalSales" || collReq === "/sales") && (
            <input
              id="strains"
              className="input_show_item"
              style={{
                width:report?.type ?"10%" : "7%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.strains}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, strains: e.target.value };
                });
              }}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            />
          )}
          {collReq === "/personalSales" && (
            <Select
              id="weightKind"
              options={[
                { value: "kg", label: "קילו" },
                { value: "mical", label: "מיכל" },
                { value: "null", label: "-" },
              ]}
              placeholder={
                itemsValues?.weightKind ? itemsValues.weightKind : "בחר משקל"
              }
              className="input_show_item select-product-weightKind "
              styles={customStyles}
              disabled={changeStatus.disabled}
              value={itemsValues.weightKind}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, weightKind: e.label };
                });
              }}
            />
          )}
          {(collReq === "/sales" || collReq === "/personalRkrExpenses") &&
            !report?.type && (
              <Select
              options={allSelectProducts}
                components={{ SingleValue: customSingleValue, Option: customOption }}

                // options={filteredOptions}
                className="input_show_item select-product-head Select-multi-value-wrapper "
                placeholder={
                  itemsValues?.product ? itemsValues.product : "בחר חומר"
                }
                isDisabled={changeStatus.disabled}
                styles={customStyles}
                menuPlacement="auto"
                isMulti
                required
                value={itemsValues?.product}
                onChange={(selectedOptions) => {
                  const keysOfProductNames = selectedOptions.map(
                    (obj) => obj["label"]
                  );
                  setItemsValues((prev) => {
                    const myNewQuantitis = getProductKeys(
                      prev.quantitiesOfProduct,
                      keysOfProductNames
                    );
                    const myNewPrices = getProductKeys(
                      prev.pricesOfProducts,
                      keysOfProductNames
                    );
                    
                    const sumOfPrices = getSumOfValues(myNewPrices);
                    return {
                      ...prev,
                      quantitiesOfProduct: myNewQuantitis,
                      pricesOfProducts: myNewPrices,
                      number: sumOfPrices,
                      product: selectedOptions,
                      totalAmount:
                        collReq === "/sales"
                          ? +sumOfPrices + +(+tractorPrice * prev.quantity)
                          : +sumOfPrices + +prev.workPrice,
                    };
                  });
                }}
              ></Select>
            )}
            <TooltipSidebar
  itemsValues={itemsValues}
  changeStatus={changeStatus}
  collReq={collReq}
  tractorPrice={tractorPrice}
  setItemsValues={setItemsValues}
/>
          {/* {itemsValues?.product?.length > 0 && !changeStatus.disabled && (
            <div className="Productquantities">
              {itemsValues?.product.map((option, index) => (
                <InputForQuantity
                  collReq={collReq}
                  tractorPrice={+tractorPrice}
                  itemsValues={itemsValues}
                  setItemsValues={setItemsValues}
                  option={option}
                  quantityValue={
                    Object.values(itemsValues?.quantitiesOfProduct ?? {})[index]
                  }
                ></InputForQuantity>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "brown",
                }}
              >
                <input
                  name="quantitiesOfProducts"
                  id="quantitiesOfProducts"
                  style={{
                    width:  "15%",
                    border: "none",
                  }}
                  disabled
                  placeholder={"כ.חומר"}
                  value={getSumOfValues(itemsValues.quantitiesOfProduct)}
                ></input>
                <label>: כמות החומר</label>
              </div>
            </div>
          )} */}
          {collReq !== "/clients" && (
            <input
              id="number"
              className="input_show_item"
              style={{
                width:
                  collReq === "/sales" ||      collReq === "/personalInvestments" 
                    ? "6%"
                    : collReq === "/expenses" ||
                      collReq === "/personalSales" ||
                      collReq === "/personalRkrExpenses"
                    ? "10%"
                    : "15%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.number}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    number: e.target.value,
                    totalAmount:
                      collReq === "/personalRkrExpenses"
                        ? +e.target.value + +prev.pricesOfProducts
                        : collReq === "/expenses" ||
                          collReq === "/personalProductExpenses" ||
                          collReq === "/personalSales"
                        ? +e.target.value * +itemsValues.quantity
                        : +e.target.value +
                          +tractorPrice * +itemsValues.quantity,
                  };
                });
              }}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            ></input>
          )}
          {collReq === "/personalRkrExpenses" && (
            <input
              id="workPrice"
              className="input_show_item"
              style={{
                width: "5%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.workPrice}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    workPrice: +e.target.value,
                    totalAmount: +prev.number + +e.target.value,
                  };
                });
              }}
            ></input>
          )}

          {(collReq === "/clients" ||
            collReq === "/sales" ||
            collReq === "/personalSales" ||
            collReq === "/personalRkrExpenses" ||
            collReq === "/personalProductExpenses" ||
            collReq === "/expenses") && (
            <input
              id="quantity"
              className="input_show_item"
              style={{
                width: collReq === "/clients" ? "15%" : "5%",
                color: collReq === "/clients" ? "rgb(184, 89, 0)" : "black",
                fontWeight: collReq === "/clients" ? "bold" : "normal",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.quantity}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    quantity: e.target.value,
                    totalAmount:
                      collReq === "/expenses" ||
                      collReq === "/personalProductExpenses" ||
                      collReq === "/personalSales"
                        ? +e.target.value * +itemsValues.number
                        : +prev.number + +(tractorPrice * +e.target.value),
                  };
                });
              }}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            ></input>
          )}
          {collReq === "/sales" && (
            <input
              id="letersOfProduct"
              className="input_show_item"
              style={{
                width: "5%",
              }}
              disabled
              value={Object.values(
                itemsValues?.quantitiesOfProduct ?? {}
              )?.reduce((acc, curr) => acc + curr, 0)}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            ></input>
          )}

          {collReq === "/sales" && (
            <input
              id="water"
              className="input_show_item"
              style={{ width: "5%" }}
              disabled={changeStatus.disabled}
              value={itemsValues.water}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, water: e.target.value };
                });
              }}
              onKeyDown={(e) => e.key === "Enter" && e.preventDefault()} // منع Enter

            />
          )}
          {(collReq === "/personalRkrExpenses" ||           collReq === "/personalInvestments" )
 && (
            <input
              id="other"
              className="input_show_item"
              style={{
                width:     collReq === "/personalInvestments" ? "15%" : "7%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.other}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, other: e.target.value };
                });
              }}
            />
          )}
          {(collReq === "/expenses" ||
            collReq === "/sales" ||
            collReq === "/personalProductExpenses" ||
            collReq === "/personalRkrExpenses" ||
            collReq === "/personalInvestments" ||
            collReq === "/personalSales" ||
            collReq === "/personalWorkers") && (
            <input
              id="totalAmount"
              className="input_show_item"
              style={{
                width:
                  collReq === "/expenses" ? "8%" : report?.type ? "10%" : "7%",
                color: "rgb(184, 89, 0)",
                fontWeight: "bold",
              }}
              disabled
              value={(itemsValues?.totalAmount
                ? +itemsValues.totalAmount
                : 0
              ).toFixed(1)}
            ></input>
          )}

          {!report?.type && (
            <EditItem
              item={item}
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              changeStatus={changeStatus}
              setChangeStatus={setChangeStatus}
              itemsValues={itemsValues}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
            ></EditItem>
          )}
          {!report?.type && (
            <DeleteItem
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              item={item}
              changeStatus={changeStatus}
              setChangeStatus={setChangeStatus}
              setItemsValues={setItemsValues}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
            ></DeleteItem>
          )}
        </div>
        {collReq === "/sales" && report?.type && (
          <div
            style={{
              display: "flex",
              width: "80%",
              justifyContent: "flex-end",
              paddingRight: "1%",
              marginBottom: "1px",
            }}
          >
            <div
              style={{
                padding: "0 1%",
                color: "green",
              }}
            >
              <label htmlFor="" style={{ color: "brown" }}>
                [
              </label>
              {`  ( ש"ח `}
              <label htmlFor="">
                {(+itemsValues.totalAmount - +getTotalsOfProducts()).toFixed(2) + " )"}
                {/* {+tractorPrice * +itemsValues?.quantity + " )"} */}
              </label>
              <label htmlFor="" style={{ color: "darkblue" }}>
                {" "}
                : עבודת טרקטור
              </label>
            </div>
            {quantitiesInArray?.map(([key, value], index) => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  justifyContent: "space-between",
                  padding: "0 1%",
                  color: "darkblue",
                }}
              >
                <label
                  style={{ color: "green", direction: "rtl", margin: "0 10px" }}
                >
                  {key.split("-")[0]} {value} {"ל. ("} {+PricesInArray[index][1].toFixed(2)} {`ש"ח`}
                  {") "}
                </label>
              </div>
            ))}
            <label htmlFor="" style={{ color: "darkblue" }}>
              {" "}
              : חומרים
            </label>
            <label style={{ color: "brown" }}> ] חישוב מפורט</label>
          </div>
        )}
        <div
          style={{
            width: "84.7%",
            borderBottom: report?.type && "1px black dotted",
          }}
        ></div>
      </form>
    </>
  );
}
