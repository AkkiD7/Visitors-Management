import Visitor from "../models/Visitor.js";

export const createVisitor = async (req, res) => {
  try {
    const {
      visitorNumber,
      name,
      mobile,
      contactPersonId,
      purpose,
      numberOfPersons,
      vehicleNumber,
      inTime,
      outTime,
      totalTimeSpent,
      photoUrl,
      meetingStatus,
    } = req.body;

    if (!visitorNumber || !name || !mobile || !contactPersonId || !purpose) {
      return res.status(400).json({
        success: false,
        message: "visitorNumber, name, mobile, contactPersonId and purpose are required",
        data: null,
      });
    }

    const existing = await Visitor.findOne({ visitorNumber });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Visitor number already exists",
        data: null,
      });
    }

    const visitor = await Visitor.create({
      visitorNumber,
      name,
      mobile,
      contactPersonId,
      purpose,
      numberOfPersons,
      vehicleNumber,
      inTime: inTime || null,
      outTime: outTime || null,
      totalTimeSpent: totalTimeSpent ?? null,
      photoUrl: photoUrl || null,
      meetingStatus: meetingStatus || undefined, 
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Visitor created successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Create Visitor Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const updateVisitorIn = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { ...req.body }, 
      {
        new: true,
        runValidators: true,
      }
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Visitor IN details updated successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Update Visitor IN Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const updateVisitorOut = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found",
        data: null,
      });
    }

    visitor.outTime = new Date(); 
    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Visitor OUT details updated successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Update Visitor OUT Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate("contactPersonId", "username role")
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Visitors fetched successfully",
      data: visitors,
    });
  } catch (error) {
    console.error("Get All Visitors Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const getMyVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find({
      contactPersonId: req.user._id,
    })
      .populate("contactPersonId", "username role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "My visitors fetched successfully",
      data: visitors,
    });
  } catch (error) {
    console.error("Get My Visitors Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

export const updateVisitorMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { meetingStatus, outTime } = req.body;

    if (!meetingStatus || !outTime) {
      return res.status(400).json({
        success: false,
        message: "meetingStatus and outTime are required",
        data: null,
      });
    }

    const allowedStatuses = ["Pending", "Completed", "Cancelled", "No Show"];
    if (!allowedStatuses.includes(meetingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid meeting status",
        data: null,
      });
    }

    const visitor = await Visitor.findOne({
      _id: id,
      contactPersonId: req.user._id, 
    });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: "Visitor not found or not assigned to you",
        data: null,
      });
    }

    visitor.meetingStatus = meetingStatus;
    visitor.outTime = new Date(outTime);

    if (visitor.inTime) {
      visitor.totalTimeSpent = Math.round(
        (visitor.outTime - visitor.inTime) / (1000 * 60)
      );
    }

    await visitor.save();

    return res.status(200).json({
      success: true,
      message: "Visitor meeting details updated successfully",
      data: visitor,
    });
  } catch (error) {
    console.error("Update Visitor Meeting Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};
