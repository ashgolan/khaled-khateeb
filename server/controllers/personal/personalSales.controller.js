import { PersonalSale } from "../../models/personal/personalSales.model.js";

export const personalSales = {
  getAllPersonalSales: async (req, res) => {
    try {
      const personalSales = await PersonalSale.find();
      if (!personalSales) throw Error("personalSales not found");
      res.send(personalSales);
    } catch (e) {
      res.send(e.message);
    }
  },
  getPersonalSales: async (req, res) => {
    const id = req.params.id;
    try {
      const personalSales = await PersonalSale.findById({
        _id: id,
      });
      if (!personalSales) throw Error("sale not found");
      res.send(personalSales);
    } catch (e) {
      res.send(e.message);
    }
  },

  createPersonalSales: async (req, res) => {
    try {
      const personalSales = await PersonalSale.create(req.body);
      if (!personalSales) throw Error("bad data was inserted!");
      res.send(personalSales);
    } catch (e) {
      res.send(e.message);
    }
  },
  deletePersonalSales: async (req, res) => {
    try {
      const personalSales = await PersonalSale.findByIdAndDelete({
        _id: req.params.id,
      });
      if (!personalSales) throw Error("bad data was inserted!");
      res.send(personalSales);
    } catch (e) {
      res.send(e.message);
    }
  },

  updatePersonalSales: async (req, res) => {
    try {
      const personalSales = await PersonalSale.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (!personalSales) throw Error("bad data was inserted!");
      res.send(personalSales);
    } catch (e) {
      res.send(e.message);
    }
  },
};
