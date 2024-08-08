import React, { useContext } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Api } from "../../../utils/Api";
import { FetchingStatus } from "../../../utils/context";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import "./Add_item.css";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import Select from "react-select";
import InputForQuantity from "./InputForQuantity";
import { getProductKeys } from "../../../utils/getProductKeys";
import { getSumOfValues } from "../../../utils/getValuesSum";
export default function AddItem({
  setaddItemToggle,
  setItemIsUpdated,
  collReq,
  selectData,
  expenses,
  tractorPrice,
}) {
  const date = new Date();
  const year = date.getFullYear();
  const month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemsValues, setItemsValues] = useState({
    date: year + "-" + month + "-" + day,
    clientName: "",
    name: "",
    quantity: "",
    number: "",
    purpose: "",
    strains: "",
    pricesOfProducts: {},
    product: [],
    water: "",
    tax: false,
    colored: false,
    totalAmount: 0,
    quantitiesOfProduct: {},
  });
  const sendPostRequest = async (token) => {
    const headers = {
      Authorization: token,
    };
    setFetchingStatus({ loading: true, error: false });
    switch (collReq) {
      case "/clients":
        await Api.post(
          collReq,
          {
            clientName: itemsValues.clientName.trim(),
            name: itemsValues.name.trim(),
            quantity: itemsValues.quantity,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/expenses":
        await Api.post(
          collReq,
          {
            date: itemsValues.date,
            name: itemsValues.name,
            number: itemsValues.number,
            quantity: itemsValues.quantity,
            totalAmount: itemsValues.totalAmount,
            // tax: itemsValues.tax,
            colored: itemsValues.colored,
          },
          {
            headers: headers,
          }
        );
        break;
      case "/sales":
        await Api.post(
          collReq,
          {
            date: itemsValues.date,
            clientName: itemsValues.clientName,
            name: itemsValues.name,
            number: itemsValues.number,
            pricesOfProducts: itemsValues.pricesOfProducts,
            purpose: itemsValues.purpose,
            product: itemsValues.product,
            water: itemsValues.water,
            strains: itemsValues.strains,
            colored: itemsValues.colored,
            tax: itemsValues.tax,
            quantity: itemsValues.quantity,
            quantitiesOfProduct: itemsValues.quantitiesOfProduct,
            totalAmount: itemsValues.totalAmount,
          },
          {
            headers: headers,
          }
        );
        break;
      default:
        await Api.post(
          collReq,
          { name: itemsValues.name, number: itemsValues.number },
          {
            headers: headers,
          }
        );
    }

    setItemIsUpdated((prev) => !prev);

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        error: false,
        message: "המוצר נוסף בהצלחה",
      };
    });
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return {
          ...prev,
          status: false,
          loading: false,
          error: false,
          message: null,
        };
      });
    }, 1000);
  };

  const addItem = async () => {
    try {
      await sendPostRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await sendPostRequest(newAccessToken);
          } catch (e) {
            throw e;
          }
        } catch (refreshError) {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
            };
          });
          clearTokens();

          navigate("/homepage");
        }
      } else {
        clearTokens();

        setFetchingStatus((prev) => {
          return {
            ...prev,
            status: false,
            loading: false,
            message: ".. תקלה בביטול ההזמנה",
          };
        });
        setTimeout(() => {
          setFetchingStatus((prev) => {
            return {
              ...prev,
              status: false,
              loading: false,
              message: null,
            };
          });
          navigate("/homepage");
        }, 1000);
      }
    }
  };

  const confirmAddingItem = (e) => {
    e.preventDefault();

    setaddItemToggle({ btnVisible: true, formVisible: false });
    addItem();
  };
  const cancelAddingItem = (e) => {
    e.preventDefault();
    setaddItemToggle({ btnVisible: true, formVisible: false });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
      border: "none",
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
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
  const allSelectProducts = filteredProducts?.map((item, index) => {
    return { value: `${index}-` + item.number, label: item.name };
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
  const changeColorOfClientName = (e) => {
    setItemsValues((prev) => {
      return { ...prev, colored: !prev.colored };
    });
  };

  return (
    <form
      onSubmit={confirmAddingItem}
      className="addItem_form"
      style={{ width: collReq === "/sales" && "95%" }}
    >
      <div className="add-row">
        {(collReq === "/expenses" || collReq === "/sales") && (
          <input
            name="date"
            type="date"
            id="date"
            style={{ width: collReq === "/sales" ? "11%" : "25%" }}
            required
            className="add_item"
            placeholder="בחר תאריך"
            value={itemsValues.date}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, date: e.target.value };
              })
            }
          ></input>
        )}
        {collReq === "/sales" && (
          <Select
            options={allSelectData}
            className="add_item select-product-in-add "
            placeholder={"בחר חקלאי"}
            styles={customStyles}
            menuPlacement="auto"
            required
            onChange={(e) => {
              setItemsValues((prev) => {
                return {
                  ...prev,
                  clientName: e.label,
                };
              });
            }}
          ></Select>
        )}
        {collReq === "/sales" && (
          <Select
            options={allSelectLandNames}
            className="add_item select-product-in-add "
            placeholder={"בחר מטע"}
            styles={customStyles}
            menuPlacement="auto"
            required
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
        {collReq === "/clients" && (
          <input
            name="clientName"
            id="clientName"
            required
            autoFocus={true}
            className="add_item"
            style={{
              width: collReq === "/sales" ? "10%" : "15%",
              color: itemsValues.colored ? "rgb(255, 71, 46)" : "black",
            }}
            placeholder={"קליינט"}
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, clientName: e.target.value };
              })
            }
            value={itemsValues.clientName}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            id="purpose"
            className="add_item select-product-in-add "
            placeholder="מטרת הטיפול"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, purpose: e.target.value };
              })
            }
            value={itemsValues.purpose}
            required
          />
        )}
        {collReq === "/sales" && (
          <input
            id="strains"
            required
            className="add_item select-product-in-add "
            placeholder="זנים מטופלים"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, strains: e.target.value };
              })
            }
            value={itemsValues.strains}
          />
        )}

        {(collReq === "/clients" || collReq === "/expenses") && (
          <input
            name="name"
            id="name"
            required
            autoFocus={true}
            className="add_item"
            style={{ width: "35%" }}
            placeholder={
              collReq === "/expenses"
                ? "שם החומר"
                : collReq === "/clients"
                ? "מטע"
                : "מוצר"
            }
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, name: e.target.value };
              })
            }
            value={itemsValues.name}
          ></input>
        )}
        {collReq === "/sales" && (
          <Select
            options={filteredOptions}
            className="add_item select-product-in-add "
            placeholder={
              itemsValues?.product.length > 0 ? itemsValues.product : "בחר חומר"
            }
            styles={customStyles}
            menuPlacement="auto"
            isMulti
            required
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
        {itemsValues?.product?.length > 0 && (
          <div className="Productquantities">
            {itemsValues?.product.map((option) => (
              <InputForQuantity
                tractorPrice={tractorPrice}
                itemsValues={itemsValues}
                setItemsValues={setItemsValues}
                option={option}
              ></InputForQuantity>
            ))}
          </div>
        )}
        {collReq !== "/clients" && (
          <input
            name="number"
            id="number"
            style={{
              width: collReq === "/sales" ? "6%" : "15%",
            }}
            required
            className="add_item"
            placeholder={
              collReq === "/contacts" || collReq === "/providers"
                ? "מספר"
                : "מחיר"
            }
            onDoubleClick={changeColorOfClientName}
            onChange={(e) =>
              setItemsValues((prev) => {
                let sumOfPrices = 0;
                const product = itemsValues.pricesOfProducts;
                for (const key in product) {
                  sumOfPrices += product[key];
                }
                return {
                  ...prev,
                  number: e.target.value,
                  totalAmount:
                    collReq === "/expenses"
                      ? +e.target.value * +itemsValues.quantity
                      : +e.target.value * +sumOfPrices +
                        +tractorPrice * +itemsValues.quantity,
                };
              })
            }
            value={itemsValues.number}
          ></input>
        )}
        {collReq === "/sales" && (
          <input
            name="quantitiesOfProducts"
            id="quantitiesOfProducts"
            style={{
              width: collReq === "/sales" ? "6%" : "15%",
            }}
            disabled
            className="add_item"
            placeholder={"כ.חומר"}
            onDoubleClick={changeColorOfClientName}
            value={getSumOfValues(itemsValues.quantitiesOfProduct)}
          ></input>
        )}

        <input
          name="quantity"
          id="quantity"
          style={{ width: "10%" }}
          required
          className="add_item"
          placeholder={collReq === "/sales" ? "שטח" : "כמות"}
          onChange={(e) => {
            setItemsValues((prev) => {
              const sum = Object.values(prev.pricesOfProducts).reduce(
                (acc, curr) => acc + curr,
                0
              );

              return {
                ...prev,
                quantity: e.target.value,
                totalAmount:
                  collReq === "/expenses"
                    ? +itemsValues.number * +e.target.value
                    : +sum + +(tractorPrice * e.target.value),
              };
            });
          }}
          value={itemsValues.quantity}
        ></input>

        {collReq === "/sales" && (
          <input
            id="water"
            className="add_item select-product-in-add "
            placeholder="מים לריסוס"
            onChange={(e) =>
              setItemsValues((prev) => {
                return { ...prev, water: e.target.value };
              })
            }
            value={itemsValues.water}
            required
          />
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row-reverse",
          justifyContent: "center",
          marginTop: "1%",
        }}
      >
        <input className="confirm_addItem" type="submit" value="אישור"></input>
        <button className="remove_addItem" onClick={cancelAddingItem}>
          ביטול
        </button>
      </div>
    </form>
  );
}
