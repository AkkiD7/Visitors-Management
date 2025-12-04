import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema({
  visitorNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true,
  },

  mobile: {
    type: String,
    required: true,
  },

  contactPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,      
  },

  purpose: {
    type: String,
    required: true,
  },

  numberOfPersons: {
    type: Number,
    default: 1,
  },

  vehicleNumber: {
    type: String,
    default: null
  },

  inTime: {
    type: Date,
    default: null,
  },

  outTime: {
    type: Date,
    default: null,
  },

  totalTimeSpent: {
    type: Number,        
    default: null
  },

  photoUrl: {
    type: String,
    default: null,
  },

  meetingStatus: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled", "No Show"],
    default: "Pending"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",         
    required: true,
  }

}, { timestamps: true });


visitorSchema.pre("save", function () {
  if (this.inTime && this.outTime) {
    const diff = (this.outTime - this.inTime) / (1000 * 60); 
    this.totalTimeSpent = Math.round(diff);
  }
});


export default mongoose.model("Visitor", visitorSchema);
