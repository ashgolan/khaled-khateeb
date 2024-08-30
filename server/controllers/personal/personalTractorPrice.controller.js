import { PersonalTractorPrice } from "../../models/personal/personalTractorPrice.model.js";

export const getAllPersonalTractorPrices = async (req, res) => {
  try {
    const tractorPrice = await PersonalTractorPrice.find();
    if (!tractorPrice) throw Error("tractorPrice not found");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const getPersonalTractorPrice = async (req, res) => {
  const id = req.params.id;
  try {
    const tractorPrice = await PersonalTractorPrice.findById({ _id: id });
    if (!tractorPrice) throw Error("tractorPrice not found");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const createPersonalTractorPrice = async (req, res) => {
  try {
    const tractorPrice = await PersonalTractorPrice.create(req.body);
    if (!tractorPrice) throw Error("bad data was inserted!");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const deletePersonalTractorPrice = async (req, res) => {
  try {
    const tractorPrice = await PersonalTractorPrice.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!tractorPrice) throw Error("bad data was inserted!");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const updatePersonalTractorPrice = async (req, res) => {
  try {
    const tractorPrice = await PersonalTractorPrice.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          ...req.body,
        },
      }
    );
    if (!tractorPrice) throw Error("bad data was inserted!");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
