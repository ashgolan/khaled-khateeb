import React from "react";
import { useState, useContext } from "react";
import AddItem from "./Add_Item/AddItem";
import AddItemBtn from "./Add_Item/AddItemBtn";
import ItemsTable from "./Items_Table/ItemsTable";
import { FetchingStatus } from "../../utils/context";
import "./SetupPage.css";
import { useEffect } from "react";

import { useNavigate } from "react-router";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";

export default function SetupPage({
  collReq,
  report,
  updatedReport,
  isFetching,
  fetchingData,
}) {
  const date = new Date();
  const year = date.getFullYear();

  const navigate = useNavigate();
  // eslint-disable-next-line
  const [fetchedData, setFetchingData] = useState([]);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [itemInChange, setItemInChange] = useState(false);
  const [itemIsUpdated, setItemIsUpdated] = useState(false);
  const [addItemToggle, setaddItemToggle] = useState({
    btnVisible: true,
    formVisible: false,
  });
  const [kindOfSort, setKindOfSort] = useState("date");
  const [clients, setClients] = useState([]);
  const getTotals = () => {
    let total = 0;
    if (collReq === "/clients") {
      filterByReport(sortedInventory(kindOfSort)).forEach((element) => {
        total += element.quantity;
      });
    } else {
      filterByReport(sortedInventory(kindOfSort)).forEach((element) => {
        total += element.totalAmount;
      });
    }
    return total;
  };
  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });

    if (isFetching) {
      if (collReq === "/sales") {
        setFetchingData(fetchingData.salesData);
      } else if (collReq === "/expenses") {
        setFetchingData(fetchingData.expensesData);
      } else {
        setFetchingData(fetchingData.clientsData);
      }
    } else {
      const { data } = await Api.get(collReq, { headers });
      if (collReq === "/sales") {
        const { data: clientsData } = await Api.get("/clients", { headers });
        setClients(clientsData);
      }
      if (report === undefined) {
        if (collReq === "/sales" || collReq === "/expenses") {
          setFetchingData(
            data.filter(
              (item) =>
                new Date(item.date).getFullYear() === year ||
                item.colored === true
            )
          );
        } else {
          setFetchingData(data);
        }
      } else {
        setFetchingData(data);
      }
    }
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await sendRequest(getAccessToken());
      } catch (error) {
        if (error.response && error.response.status === 401) {
          try {
            const newAccessToken = await refreshMyToken();
            try {
              await sendRequest(newAccessToken);
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
              message: ".. תקלה ביבוא הנתונים",
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
    fetchData();
  }, [itemIsUpdated, updatedReport]);

  const filterByReport = (sortedData) => {
    if (!report?.type) return sortedData;
    if (report?.month && report.year) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            month == report?.month &&
            new Date(item.date).getFullYear() === report?.year &&
            item.clientName === report.clientName
          );
        return (
          month == report?.month &&
          new Date(item.date).getFullYear() === report?.year
        );
      });
    } else if (report?.month) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            month == report?.month && item.clientName === report.clientName
          );
        return month == report?.month;
      });
    } else {
      if (report?.clientName)
        return sortedData.filter(
          (item) =>
            new Date(item.date).getFullYear() === report?.year &&
            report?.clientName === item.clientName
        );
      else
        return sortedData.filter(
          (item) => new Date(item.date).getFullYear() === report?.year
        );
    }
  };
  const sortedInventory = (kindOfSort) => {
    switch (kindOfSort) {
      case "number":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.number) - parseFloat(b.number)
        );
      case "clientName":
        return fetchedData?.sort((a, b) =>
          a.clientName > b.clientName ? 1 : -1
        );
      case "totalAmount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "quantity":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
        );
      case "water":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.water) - parseFloat(b.water)
        );
      case "name":
        return fetchedData?.sort((a, b) => (a.name > b.name ? 1 : -1));
      case "product":
        return fetchedData?.sort((a, b) => (a.product > b.product ? 1 : -1));
      case "purpose":
        return fetchedData?.sort((a, b) => (a.purpose > b.purpose ? 1 : -1));
      case "strains":
        return fetchedData?.sort((a, b) => (a.strains > b.strains ? 1 : -1));
      case "tax":
        return fetchedData?.sort((a, b) => (a.tax > b.tax ? 1 : -1));
      case "date":
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
      default:
        return fetchedData?.sort((a, b) => (a.date > b.date ? 1 : -1));
    }
  };

  return (
    <div className="inventory-container">
      {getTotals() > 0 && (
        <label
          htmlFor=""
          style={{
            width: "30%",
            margin: "auto",
            textAlign: "center",
            fontWeight: "bold",
            color: "brown",
            borderBottom: "2px solid orange",
          }}
        >
          {"  "}
          {collReq === "/clients"
            ? "כמות דונומים בטיפול :"
            : `סכום כל התנועות : `}
          {getTotals().toFixed(2)}
          {collReq === "/clients" ? " דונם " : ` ש"ח `}
        </label>
      )}
      <form
        className="Item_form"
        style={{
          width: collReq === "/clients" ? "60%" : "95%",
        }}
      >
        {(collReq === "/expenses" || collReq === "/sales") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: report?.type ? "17%" : "11%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "date");
            }}
          >
            תאריך
          </button>
        )}
        {(collReq === "/sales" || collReq === "/clients") && (
          <button
            id="clientName"
            className="input_show_item head"
            style={{
              width: collReq === "/clients" ? "25%" : "13%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "clientName");
            }}
          >
            {"קליינט"}
          </button>
        )}

        {(collReq === "/clients" ||
          collReq === "/expenses" ||
          collReq === "/sales") && (
          <button
            id="name"
            className="input_show_item head"
            style={{
              maxWidth:
                collReq === "/clients"
                  ? "42%"
                  : collReq === "/sales" || collReq === "/expenses"
                  ? "13%"
                  : report?.type
                  ? "45%"
                  : "18%",
              minWidth:
                collReq === "/clients"
                  ? "42%"
                  : collReq === "/sales" || collReq === "/expenses"
                  ? "13%"
                  : report?.type
                  ? "45%"
                  : "18%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "name");
            }}
          >
            {collReq === "/expenses"
              ? "שם החומר"
              : collReq === "/clients" || collReq === "/sales"
              ? "מטע"
              : "מוצר"}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="purpose"
            className="input_show_item head"
            style={{
              width: "10%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "purpose");
            }}
          >
            מטרה
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="strains"
            className="input_show_item head"
            style={{
              width: "7%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "strains");
            }}
          >
            זנים
          </button>
        )}
        {collReq !== "/clients" && (
          <button
            id="number"
            className="input_show_item head"
            style={{
              width:
                collReq === "/sales"
                  ? "6%"
                  : collReq === "/expenses"
                  ? "10%"
                  : "15%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "number");
            }}
          >
            מחיר
          </button>
        )}

        {(collReq === "/clients" ||
          collReq === "/sales" ||
          collReq === "/expenses") && (
          <button
            id="quantity"
            className="input_show_item head"
            style={{ width: "7%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "quantity");
            }}
          >
            {collReq === "/sales" ? "שטח" : "כמות"}
          </button>
        )}

        {collReq === "/sales" && (
          <button
            id="product"
            className="input_show_item head"
            style={{ width: "10%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "product");
            }}
          >
            חומר{" "}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="water"
            className="input_show_item head"
            style={{ width: "7%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "water");
            }}
          >
            מים
          </button>
        )}

        {(collReq === "/expenses" || collReq === "/sales") && (
          <button
            id="totalAmount"
            className="input_show_item head"
            style={{
              width: "6%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "totalAmount");
            }}
          >
            סה"כ
          </button>
        )}

        {/* <button
            id="tax"
            className="input_show_item head"
            style={{ width: "7%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "tax");
            }}
          >
            {collReq === "/sales" || collReq === "/expenses"
              ? "שולם"
              : report?.type
              ? "חשב."
              : "חשבונית"}
          </button> */}

        {!report?.type && (
          <button
            style={{
              visibility: "hidden",
              width: collReq === "/sales" ? "7%" : "11%",
            }}
            className="edit_btn"
          >
            edit
          </button>
        )}
        {!report?.type && (
          <button
            style={{
              visibility: "hidden",
              width: collReq === "/sales" ? "7%" : "11%",
            }}
            className="delete_btn"
          >
            delete
          </button>
        )}
      </form>

      {(!fetchingStatus.loading || fetchedData.length > 0) &&
        filterByReport(sortedInventory(kindOfSort)).map((item) => {
          return (
            <ItemsTable
              key={`item${item._id}`}
              item={item}
              itemInChange={itemInChange}
              setItemInChange={setItemInChange}
              myData={fetchedData}
              setItemIsUpdated={setItemIsUpdated}
              collReq={collReq}
              selectData={clients}
              report={report}
            />
          );
        })}
      {!addItemToggle.formVisible &&
        !report?.type &&
        !fetchingStatus.loading && (
          <AddItemBtn setaddItemToggle={setaddItemToggle}></AddItemBtn>
        )}
      {!addItemToggle.btnVisible && !report?.type && (
        <AddItem
          setaddItemToggle={setaddItemToggle}
          setInventoryData={setFetchingData}
          setItemIsUpdated={setItemIsUpdated}
          collReq={collReq}
          selectData={clients}
        ></AddItem>
      )}
    </div>
  );
}
