import { Schema, model, Document } from "mongoose";

/**
 * About Page Model
 * Stores the about page content data
 */

export interface IScheduleItem {
  id: number;
  day: string;
  time: string;
}

export interface IOpeningHours {
  title: string;
  schedule: IScheduleItem[];
}

export interface IAbout extends Document {
  imageUrl: string;
  altText: string;
  subtitle: string;
  title: string;
  divider: boolean;
  align: "left" | "right" | "center";
  priorityImage: boolean;
  buttonLink: string;
  buttonText: string;
  showOpeningHours: boolean;
  openingHours: IOpeningHours;
  descriptionParagraphs: string[];
  descriptionParagraphsTwo: string[];
  descriptionParagraphsThree: string[];
  createdAt: Date;
  updatedAt: Date;
}

const scheduleItemSchema = new Schema<IScheduleItem>(
  {
    id: {
      type: Number,
      required: true,
    },
    day: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const openingHoursSchema = new Schema<IOpeningHours>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    schedule: {
      type: [scheduleItemSchema],
      default: [],
    },
  },
  { _id: false }
);

const aboutSchema = new Schema<IAbout>(
  {
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    altText: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    divider: {
      type: Boolean,
      default: false,
    },
    align: {
      type: String,
      enum: ["left", "right", "center"],
      default: "left",
    },
    priorityImage: {
      type: Boolean,
      default: false,
    },
    buttonLink: {
      type: String,
      trim: true,
      default: "",
    },
    buttonText: {
      type: String,
      trim: true,
      default: "",
    },
    showOpeningHours: {
      type: Boolean,
      default: false,
    },
    openingHours: {
      type: openingHoursSchema,
      default: {
        title: "Opening Hours",
        schedule: [],
      },
    },
    descriptionParagraphs: {
      type: [String],
      default: [],
    },
    descriptionParagraphsTwo: {
      type: [String],
      default: [],
    },
    descriptionParagraphsThree: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const About = model<IAbout>("About", aboutSchema);
