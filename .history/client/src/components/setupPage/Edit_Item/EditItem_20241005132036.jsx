// import React from "react";
// import "./EditItem.css";
// import { FetchingStatus } from "../../../utils/context";
// import { useContext } from "react";
// import { Api } from "../../../utils/Api";
// import { useNavigate } from "react-router";
// import { refreshMyToken } from "../../../utils/setNewAccessToken";
// import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
// import { getCollectionProps } from "../../../utils/collectionProps";
// import lodash from "lodash";
// export default function EditItem({
//   item,
//   itemInChange,
//   setItemInChange,
//   changeStatus,
//   setChangeStatus,
//   itemsValues,
//   setItemIsUpdated,
//   collReq,
// }) {
//   const navigate = useNavigate();
//   const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
//   const checkInputsValues = () => {
//     const thisProps = getCollectionProps(collReq);
//     if (!thisProps) return;
//     for (let i in itemsValues) {
//       if (itemsValues[i]?.length < 1 && thisProps.includes(i)) return true;
//     }
//   };
//   const isSameProducts = () => {
//     return Object.entries(itemsValues?.product).every(
//       ([key, value]) => item?.product[key] === value
//     );
//   };
//   const isSameQuantities = () => {
//     const updatedSale = itemsValues?.quantitiesOfProduct;
//     const currentSale = item?.quantitiesOfProduct;
//     return lodash.isEqual(updatedSale, currentSale);
//   };

