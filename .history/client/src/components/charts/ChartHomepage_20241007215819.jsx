import React, { useContext, useEffect, useState } from "react";
import "./chartHomepage.css";
import Select from "react-select";
import SetupPage from "../setupPage/SetupPage";
import ChartPage from "./ChartPage";
import { FetchingStatus } from "../../utils/context";
import { Api } from "../../utils/Api";
import { clearTokens, getAccessToken } from "../../utils/tokensStorage";
import { refreshMyToken } from "../../utils/setNewAccessToken";
import { useNavigate } from "react-router-dom";

function ChartHomepage() {
  const [report, setReport] = useState({
    typeName: "",
    type: "",
    clientName: "",
    month: [],
    year: "",
  });
  const [updatedReport, setUpdatedReport] = useState(false);
  const [updateChart, setUpdateChart] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [fetchingStatus, setFetchingStatus] = useContext(FetchingStatus);
  const [fetchingData, setFetchingData] = useState({});
  const navigate = useNavigate();
  const months = [
    { value: null, label: null },
    { value: "01", label: "ינואר" },
    { value: "02", label: "פברואר" },
    { value: "03", label: "מרץ" },
    { value: "04", label: "אפריל" },
    { value: "05", label: "מאי" },
    { value: "06", label: "יוני" },
    { value: "07", label: "יולי" },
    { value: "08", label: "אוגוסט" },
    { value: "09", label: "ספטמבר" },
    { value: "10", label: "אוקטובר" },
    { value: "11", label: "נובמבר" },
    { value: "12", label: "דיצמבר" },
  ];
  const allMonths = months.map((item) => {
    return { value: item.value, label: item.label };
  });
  let yearArray = [];
  for (let i = 2020; i <= new Date().getFullYear(); i++) {
    if (i === 2020) yearArray.push(null);
    yearArray.push(i);
  }
  const allYears = yearArray.sort().map((year) => {
    return {
      value: year === 2020 ? null : year,
      label: year === 2020 ? null : year,
    };
  });
  const allReportsTypes = [
    { type: "/expenses", name: "דוח הוצאות" },
    { type: "/sales", name: "דוח הכנסות" },
    { type: "/personalProductExpenses", name: "דוח הוצאת חומרים" },
    { type: "/personalSales", name: "דוח הכנסות פרטי" },
    { type: "/personalWorkers", name: "דוח עובדים פרטי" },
    { type: "/personalRkrExpenses", name: "דוח ריסוס קיסוח ריסוק פרטי" },

  ].map((item) => {
    return { value: item.type, label: item.name };
  });
  const allChartsTypes = [
    { type: "expensesCharts", name: "תרשים הוצאות" },
    { type: "salesCharts", name: "תרשים הכנסות" },
    { type: "personalProductExpensesCharts", name: " תרשים הוצאות חומרים פרטי" },
    { type: "personalSalesCharts", name: "תרשים הכנסות פרטי" },
    { type: "personalWorkersCharts", name: "תרשים עובדים פרטי" },
    { type: "personalRkrExpensesCharts", name: "תרשים ריסוס קיסוח ריסוק פרטי" },
  ].map((item) => {
    return { value: item.type, label: item.name };
  });
  const customStyles = {
    control: (base) => ({
      ...base,
      textAlign: "center",
    }),
    placeholder: (provided) => ({
      ...provided,
    }),
    menu: (base) => ({
      ...base,
      textAlign: "center",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "gold" : "whitesmoke",
      color: state.isFocused ? "brown" : "black",
    }),
    singleValue: (styles, state) => {
      return {
        ...styles,
        color: state.isSelected ? "brown" : "black",
      };
    },
  };
  const downloadToPdf = async () => {
    const month = report.month ? report.month : "";
    document.title = report?.typeName + "-" + month + "-" + report.year;
    window.print();
  };

  const [selectedReportType, setSelectedReportType] = useState(null);
  const [selectedChartType, setSelectedChartType] = useState(null);

  const handleReportTypeChange = (e) => {
    setSelectedReportType(e);  // Set the selected value for report
    setSelectedChartType(null); // Reset the chart select value
    setUpdatedReport((prev) => !prev);
    setReport((prev) => ({
      ...prev,
      typeName: e.label,
      clientName: null,
      type: e.value,
      month: null,
      year: null,
    }));
    setUpdateChart((prev) => !prev);
    setShowChart(false);
  };

  const handleChartTypeChange = (e) => {
    setSelectedChartType(e);  // Set the selected value for chart
    setSelectedReportType(null); // Reset the report select value
    setUpdatedReport((prev) => !prev);
    setReport((prev) => ({
      ...prev,
      typeName: e.label,
      clientName: null,
      type: e.value,
      month: null,
      year: null,
    }));
    setUpdateChart((prev) => !prev);
    setShowChart(false);
  };


  const sendRequest = async (token) => {
    const headers = { Authorization: token };
    setFetchingStatus((prev) => {
      return { ...prev, status: true, loading: true };
    });
    const [
      salesData, 
      expensesData, 
      personalProductExpensesData, 
      personalSalesData, 
      personalWorkersData, 
      personalRkrExpensesData
  ] = await Promise.all([
      Api.get("/sales", { headers }),
      Api.get("/expenses", { headers }),
      Api.get("/personalProductExpenses", { headers }),
      Api.get("/personalSales", { headers }),
      Api.get("/personalWorkers", { headers }),
      Api.get("/personalRkrExpenses", { headers }),
  ]).then(responses => responses.map(res => res.data));
    setFetchingStatus((prev) => {
      return {
        ...prev,
        status: false,
        loading: false,
      };
    });
    setFetchingData({
      salesData: salesData,
      expensesData: expensesData,
      personalProductExpensesData: personalProductExpensesData,
      personalSalesData: personalSalesData,
      personalWorkersData: personalWorkersData,
      personalRkrExpensesData: personalRkrExpensesData,
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
  }, []);
  const ids = fetchingData?.salesData?.map(({ clientName }) => clientName);
  const filtered = fetchingData?.salesData?.filter(
    ({ clientName }, index) => !ids.includes(clientName, index + 1)
  );

  const allSelectData = filtered?.map((item) => {
    return { value: item._id, label: item.clientName };
  });
  allSelectData?.unshift({ value: null, label: null });
  return (
    <>
      <div id={"pdfOrder"}>
        {(fetchingData?.salesData?.length > 0 ||
          fetchingData?.expensesData?.length > 0) && (
          <div className="charts-title">
            <Select
              className="select-chart"
              options={allReportsTypes}
              placeholder="בחר סוג דוח"
              onChange={
                (e) => {
                  handleReportTypeChange()
                // setUpdatedReport((prev) => !prev);
                // setReport((prev) => {
                //   return {
                //     ...prev,
                //     typeName: e.label,
                //     clientName: null,
                //     type: e.value,
                //     month: null,
                //     year: null,
                //   };
                // });
                // setUpdateChart((prev) => !prev);
                // setShowChart(false);
              }}
              styles={customStyles}
            ></Select>
            <Select
              className="select-chart"
              options={allChartsTypes}
              placeholder="בחר סוג דוח"
              onChange={(e) => {
                // setUpdatedReport((prev) => !prev);
                // setReport((prev) => {
                //   return {
                //     ...prev,
                //     typeName: e.label,
                //     clientName: null,
                //     type: e.value,
                //     month: null,
                //     year: null,
                //   };
                // });
                // setUpdateChart((prev) => !prev);
                // setShowChart(false);
              }}
              styles={customStyles}
            ></Select>
            {report.type && (
              <Select
                options={allYears.filter((option) => option.value !== null)}
                placeholder="בחר שנה"
                onChange={(selectedOption) => {
                  setReport((prev) => {
                    setUpdatedReport((prev) => !prev);
                    return {
                      ...prev,
                      month: [],
                      year: selectedOption ? selectedOption.value : null,
                    };
                  });
                  setUpdateChart((prev) => !prev);
                  setShowChart(false);
                }}
                value={
                  report.year !== null
                    ? allYears?.find((option) => option.value === report.year)
                    : null
                }
                isClearable={true}
                styles={customStyles}
              ></Select>
            )}
            {report.type && report.year && (
              <Select
                options={allMonths.filter((option) => option.value !== null)}
                placeholder="בחר חודש"
                onChange={(selectedOption) => {
                  setReport((prev) => {
                    setUpdatedReport((prev) => !prev);
                    return {
                      ...prev,
                      month: selectedOption,
                    };
                  });
                  setUpdateChart((prev) => !prev);
                  setShowChart(false);
                }}
                styles={customStyles}
                isMulti={
                  report.type === "expensesCharts" ||
                  report.type === "salesCharts"
                    ? false
                    : true
                }
                value={report?.month || []}
                isClearable={true}
              ></Select>
            )}
            {(report?.type === "/sales" || report?.type === "salesCharts") && (
              <Select
                options={allSelectData?.filter(
                  (option) => option.value !== null
                )}
                placeholder="בחר קליינט"
                onChange={(selectedOption) => {
                  setReport((prev) => {
                    setUpdatedReport((prev) => !prev);
                    return {
                      ...prev,
                      clientName: selectedOption ? selectedOption.label : null,
                    };
                  });
                  setUpdateChart((prev) => !prev);
                  setShowChart(false);
                }}
                value={
                  report.clientName !== null
                    ? allSelectData?.find(
                        (option) => option.value === report.clientName
                      )
                    : null
                }
                isClearable={true}
                styles={customStyles}
              ></Select>
            )}
            {report.type && report.year && (
              <div className="downloadPdf">
                <img
                  style={{ width: "70%" }}
                  src="/downloadPdf.png"
                  alt=""
                  onClick={downloadToPdf}
                />
              </div>
            )}
          </div>
        )}
        {report.type &&
          (report.type === "/expenses" ||
            report.type === "/sales" ||
            report.type === "/personalSales" ||
            report.type === "/personalProductExpenses" ||
            report.type === "/personalWorkers" ||
            report.type === "/personalRkrExpenses" ||
            report.type === "/salesByClient") && (
            <SetupPage
              updatedReport={updatedReport}
              collReq={report.type}
              fetchingData={fetchingData}
              isFetching={true}
              report={report}
            ></SetupPage>
          )}
        {report.type &&
          report.year &&
          (report.type === "expensesCharts" ||
            report.type === "personalSalesCharts" ||
            report.type === "personalProductExpensesCharts" ||
            report.type === "personalWorkersCharts" ||
            report.type === "personalRkrExpensesCharts" ||
            report.type === "salesCharts") && (
            <ChartPage
              fetchingData={fetchingData}
              showChart={showChart}
              setShowChart={setShowChart}
              updateChart={updateChart}
              report={report}
            ></ChartPage>
          )}
      </div>
    </>
  );
}

export default ChartHomepage;
