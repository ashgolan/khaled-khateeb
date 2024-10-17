import { PersonalInvestment } from "../../models/personal/personalInvestments.model.js";

export const personalInvestmentsController = {
  getAllPersonalInvestments: async (req, res) => {
    try {
      const personalInvestments = await PersonalInvestment.find();
      if (!personalInvestments) throw Error("personalInvestments not found");
      res.send(personalInvestments);
    } catch (e) {
      res.send(e.message);
    }
  },
  getPersonalInvestment: async (req, res) => {
    const id = req.params.id;
    try {
      const personalInvestment = await PersonalInvestment.findById({
        _id: id,
      });
      if (!personalInvestment) throw Error("investment not found");
      res.send(personalInvestment);
    } catch (e) {
      res.send(e.message);
    }
  },

  createPersonalInvestment: async (req, res) => {
    try {
      const personalInvestment = await PersonalInvestment.create({
        ...req.body,
      });
      if (!personalInvestment) throw Error("bad data was inserted!");
      res.send(personalInvestment);
    } catch (e) {
      res.send(e.message);
    }
  },
  deletePersonalInvestment: async (req, res) => {
    try {
      const personalInvestment = await PersonalInvestment.findByIdAndDelete({
        _id: req.params.id,
      });
      if (!personalInvestment) throw Error("investment not found");
      res.send(personalInvestment);
    } catch (e) {
      res.send(e.message);
    }
  },

  updatePersonalInvestment: async (req, res) => {
    try {
      const personalInvestment = await PersonalInvestment.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: {
            ...req.body,
          },
        }
      );
      if (!personalInvestment) throw Error("bad data was inserted!");
      res.send(personalInvestment);
    } catch (e) {
      res.send(e.message);
    }
  },
};
