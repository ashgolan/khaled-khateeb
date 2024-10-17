import { PersonalProductExpenses } from "../../models/personal/personalProductsExpenses.model.js";

export const personalProductsExpenses = {
  getAllPersonalProductsExpenses: async (req, res) => {
    try {
      const personalProductsExpenses = await PersonalProductExpenses.find();
      if (!personalProductsExpenses) throw Error("personalProductsExpenses not found");
      res.send(personalProductsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
  getPersonalProductsExpenses: async (req, res) => {
    const id = req.params.id;
    try {
      const personalProductsExpenses = await PersonalProductExpenses.findById({
        _id: id,
      });
      if (!personalProductsExpenses) throw Error("sale not found");
      res.send(personalProductsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },

  createPersonalProductsExpenses: async (req, res) => {
    try {
      const personalProductsExpenses = await PersonalProductExpenses.create({
        ...req.body,
      });
      if (!personalProductsExpenses) throw Error("bad data was inserted!");
      res.send(personalProductsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
  deletePersonalProductsExpenses: async (req, res) => {
    try {
      const personalProductsExpenses = await PersonalProductExpenses.findByIdAndDelete({
        _id: req.params.id,
      });
      if (!personalProductsExpenses) throw Error("bad data was inserted!");
      res.send(personalProductsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },

  updatePersonalProductsExpenses: async (req, res) => {
    try {
      const personalProductsExpenses = await PersonalProductExpenses.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (!personalProductsExpenses) throw Error("bad data was inserted!");
      res.send(personalProductsExpenses);
    } catch (e) {
      res.send(e.message);
    }
  },
};