//   const isInputsChanged = () => {
//     switch (collReq) {
//       case "/clients":
//         return (
//           itemsValues.clientName !== item.clientName ||
//           itemsValues.name !== item.name ||
//           itemsValues.quantity !== item.quantity
//         );
//       case "/personalWorkers":
//         return (
//           itemsValues.date !== item.date ||
//           itemsValues.clientName !== item.clientName ||
//           itemsValues.name !== item.name ||
//           itemsValues.number !== item.number||
//           itemsValues.colored !== item.colored||
//           itemsValues.totalAmount !== item.totalAmount
//         );
//       case "/sales":
//         return (
//           itemsValues.date !== item.date ||
//           itemsValues.clientName !== item.clientName ||
//           itemsValues.name !== item.name ||
//           itemsValues.purpose !== item.purpose ||
//           itemsValues.strains !== item.strains ||
//           itemsValues.number !== item.number ||
//           // itemsValues.pricesOfProducts !== !isSameQuantities() ||
//           !isSameQuantities() ||
//           itemsValues.quantity !== item.quantity ||
//           !isSameProducts() ||
//           itemsValues.water !== item.water ||
//           itemsValues.totalAmount !== item.totalAmount ||
//           itemsValues.colored !== item.colored
//         );
//       case "/expenses":
//         return (
//           itemsValues.date !== item.date ||
//           itemsValues.name !== item.name ||
//           itemsValues.number !== item.number ||
//           itemsValues.quantity !== item.quantity ||
//           itemsValues.totalAmount !== item.totalAmount ||
//           itemsValues.tax !== item.tax ||
//           itemsValues.colored !== item.colored
//         );
//       default:
//         return (
//           itemsValues.number !== item.number || itemsValues.name !== item.name
//         );
//     }
//   };
//   const sendRequest = async (token) => {
//     const headers = { Authorization: token };
//     setFetchingStatus((prev) => {
//       return { ...prev, status: true, loading: true };
//     });
//     switch (collReq) {
//       case "/clients":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             clientName: itemsValues.clientName.trim(),
//             name: itemsValues.name.trim(),
//             quantity: itemsValues.quantity,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/sales":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             clientName: itemsValues.clientName,
//             name: itemsValues.name,
//             number: itemsValues.number,
//             purpose: itemsValues.purpose,
//             pricesOfProducts: itemsValues.pricesOfProducts,
//             quantitiesOfProduct: itemsValues.quantitiesOfProduct,
//             product: itemsValues.product,
//             water: itemsValues.water,
//             strains: itemsValues.strains,
//             colored: itemsValues.colored,
//             tax: itemsValues.tax,
//             quantity: itemsValues.quantity,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/personalWorkers":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             clientName: itemsValues.clientName,
//             name: itemsValues.name,
//             number: itemsValues.number,
//             colored: itemsValues.colored,
//             totalAmount: itemsValues.totalAmount,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       case "/expenses":
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           {
//             date: itemsValues.date,
//             name: itemsValues.name,
//             number: itemsValues.number,
//             quantity: itemsValues.quantity,
//             totalAmount: itemsValues.totalAmount,
//             tax: itemsValues.tax,
//             colored: itemsValues.colored,
//           },
//           {
//             headers: headers,
//           }
//         );
//         break;
//       default:
//         await Api.patch(
//           `${collReq}/${item._id}`,
//           { name: itemsValues.name, number: itemsValues.number },
//           {
//             headers: headers,
//           }
//         );
//     }
//     setFetchingStatus((prev) => {
//       return {
//         ...prev,
//         status: false,
//         loading: false,
//         message: "העידכון בוצע בהצלחה",
//       };
//     });
//     setItemIsUpdated((prev) => !prev);
//     setTimeout(() => {
//       setFetchingStatus((prev) => {
//         return { ...prev, status: false, loading: false, message: null };
//       });
//     }, 1000);
//   };
//   const updateData = async () => {
//     try {
//       await sendRequest(getAccessToken());
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         try {
//           const newAccessToken = await refreshMyToken();
//           try {
//             await sendRequest(newAccessToken);
//           } catch (e) {
//             throw e;
//           }
//         } catch (refreshError) {
//           setFetchingStatus((prev) => {
//             return {
//               ...prev,
//               status: false,
//               loading: false,
//             };
//           });
//           clearTokens();

//           navigate("/homepage");
//         }
//       } else {
//         clearTokens();

//         setFetchingStatus((prev) => {
//           return {
//             ...prev,
//             status: false,
//             loading: false,
//             message: ".. תקלה בעדכון המוצר",
//           };
//         });
//         setTimeout(() => {
//           setFetchingStatus((prev) => {
//             return {
//               ...prev,
//               status: false,
//               loading: false,
//               message: null,
//             };
//           });
//           navigate("/homepage");
//         }, 1000);
//       }
//     }
//   };

//   const editHandler = (e) => {
//     e.preventDefault();

//     if (changeStatus.editText === "אישור") {
//       const haveAnEmptyValues = checkInputsValues();
//       if (haveAnEmptyValues) {
//         setFetchingStatus((prev) => {
//           return {
//             ...prev,
//             status: true,
//             error: true,
//             message: "צריך למלא את כל הנתונים",
//           };
//         });
//         return;
//       }
//       const isChanged = isInputsChanged();

//       isChanged && updateData();
//       setFetchingStatus((prev) => {
//         return { ...prev, status: false, message: null };
//       });
//     }

//     setItemInChange(!itemInChange);
//     setChangeStatus((prev) => {
//       return {
//         editText: prev.editText === "עריכה" ? "אישור" : "עריכה",
//         delete: prev.editText === "עריכה" ? "ביטול" : "מחיקה",
//         disabled: prev.editText === "עריכה" ? false : true,
//         itemId: prev.editText === "עריכה" ? item._id : null,
//       };
//     });
//   };

//   return (
//     <button
//       style={{
//         width: collReq === "/sales" ? "7%" : "11%",
//         visibility:
//           !itemInChange || changeStatus.itemId === item._id
//             ? "visible"
//             : "hidden",
//       }}
//       className="edit_btn"
//       onClick={editHandler}
//     >
//       {changeStatus.editText}
//     </button>
//   );
// }

import React, { useContext } from "react";
import "./EditItem.css";
import { FetchingStatus } from "../../../utils/context";
import { Api } from "../../../utils/Api";
import { useNavigate } from "react-router";
import { refreshMyToken } from "../../../utils/setNewAccessToken";
import { clearTokens, getAccessToken } from "../../../utils/tokensStorage";
import { getCollectionProps } from "../../../utils/collectionProps";
import lodash from "lodash";

export default function EditItem({
  item,
  itemInChange,
  setItemInChange,
  changeStatus,
  setChangeStatus,
  itemsValues,
  setItemIsUpdated,
  collReq,
}) {
  const navigate = useNavigate();
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);

  // Check for empty values
  const checkInputsValues = () => {
    const thisProps = getCollectionProps(collReq);
    
    return Array.isArray(thisProps) && thisProps.some((key) => !`${itemsValues[key]}`?.length);
  };

  // // Compare products safely
  // const isSameProducts = () => {
  //   if (!itemsValues?.product || !item?.product) return false;
  //   return Object.entries(itemsValues.product).every(
  //     ([key, value]) => item.product[key] === value
  //   );
  // };

  // // Compare quantities safely
  // const isSameQuantities = () => {
  //   const updatedSale = itemsValues?.quantitiesOfProduct;
  //   const currentSale = item?.quantitiesOfProduct;
  //   if (!updatedSale || !currentSale) return false;
  //   return lodash.isEqual(updatedSale, currentSale);
  // };

  // Compare inputs to detect changes
  const isInputsChanged = () => {
    const relevantProps = {
      "/clients": ["clientName", "name", "quantity"],

      "/personalSales": [
        "date",
        "name",
        "number",
        "strains",
        "weightKind",
        "quantity",
        "colored",
        "totalAmount",
      ],
      "/personalProductExpenses": [
        "date",
        "name",
        "number",
        "quantity",
        "colored",
        "totalAmount",
      ],
      "/personalWorkers": [
        "date",
        "clientName",
        "name",
        "number",
        "colored",
        "totalAmount",
      ],
      "/sales": [
        "date",
        "clientName",
        "name",
        "number",
        "purpose",
        "strains",
        "quantity",
        "water",
        "colored",
        "totalAmount",
      ],
      "/expenses": [
        "date",
        "name",
        "number",
        "quantity",
        "totalAmount",
        "tax",
        "colored",
      ],
    }[collReq] || ["number", "name"]; // Fallback for unknown collection types

    return relevantProps.some((key) => itemsValues[key] !== item[key]);
  };

  // Send API request
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    try{
    const payload = {
      clientName: itemsValues.clientName?.trim(),
      name: itemsValues.name?.trim(),
      number: itemsValues.number,
      quantity: itemsValues.quantity,
      date: itemsValues.date,
      purpose: itemsValues.purpose,
      weightKind : itemsValues.weightKind,
      strains: itemsValues.strains,
      water: itemsValues.water,
      other: itemsValues.other,
      colored: itemsValues.colored,
      totalAmount: itemsValues.totalAmount,
      tax: itemsValues.tax,
      quantitiesOfProduct: itemsValues.quantitiesOfProduct,
      product: itemsValues.product,
    };

    await Api.patch(`${collReq}/${item._id}`, payload, { headers });
    setFetchingStatus({
      status: false,
      loading: false,
      message: "העדכון בוצע בהצלחה",
    });
    setItemIsUpdated((prev) => !prev);
    setTimeout(() => setFetchingStatus((prev) => ({ ...prev, message: null })), 1000);
  }catch(e) {
    setFetchingStatus({
      status: false,
      loading: false,
      message: "תקלה בביצוע העדכון",
    });
    setItemIsUpdated((prev) => !prev);
    setTimeout(() => setFetchingStatus((prev) => ({ ...prev, message: null })), 1000);

  }
  };

  // Update the data with token refresh handling
  const updateData = async () => {
    try {
      await sendRequest(getAccessToken());
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          await sendRequest(newAccessToken);
        } catch {
          clearTokens();
          navigate("/homepage");
        }
      } else {
        clearTokens();
        setFetchingStatus({
          status: false,
          loading: false,
          message: ".. תקלה בעדכון המוצר",
        });
        setTimeout(() => navigate("/homepage"), 1000);
      }
    }
  };

  // Handle edit button click
  const editHandler = (e) => {
    e.preventDefault();

    if (changeStatus.editText === "אישור") {
      if (checkInputsValues()) {
        setFetchingStatus({
          status: true,
          error: true,
          message: "צריך למלא את כל הנתונים",
        });
        return;
      }

      if (isInputsChanged()) updateData();
    }

    setItemInChange(!itemInChange);
    setChangeStatus((prev) => ({
      editText: prev.editText === "עריכה" ? "אישור" : "עריכה",
      delete: prev.editText === "עריכה" ? "ביטול" : "מחיקה",
      disabled: prev.editText !== "עריכה",
      itemId: prev.editText === "עריכה" ? item._id : null,
    }));
  };

  return (
    <button
      style={{
        width: collReq === "/sales" ? "7%" : "11%",
        visibility:
          !itemInChange || changeStatus.itemId === item._id
            ? "visible"
            : "hidden",
      }}
      className="edit_btn"
      onClick={editHandler}
    >
      {changeStatus.editText}
    </button>
  );
}
