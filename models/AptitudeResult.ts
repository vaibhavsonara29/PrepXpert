import mongoose, { Schema, models } from "mongoose";

const AptitudeResultSchema = new Schema(
  {
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 1,
    },

    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    category: {
      type: String,
      default: "Aptitude",
    },
  },
  {
    timestamps: true,
  }
);

const AptitudeResult =
  models.AptitudeResult ||
  mongoose.model("AptitudeResult", AptitudeResultSchema);

export default AptitudeResult;