import { Response, Request } from 'express';
import Category from '../models/category';
import Histogram from '../models/histogram';
import Historical from '../models/historical';

export const getCategories = (req: Request, res: Response): void => {
  Category.find((err: any, data: any) => {
      console.log(data);

      res.json(data);

      if (err) {
          console.log(err);
      }
  });
};

export const getCategory = async (req: Request, res: Response): Promise<any> => {
  const categoryTag = req.params.categoryTag;

  Category.findOne({ tag: categoryTag }, (err: any, doc: any) => {
      console.log(doc);

      res.json(doc);

      if (err) {
          console.log(err);
      }
  });
};

export const getHistoricalByCategory = async (req: Request, res: Response): Promise<any> => {
  const categoryTag = req.params.categoryTag;

  Historical.findOne({ category: categoryTag }, (err: any, doc: any) => {
    console.log(doc);

    const parsedHistorical = Array.from(doc.month, ([key, value]) => ({ month: Date.parse(key), average: value}))
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

  Histogram.findOne({ category: categoryTag }, (err: any, doc: any) => {
    console.log(doc);

    const parsedHistogram = Array.from(doc.histogram, ([key, value]) => ({ bin: key, amount: value}))
      .sort((a, b) => +a.bin - +b.bin);
    
    res.json(parsedHistogram);

    if (err) {
      console.log(err);
    }
  });
};