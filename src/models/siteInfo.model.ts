import { Schema, model, Document } from "mongoose";

/**
 * Site Info Model
 * Stores general site/restaurant information
 */

export interface ITopbar {
  addressIcon: string;
  addressAriaLabel: string;
  phoneIcon: string;
  phoneAriaLabel: string;
  emailIcon: string;
  emailAriaLabel: string;
}

export interface ISiteInfo extends Document {
  urlLogo: string;
  urlMap: string;
  phone: string;
  fax: string;
  emailInfo: string;
  emailReservations: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  largeCountry: string;
  phoneLabel: string;
  faxLabel: string;
  copyright: string;
  scrollToTopLabel: string;
  scrollToTopIconClasses: string;
  menuToggleAriaLabelOpen: string;
  menuToggleAriaLabelClose: string;
  topbar: ITopbar;
  createdAt: Date;
  updatedAt: Date;
}

const topbarSchema = new Schema<ITopbar>(
  {
    addressIcon: {
      type: String,
      default: "fa-solid fa-location-dot",
    },
    addressAriaLabel: {
      type: String,
      default: "Location",
    },
    phoneIcon: {
      type: String,
      default: "fa-solid fa-phone",
    },
    phoneAriaLabel: {
      type: String,
      default: "Call us at",
    },
    emailIcon: {
      type: String,
      default: "fa-solid fa-envelope",
    },
    emailAriaLabel: {
      type: String,
      default: "Email us at",
    },
  },
  { _id: false }
);

const siteInfoSchema = new Schema<ISiteInfo>(
  {
    urlLogo: {
      type: String,
      required: true,
      trim: true,
    },
    urlMap: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    fax: {
      type: String,
      trim: true,
      default: "",
    },
    emailInfo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    emailReservations: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    zip: {
      type: String,
      trim: true,
      default: "",
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    largeCountry: {
      type: String,
      trim: true,
      default: "",
    },
    phoneLabel: {
      type: String,
      default: "Phone:",
    },
    faxLabel: {
      type: String,
      default: "Fax:",
    },
    copyright: {
      type: String,
      default: "",
    },
    scrollToTopLabel: {
      type: String,
      default: "Go to top",
    },
    scrollToTopIconClasses: {
      type: String,
      default: "fas fa-angle-double-up",
    },
    menuToggleAriaLabelOpen: {
      type: String,
      default: "Open menu",
    },
    menuToggleAriaLabelClose: {
      type: String,
      default: "Close menu",
    },
    topbar: {
      type: topbarSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

export const SiteInfo = model<ISiteInfo>("SiteInfo", siteInfoSchema);
