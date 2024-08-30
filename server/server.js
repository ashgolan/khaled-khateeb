import Express from "express";
import cors from "cors";
import "./DB/mongoose.js";
import * as url from "url";
import path from "path";
import { saleRouter } from "./routers/sale.router.js";
import { userRouter } from "./routers/user.router.js";
import { expenseRouter } from "./routers/expense.router.js";
import { eventsRouter } from "./routers/events.router.js";
import { clientRouter } from "./routers/client.router.js";
import { bidRouter } from "./routers/bid.router.js";
import { tractorPriceRouter } from "./routers/tractorPrice.router.js";
import { personalSalesRouter } from "./routers/personal/personalSales.router.js";
import { personalWorkersRouter } from "./routers/personal/personalWorkers.router.js";
import { personalRkrRouter } from "./routers/personal/personalRkr.router.js";
import { personalProductExpensesRouter } from "./routers/personal/personalProductExpenses.router.js";
import { personalTractorPriceRouter } from "./routers/personal/personalTractorPrice.router.js";

const app = Express();
const __dirname = url.fileURLToPath(new URL("./", import.meta.url));
const publicPath = path.join(__dirname, "build");
app.use(Express.static("public"));

app.use(Express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.use(Express.json());
app.use(cors());
app.use("/users", userRouter);
app.use("/clients", clientRouter);
app.use("/sales", saleRouter);
app.use("/expenses", expenseRouter);
app.use("/events", eventsRouter);
app.use("/bids", bidRouter);
app.use("/tractorPrice", tractorPriceRouter);
app.use("/personalSales", personalSalesRouter);
app.use("/personalWorkers", personalWorkersRouter);
app.use("/personalRkrExpenses", personalRkrRouter);
app.use("/personalProductExpenses", personalProductExpensesRouter);
app.use("/personalTractorPrice", personalTractorPriceRouter);
app.listen(PORT, () => {
  console.log("connecting to port", PORT);
});
