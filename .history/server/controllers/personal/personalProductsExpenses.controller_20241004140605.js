import { PersonalProductExpenses } from "../../models/personal/personalProductsExpenses.model.js";

export const productsExpenses = {
  getAllProductsExpenses: async (req, res) => {
    try {
      const productsExpenses = await PersonalProductExpenses.find();
      if (!productsExpenses) throw Error("productsExpenses not found");
      res.send(productsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
  getProductsExpenses: async (req, res) => {
    const id = req.params.id;
    try {
      const productsExpenses = await PersonalProductExpenses.findById({
        _id: id,
      });
      if (!productsExpenses) throw Error("sale not found");
      res.send(productsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },

  createProductsExpenses: async (req, res) => {
    try {
      const productsExpenses = await PersonalProductExpenses.create({
        ...req.body,
        totalAmount : 
      });
      if (!productsExpenses) throw Error("bad data was inserted!");
      res.send(productsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
  deleteProductsExpenses: async (req, res) => {
    try {
      const productsExpenses = await PersonalProductExpenses.findByIdAndDelete({
        _id: req.params.id,
      });
      if (!productsExpenses) throw Error("bad data was inserted!");
      res.send(productsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },

  updateProductsExpenses: async (req, res) => {
    try {
      const productsExpenses = await PersonalProductExpenses.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (!productsExpenses) throw Error("bad data was inserted!");
      res.send(productsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
};
