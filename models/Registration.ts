import mongoose, { Schema } from "mongoose";

// Workshop sub-schema
const WorkshopSchema = new Schema({
  id: { type: String, required: true },
  level: { type: String, required: false },
});

// Accommodation sub-schema
const AccommodationSchema = new Schema({
  type: {
    type: String,
    enum: ["tent", "family-room", "single-room", "bungalow", "already-booked"],
    required: true,
  },
  nights: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    validate: {
      validator: function (nights: number) {
        const accommodation = this as { type: string };
        if (accommodation.type === "bungalow") {
          return nights === 5;
        }
        return true;
      },
      message: "Bungalows must be booked for exactly 5 nights",
    },
  },
});

// Food sub-schema
const FoodSchema = new Schema({
  type: {
    type: String,
    enum: ["full", "single", "none"],
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
});

// Children sub-schema
const ChildrenSchema = new Schema({
  "under-5": {
    type: Number,
    required: true,
    min: 0,
  },
  "5-10": {
    type: Number,
    required: true,
    min: 0,
  },
  "10-17": {
    type: Number,
    required: true,
    min: 0,
  },
});

// Main Registration schema
const RegistrationSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email format",
      ],
      minlength: 5,
      maxlength: 255,
    },
    workshops: {
      type: [WorkshopSchema],
      required: true,
    },
    accommodation: {
      type: AccommodationSchema,
      required: true,
    },
    food: {
      type: FoodSchema,
      required: true,
    },
    children: {
      type: ChildrenSchema,
      required: true,
    },
    paymentMade: {
      type: Boolean,
      required: true,
      default: false,
    },
    initialPayment: {
      type: Number,
      required: false,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    collection: "Registrations",
  }
);

// Create and export the model
export default mongoose.models.Registration ||
  mongoose.model("Registration", RegistrationSchema, "Registrations");
