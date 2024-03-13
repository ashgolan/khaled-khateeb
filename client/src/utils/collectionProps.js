export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/clients":
      return ["name", "landName", "quantity"];
    case "/expenses":
      return ["name", "number", "date", "quantity", "totalAmount"];
    case "/sales":
      return [
        "date",
        "clientName",
        "number",
        "purpose",
        "landName",
        "straints",
        "quantity",
        "water",
        "colored",
        "paid",
        "totalAmount",
      ];
    default:
      return false;
  }
};
