import { Workers } from "../../models/personal/personalWorkers.model.js";

export const personalWorkers = {
  getAllPersonalWorkers: async (req, res) => {
    try {
      const personalWorkers = await Workers.find();
      if (!personalWorkers) throw Error("productsExpenses not found");
      res.send(personalWorkers);
    } catch (e) {
      res.send(e.message);
    }
  },
  getPersonalWorkers: async (req, res) => {
    const id = req.params.id;
    try {
      const personalWorkers = await Workers.findById({
        _id: id,
      });
      if (!personalWorkers) throw Error("sale not found");
      res.send(personalWorkers);
    } catch (e) {
      res.send(e.message);
    }
  },

  createPersonalWorkers: async (req, res) => {
    try {
      const personalWorkers = await Workers.create(req.body);
      if (!personalWorkers) throw Error("bad data was inserted!");
      res.send(personalWorkers);
    } catch (e) {
      res.send(e.message);
    }
  },
  deletePersonalWorkers: async (req, res) => {
    try {
      const personalWorkers = await Workers.findByIdAndDelete({
        _id: req.params.id,
      });
      if (!personalWorkers) throw Error("bad data was inserted!");
      res.send(personalWorkers);
    } catch (e) {
      res.send(e.message);
    }
  },

  updatePersonalWorkers: async (req, res) => {
    try {
      const personalWorkers = await Workers.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (!personalWorkers) throw Error("bad data was inserted!");
      res.send(personalWorkers);
    } catch (e) {
      res.send(e.message);
    }
  },
};
