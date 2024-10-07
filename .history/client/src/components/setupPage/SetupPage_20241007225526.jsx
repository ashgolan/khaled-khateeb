import React, { useRef } from "react";
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
  const [defaultTractorPrice, setDefaultTractorPrice] = useState([]);
  const [kindOfSort, setKindOfSort] = useState("date");
  const [clients, setClients] = useState([]);

  const [personalProductExpenses, setPersonalProductExpenses] = useState([]);
  const [personalSales, setPersonalSales] = useState([]);
  const [personalRkrExpenses, setPersonalRkrExpenses] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [personalWorkers, setPersonalWorkers] = useState([]);
  const [tractorPriceChangeDisplay, settractorPriceChangeDisplay] =
    useState(false);
  const [tractorPrice, setTractorPrice] = useState(0);
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
        const { data: tractorPriceData } = await Api.get("/tractorPrice", {
          headers,
        });
        setTractorPrice(tractorPriceData[0]?.price);

        setDefaultTractorPrice(tractorPriceData);
        setFetchingData(fetchingData.salesData);
      } else if (collReq === "/personalSales") {
        setFetchingData(fetchingData.personalSalesData);
      } else if (collReq === "/personalRkrExpenses") {
        setFetchingData(fetchingData.personalRkrExpensesData);
      } else if (collReq === "/personalProductExpenses") {
        setFetchingData(fetchingData.personalProductExpensesData);
      } else if (collReq === "/expenses") {
        setFetchingData(fetchingData.expensesData);
      } else if (collReq === "/personalWorkers") {
        setFetchingData(fetchingData.personalWorkersData);
      } else {
        setFetchingData(fetchingData.clientsData);
      }
    } else {
      const { data } = await Api.get(collReq, { headers });

      if (collReq === "/personalProductExpenses") {
        const { data: personalProductsExpensesData } = await Api.get(
          "/personalProductExpenses",
          { headers }
        );

        setPersonalProductExpenses(personalProductsExpensesData);
      }
      if (collReq === "/personalWorkers") {
        const { data: personalWorkersData } = await Api.get(
          "/personalWorkers",
          { headers }
        );
        setPersonalWorkers(personalWorkersData);
      }
      if (collReq === "/personalSales") {
        const { data: personalSalesData } = await Api.get("/personalSales", {
          headers,
        });
        setPersonalSales(personalSalesData);
      }
      if (collReq === "/personalRkrExpenses") {
        const { data: personalRkrExpensesData } = await Api.get(
          "/personalRkrExpenses",
          {
            headers,
          }
        );
        setPersonalRkrExpenses(personalRkrExpensesData);
        const { data: personalProductExpensesData } = await Api.get(
          "/personalProductExpenses",
          {
            headers,
          }
        );
        setPersonalProductExpenses(personalProductExpensesData);
      }
      if (collReq === "/sales") {
        const { data: clientsData } = await Api.get("/clients", {
          headers,
        });
        setClients(clientsData);
        const { data: expensesData } = await Api.get("/expenses", {
          headers,
        });
        setExpenses(expensesData);
        const { data: tractorPriceData } = await Api.get("/tractorPrice", {
          headers,
        });
        setTractorPrice(tractorPriceData[0]?.price);

        setDefaultTractorPrice(tractorPriceData);
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
    let monthNames = report?.month?.map((month) => month.value);
    if (!report?.type) return sortedData;
    if (report?.month?.length > 0 && report.year) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : new Date(item.date).getMonth() + 1;
        if (report?.clientName)
          return (
            monthNames.includes(month) &&
            new Date(item.date).getFullYear() === report?.year &&
            item.clientName === report.clientName
          );
        return (
          monthNames.includes(month) &&
          new Date(item.date).getFullYear() === report?.year
        );
      });
    } else if (report?.month?.length > 0) {
      return sortedData.filter((item) => {
        const month =
          new Date(item.date).getMonth() + 1 < 10
            ? `0${new Date(item.date).getMonth() + 1}`
            : `${new Date(item.date).getMonth() + 1}`;
        if (report?.clientName)
          return (
            monthNames.includes(month) && item.clientName === report.clientName
          );
        return monthNames.includes(month);
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

  const updateTractorPriceHandler = async () => {
    try {
      await updateRequest(getAccessToken());
    } catch (error) {
      if (error.response && error.response.status === 401) {
        try {
          const newAccessToken = await refreshMyToken();
          try {
            await updateRequest(newAccessToken);
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
            message: ".. תקלה בעדכון המוצר",
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

  const updateRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    await Api.patch(
      `${"/tractorPrice"}/${defaultTractorPrice[0]?._id}`,
      {
        price: tractorPrice.price,
      },
      {
        headers: headers,
      }
    );

    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
        message: "העידכון בוצע בהצלחה",
      };
    });
    settractorPriceChangeDisplay((prev) => !prev);
    setItemIsUpdated((prev) => !prev);
    setTimeout(() => {
      setFetchingStatus((prev) => {
        return { ...prev, status: false, loading: false, message: null };
      });
    }, 1000);
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
      case "weightKind":
        return fetchedData?.sort((a, b) =>
          a.weightKind > b.weightKind ? 1 : -1
        );
      case "totalAmount":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.totalAmount) - parseFloat(b.totalAmount)
        );
      case "quantity":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.quantity) - parseFloat(b.quantity)
        );
      case "letersOfProduct":
        return fetchedData?.sort(
          (a, b) =>
            parseFloat(a.letersOfProduct) - parseFloat(b.letersOfProduct)
        );
      case "water":
        return fetchedData?.sort(
          (a, b) => parseFloat(a.water) - parseFloat(b.water)
        );
      case "name":
        return fetchedData?.sort((a, b) => (a.name > b.name ? 1 : -1));
      case "weightKind":
        return fetchedData?.sort((a, b) =>
          a.weightKind > b.weightKind ? 1 : -1
        );
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
    <div
      className="inventory-container"
      style={{
        boxShadow:
          report?.type &&
          "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset",
        borderRadius: "1rem",
        paddingTop: "2%",
        paddingBottom: "2%",
      }}
    >
      {getTotals() > 0 && (
        <div
          style={{
            width: "60%",
            margin: "auto",
            textAlign: "center",
            fontWeight: "bold",
            color: "brown",
            borderBottom: "2px solid orange",
          }}
        >
          <i
            className="fa-solid fa-tractor"
            style={{
              marginRight: "2%",
              color: "brown",
              cursor: "pointer",
              fontSize: "2rem",
              display:
                collReq === "/sales" && report?.type === undefined
                  ? "inline-block"
                  : "none",
            }}
            onClick={() => settractorPriceChangeDisplay((prev) => !prev)}
          ></i>

          <label htmlFor="">
            {"  "}
            {collReq === "/clients"
              ? "כמות דונומים בטיפול :"
              : collReq === "/expenses"
              ? `סכום כל ההוצאות : `
              : `סכום כל העבודות : `}
            {!report?.type && getTotals().toFixed(2)}
            {!report?.type && collReq !== "/clients" && `  ש"ח לפני מע"מ `}
            {!report?.type && collReq === "/clients" && `  דונם `}
            {report?.type && (getTotals() + getTotals() * 0.17).toFixed(2)}{" "}
            {report?.type && `  ש"ח כולל מע"מ [ `}
            {report?.type && (
              <span style={{ fontSize: "0.8rem", color: "darkblue" }}>
                {getTotals().toFixed(2)}
                {`  ש"ח  `}
                {` + מע"מ 17% ( `}
                {(getTotals() * 0.17).toFixed(2)} {`  ש"ח )  `}
              </span>
            )}
            {report?.type && `] `}
          </label>
        </div>
      )}
      {tractorPriceChangeDisplay && (
        <div
          style={{
            width: "40%",
            margin: "auto",
            textAlign: "center",
            color: "green",
            borderBottom: "2px solid orange",
          }}
        >
          <button
            style={{
              border: "none",
              backgroundColor: "lightgreen",
              display:
                tractorPrice?.price === defaultTractorPrice[0]?.price
                  ? "none"
                  : "inline-block",
            }}
            onClick={updateTractorPriceHandler}
          >
            מאשר שינויים
          </button>
          {` ש"ח לדונם `}
          <input
            style={{
              border: "none",
              width: "5%",
              fontWeight: "bold",
              color: "rgb(1, 83, 104)",
            }}
            type="number"
            placeholder={defaultTractorPrice[0]?.price}
            value={tractorPrice?.price ? tractorPrice?.price : ""}
            onChange={(e) => {
              setTractorPrice((prev) => {
                return { ...prev, price: e.target.value };
              });
            }}
          />
          <label htmlFor="">
            {"  "}
            {" : מחיר עבודת הטרקטור"}
          </label>
          <i
            class="fa-solid fa-arrow-up"
            style={{ marginLeft: "2%", color: "gold", cursor: "pointer" }}
            onClick={() => {
              settractorPriceChangeDisplay((prev) => !prev);
              setTractorPrice((prev) => {
                return { ...prev, price: defaultTractorPrice[0].price };
              });
            }}
          ></i>
        </div>
      )}
      <form
        className="Item_form"
        style={{
          width: collReq === "/clients" ? "60%" : report?.type ? "100%" : "98%",
        }}
      >
        <label
          id="colored"
          className={"notInner"}
          style={{ visibility: "hidden" }}
        />
        {(collReq === "/expenses" ||
          collReq === "/sales" ||
          collReq === "/personalWorkers" ||
          collReq === "/personalRkrExpenses" ||
          collReq === "/personalSales" ||
          collReq === "/personalProductExpenses") && (
          <button
            id="date"
            className="input_show_item head"
            style={{ width: report?.type ? "15%" : "11%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "date");
            }}
          >
            תאריך
          </button>
        )}
        {(collReq === "/sales" ||
          collReq === "/clients" ||
          collReq === "/personalWorkers") && (
          <button
            id="clientName"
            className="input_show_item head"
            style={{
              width: collReq === "/clients" ? "25%" : "10%",
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
          collReq === "/personalWorkers" ||
          collReq === "/personalSales" ||
          collReq === "/personalRkrExpenses" ||
          collReq === "/personalProductExpenses" ||
          collReq === "/sales") && (
          <button
            id="name"
            className="input_show_item head"
            style={{
              maxWidth:
                collReq === "/clients" || collReq === "/expenses"
                  ? "32%"
                  : collReq === "/sales" ||
                    collReq === "/personalWorkers" ||
                    collReq === "/personalRkrExpenses" ||
                    collReq === "/personalSales" ||
                    collReq === "/personalProductExpenses"
                  ? "10%"
                  : report?.type
                  ? "55%"
                  : "18%",
              minWidth:
                collReq === "/clients" || collReq === "/expenses"
                  ? "32%"
                  : collReq === "/sales" ||
                    collReq === "/expenses" ||
                    collReq === "/personalRkrExpenses" ||
                    collReq === "/personalSales" ||
                    collReq === "/personalWorkers" ||
                    collReq === "/personalProductExpenses"
                  ? "10%"
                  : report?.type
                  ? "55%"
                  : "18%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "name");
            }}
          >
            {collReq === "/expenses"
              ? "שם החומר"
              : collReq === "/clients" ||
                collReq === "/personalRkrExpenses" ||
                collReq === "/sales" ||
                collReq === "/personalSales" ||
                collReq === "/personalWorkers"
              ? "מטע"
              : "מוצר"}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="purpose"
            className="input_show_item head"
            style={{
              width: report?.type ? "10%" : "8%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "purpose");
            }}
          >
            מטרה
          </button>
        )}
        {collReq === "/personalSales" && (
          <button
            id="weightKind"
            className="input_show_item head"
            style={{
              width: "7%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "weightKind");
            }}
          >
            משקל
          </button>
        )}
        {(collReq === "/sales" || collReq === "/personalSales") && (
          <button
            id="strains"
            className="input_show_item head"
            style={{
              width: "10%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "strains");
            }}
          >
            זנים
          </button>
        )}
        {(collReq === "/sales" || collReq === "/personalRkrExpenses") &&
          !report?.type && (
            <button
              id="product"
              className="input_show_item head"
              style={{
                width: "10%",
              }}
              onClick={(e) => {
                e.preventDefault();
                setKindOfSort(() => "product");
              }}
            >
              חומר{" "}
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
                  : collReq === "/expenses" || collReq === "/personalSales"
                  ? "10%"
                  : "15%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "number");
            }}
          >
            {collReq === "/personalWorkers"
              ? "יומית"
              : collReq === "/personalRkrExpenses"
              ? `סה"כ חומר`
              : "מחיר"}
          </button>
        )}

        {collReq === "/personalRkrExpenses" && (
          <button
            id="workPrice"
            className="input_show_item head"
            style={{ width: "5%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "workPrice");
            }}
          >
            {"עבודה"}
          </button>
        )}

        {(collReq === "/clients" ||
          collReq === "/sales" ||
          collReq === "/personalProductExpenses" ||
          collReq === "/personalSales" ||
          collReq === "/personalRkrExpenses" ||
          collReq === "/expenses") && (
          <button
            id="quantity"
            className="input_show_item head"
            style={{ width: collReq === "/clients" ? "15%" : "5%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "quantity");
            }}
          >
            {collReq === "/sales"
              ? "שטח"
              : collReq === "/personalRkrExpenses"
              ? "דונומים"
              : "כמות"}
          </button>
        )}
        {collReq === "/sales" && (
          <button
            id="letersOfProduct"
            className="input_show_item head"
            style={{ width: "5%" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "letersOfProduct");
            }}
          >
            {"כ.חומר"}
          </button>
        )}

        {collReq === "/sales" && (
          <button
            id="water"
            className="input_show_item head"
            style={{ width: "5%", textAlign: "center" }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "water");
            }}
          >
            מים
          </button>
        )}
        {collReq === "/personalRkrExpenses" && !report?.type && (
          <button
            id="other"
            className="input_show_item head"
            style={{
              width: "7%",
            }}
            onClick={(e) => {
              e.preventDefault();
              setKindOfSort(() => "other");
            }}
          >
            אחר{" "}
          </button>
        )}
        {(collReq === "/expenses" ||
          collReq === "/sales" ||
          collReq === "/personalSales" ||
          collReq === "/personalRkrExpenses" ||
          collReq === "/personalProductExpenses" ||
          collReq === "/personalWorkers") && (
          <button
            id="totalAmount"
            className="input_show_item head"
            style={{
              width:
                collReq === "/expenses" ? "8%" : report?.type ? "10%" : "7%",
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
              expenses={expenses}
              personalProductExpenses={personalProductExpenses}
              personalWorkers={personalWorkers}
              tractorPrice={+tractorPrice}
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
        personalProductExpenses={personalProductExpenses}
          setaddItemToggle={setaddItemToggle}
          setInventoryData={setFetchingData}
          setItemIsUpdated={setItemIsUpdated}
          collReq={collReq}
          selectData={clients}
          expenses={expenses}
          tractorPrice={+tractorPrice}
        ></AddItem>
      )}
    </div>
  );
}
