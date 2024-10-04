export const getCollectionProps = (collReq) => {
  switch (collReq) {
    case "/clients":
      return ["clientName", "name", "quantity"];
    case "/expenses":
      return ["name", "number", "date", "quantity", "totalAmount"];
    case "/personalSales":
      return ["name", "number", "date", "quantity", "totalAmount","strains", "weightKind","colored"];
    case "/sales":
      return [
        "date",
        "clientName",
        "number",
        "purpose",
        "landName",
        "strains",
        "quantity",
        "water",
        "product",
        "colored",
        "paid",
        "totalAmount",
      ];
    default:
      return false;
  }
};
