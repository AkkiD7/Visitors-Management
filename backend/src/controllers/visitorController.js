import Visitor from "../models/Visitor.js";

export const createVisitor = async (req, res) => {
  const visitor = await Visitor.create({
    ...req.body,
    createdBy: req.user._id
  });

  res.status(201).json(visitor);
};

export const updateVisitorIn = async (req, res) => {
  const visitor = await Visitor.findByIdAndUpdate(
    req.params.id,
    { ...req.body },
    { new: true }
  );
  res.json(visitor);
};

export const updateVisitorOut = async (req, res) => {
  const visitor = await Visitor.findById(req.params.id);

  visitor.outTime = new Date();
  await visitor.save();

  res.json(visitor);
};

export const getAllVisitors = async (req, res) => {
  const visitors = await Visitor.find().populate("contactPersonId", "name role");
  res.json(visitors);
};

export const getMyVisitors = async (req, res) => {
  const visitors = await Visitor.find({
    contactPersonId: req.user._id
  }).sort({ createdAt: -1 });

  res.json(visitors);
};
