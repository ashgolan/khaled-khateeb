import { TractorPrice } from "../models/tractorPrice.model.js";

export const getAllTractorPrices = async (req, res) => {
  try {
    const tractorPrice = await TractorPrice.find();
    if (!tractorPrice) throw Error("tractorPrice not found");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const getTractorPrice = async (req, res) => {
  const id = req.params.id;
  try {
    const tractorPrice = await TractorPrice.findById({ _id: id });
    if (!tractorPrice) throw Error("tractorPrice not found");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const createTractorPrice = async (req, res) => {
  try {
    const tractorPrice = await TractorPrice.create(req.body);
    if (!tractorPrice) throw Error("bad data was inserted!");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const deleteTractorPrice = async (req, res) => {
  try {
    const tractorPrice = await TractorPrice.findByIdAndDelete({
      _id: req.params.id,
    });
    if (!tractorPrice) throw Error("bad data was inserted!");
    res.send(tractorPrice);
  } catch (e) {
    res.send(e.message);
  }
};
export const updateTractorPrice = async (req, res) => {
  try {
    const tractorPrice = await TractorPrice.findByIdAndUpdate(
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
