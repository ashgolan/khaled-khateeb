import React, { useState } from "react";
import { useEffect } from "react";
import DeleteItem from "../Delete_Item/DeleteItem";
import EditItem from "../Edit_Item/EditItem";
import "./Item_Table.css";
import Select from "react-select";
import InputForQuantity from "../Add_Item/InputForQuantity";
import { getSumOfValues } from "../../../utils/getValuesSum";
import { getProductKeys } from "../../../utils/getProductKeys";
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
    quantity: "",
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
          product: thisItem.product ? thisItem.product : [],
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
      color: state?.isSelected ? "red" : "black",

      margin: "0",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: itemsValues.colored ? "rgb(255, 71, 46)" : "black",
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
  const idsOfProduct = expenses?.map(({ name }) => name);
  const filteredProducts = expenses?.filter(
    ({ product }, index) => !idsOfProduct.includes(product, index + 1)
  );
  const allSelectProducts = filteredProducts?.map((item) => {
    return { value: item.number, label: item.name };
  });
  const filteredOptions = allSelectProducts.filter(
    (option) => !itemsValues?.product.includes(option)
  );

  const allSelectLandData = selectData?.filter((item) => {
    return itemsValues.clientName === item.clientName;
  });
  const allSelectLandNames = allSelectLandData?.map((item) => {
    return { value: item._id, label: item.name };
  });
  return (
    <>
      <form
        className="form-container-in-table"
        style={{
          borderBottom: collReq === "/sales" && "1px black dotted",
        }}
      >
        <div
          className="Item_form"
          key={`form${item.id}`}
          style={{
            width: collReq === "/clients" ? "60%" : "95%",
          }}
        >
          {(collReq === "/expenses" || collReq === "/sales") && (
            <input
              id="date"
              type="date"
              className="input_show_item date-input"
              style={{
                width: report?.type ? "15%" : "13%",
                textAlign: "center",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.date}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, date: e.target.value };
                });
              }}
            ></input>
          )}

          {collReq === "/clients" && (
            <input
              id="clientName"
              className="input_show_item"
              style={{
                width: collReq === "/clients" ? "25%" : "13%",
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

          {(collReq === "/clients" || collReq === "/expenses") && (
            <input
              id="name"
              className="input_show_item"
              style={{
                maxWidth:
                  collReq === "/clients" || collReq === "/expenses"
                    ? "32%"
                    : collReq === "/sales" || collReq === "/expenses"
                    ? "13%"
                    : report?.type
                    ? "45%"
                    : "15%",

                minWidth:
                  collReq === "/clients" || collReq === "/expenses"
                    ? "32%"
                    : collReq === "/sales" || collReq === "/expenses"
                    ? "13%"
                    : report?.type
                    ? "45%"
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
                width: "8%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.purpose}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, purpose: e.target.value };
                });
              }}
            />
          )}
          {collReq === "/sales" && (
            <input
              id="strains"
              className="input_show_item"
              style={{
                width: "7%",
              }}
              disabled={changeStatus.disabled}
              value={itemsValues.strains}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return { ...prev, strains: e.target.value };
                });
              }}
            />
          )}
          {collReq === "/sales" && !report?.type && (
            <Select
              options={filteredOptions}
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
                    totalAmount: +sumOfPrices + +(tractorPrice * prev.quantity),
                  };
                });
              }}
            ></Select>
          )}
          {itemsValues?.product?.length > 0 && !changeStatus.disabled && (
            <div className="Productquantities">
              {itemsValues?.product.map((option, index) => (
                <InputForQuantity
                  tractorPrice={tractorPrice}
                  itemsValues={itemsValues}
                  setItemsValues={setItemsValues}
                  option={option}
                  quantityValue={
                    Object.values(itemsValues?.quantitiesOfProduct ?? {})[index]
                  }
                ></InputForQuantity>
              ))}
            </div>
          )}
          {collReq !== "/clients" && (
            <input
              id="number"
              className="input_show_item"
              style={{
                width:
                  collReq === "/sales"
                    ? "6%"
                    : collReq === "/expenses"
                    ? "10%"
                    : "15%",
              }}
              onDoubleClick={changeColorOfClientName}
              disabled={changeStatus.disabled}
              value={itemsValues.number}
              onChange={(e) => {
                setItemsValues((prev) => {
                  return {
                    ...prev,
                    number: e.target.value,
                    totalAmount:
                      collReq === "/expenses"
                        ? +e.target.value * +itemsValues.quantity
                        : +e.target.value +
                          +tractorPrice * +itemsValues.quantity,
                  };
                });
              }}
            ></input>
          )}

          {(collReq === "/clients" ||
            collReq === "/sales" ||
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
                    quantity: +e.target.value,
                    totalAmount:
                      collReq === "/expenses"
                        ? +e.target.value * +itemsValues.quantity
                        : +prev.number + +(tractorPrice * +e.target.value),
                  };
                });
              }}
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
            />
          )}

          {(collReq === "/expenses" || collReq === "/sales") && (
            <input
              id="totalAmount"
              className="input_show_item"
              style={{
                width: collReq === "/expenses" ? "8%" : "7%",
                color: "rgb(184, 89, 0)",
                fontWeight: "bold",
              }}
              disabled
              value={+itemsValues?.totalAmount?.toFixed(2)}
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
            style={{ display: "flex", width: "90%", justifyContent: "center" }}
          >
            {itemsValues?.product?.map((option, index) => (
              <label key={option.value} style={{ color: "green" }}>
                {index !== 0 && index !== itemsValues?.product.length && ` - `}
                {option.label}
              </label>
            ))}
            <label style={{ color: "brown" }}>
              {" "}
              : בעבודה הזאת היה שימוש בחומר
            </label>
          </div>
        )}
      </form>
    </>
  );
}
