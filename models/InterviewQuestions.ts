import mongoose, { Schema, models, model } from "mongoose";

const InterviewQuestionSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      required: true,
      enum: ["Easy", "Medium", "Hard"],
    },

    answer: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const InterviewQuestion =
  models.InterviewQuestion ||
  model("InterviewQuestion", InterviewQuestionSchema);

export default InterviewQuestion;