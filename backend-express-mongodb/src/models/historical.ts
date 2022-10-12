import { Schema, model } from "mongoose";

interface Historical {
  category: string;
  month: {
    [key: string]: string;
  };
}

const schema = new Schema<Historical>(
  {
    category: { type: "String", required: true },
    month: { type: Map, of: String }
  },
  {
    timestamps: true
  }
);

const historicalModel = model("historicals", schema);

export default historicalModel;