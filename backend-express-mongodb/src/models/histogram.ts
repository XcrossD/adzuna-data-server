import { Schema, model } from "mongoose";

interface Histogram {
  category: string;
  histogram: {
    [key: string]: string;
  };
}

const schema = new Schema<Histogram>(
  {
    category: { type: "String", required: true },
    histogram: { type: Map, of: String }
  },
  {
    timestamps: true
  }
);

const histogramModel = model("histograms", schema);

export default histogramModel