import { Response, Request } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category';
import Histogram from '../models/Histogram';
import Historical from '../models/Historical';

export const getCategories = (req: Request, res: Response): void => {
  Category.find((err, data) => {
      console.log(data);

      res.json(data);

      if (err) {
          console.log(err);
      }
  });
};

export const getCategory = async (req: Request, res: Response): Promise<any> => {
  const categoryTag = req.params.categoryTag;

  console.log('Category tag: ', categoryTag);

  // This line of code fixes the CastError: Cast to ObjectId failed for value "favicon.ico" (type string) at path "_id" for model "contents"

  if (!mongoose.Types.ObjectId.isValid(categoryTag)) return false;

  // await Category.findById(categoryTag).exec();

  Category.findById(categoryTag, (err: any, doc: any) => {
      console.log(doc);

      res.json(doc);

      if (err) {
          console.log(err);
      }
  });
};

export const getHistoricalByCategory = async (req: Request, res: Response): Promise<any> => {
  const categoryTag = req.params.categoryTag;

  console.log('Category tag: ', categoryTag);

  // This line of code fixes the CastError: Cast to ObjectId failed for value "favicon.ico" (type string) at path "_id" for model "contents"

  if (!mongoose.Types.ObjectId.isValid(categoryTag)) return false;

  Historical.findOne({ category: categoryTag }, (err: any, doc: any) => {
    console.log(doc);

    const parsedHistorical = Object.entries(doc.month)
      .map(([key, value]) => ({ month: Date.parse(key), average: value}))
      .sort((a, b) => {
        return a.month - b.month;
      });
    
    res.json(parsedHistorical);

    if (err) {
      console.log(err);
    }
  });
};

export const getHistogramByCategory = async (req: Request, res: Response): Promise<any> => {
  const categoryTag = req.params.categoryTag;

  console.log('Category tag: ', categoryTag);

  // This line of code fixes the CastError: Cast to ObjectId failed for value "favicon.ico" (type string) at path "_id" for model "contents"

  if (!mongoose.Types.ObjectId.isValid(categoryTag)) return false;

  Histogram.findOne({ category: categoryTag }, (err: any, doc: any) => {
    console.log(doc);

    const parsedHistogram = Object.entries(doc.histogram)
      .map(([key, value]) => ({ bin: key, amount: value}))
      .sort((a, b) => +a.bin - +b.bin);
    
    res.json(parsedHistogram);

    if (err) {
      console.log(err);
    }
  });
};