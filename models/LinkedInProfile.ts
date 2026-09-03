import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILinkedInProfile extends Document {
  userId: string;
  linkedinId: string;

  name: string;
  givenName: string;
  familyName: string;

  email: string;
  emailVerified: boolean;

  picture: string;

  locale: string;

  accessToken: string;
  accessTokenExpiresAt?: Date;
}

const LinkedInProfileSchema =
  new Schema<ILinkedInProfile>(
    {
      userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      linkedinId: {
        type: String,
        required: true,
      },

      name: {
        type: String,
        default: "",
      },

      givenName: {
        type: String,
        default: "",
      },

      familyName: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      emailVerified: {
        type: Boolean,
        default: false,
      },

      picture: {
        type: String,
        default: "",
      },

      locale: {
        type: String,
        default: "",
      },

      accessToken: {
        type: String,
        required: true,
      },

      accessTokenExpiresAt: {
        type: Date,
      },
    },

    {
      timestamps: true,
    }
  );

const LinkedInProfile: Model<ILinkedInProfile> =
  mongoose.models.LinkedInProfile ||
  mongoose.model<ILinkedInProfile>(
    "LinkedInProfile",
    LinkedInProfileSchema
  );

export default LinkedInProfile;