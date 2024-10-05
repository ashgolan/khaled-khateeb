import { PersonalRkrExpenses } from "../../models/personal/personalRkrExpenses.model.js";

export const personalRkrExpenses = {
  getAllRkrExpenses: async (req, res) => {
    try {
      const rkrExpenses = await PersonalRkrExpenses.find();
      if (!rkrExpenses) throw Error("productsExpenses not found");
      res.send(rkrExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
  getRkrExpense: async (req, res) => {
    const id = req.params.id;
    try {
      const rkrExpense = await PersonalRkrExpenses.findById({
        _id: id,
      });
      if (!rkrExpense) throw Error("sale not found");
      res.send(rkrExpense);
    } catch (e) {
      res.send(e.message);
    }
  },

  createRkrExpense: async (req, res) => {
    try {
      const rkrExpense = await PersonalRkrExpenses.create(req.body);
      if (!rkrExpense) throw Error("bad data was inserted!");
      res.send(rkrExpense);
    } catch (e) {
      res.send(e.message);
    }
  },
  deleteRkrExpense: async (req, res) => {
    try {
      const rkrExpense = await PersonalRkrExpenses.findByIdAndDelete({
        _id: req.params.id,
      });
      if (!rkrExpense) throw Error("bad data was inserted!");
      res.send(rkrExpense);
    } catch (e) {
      res.send(e.message);
    }
  },

  updateProductsExpenses: async (req, res) => {
    try {
      const rkrExpense = await PersonalRkrExpenses.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (!rkrExpense) throw Error("bad data was inserted!");
      res.send(rkrExpense);
    } catch (e) {
      res.send(e.message);
    }
  },
};
