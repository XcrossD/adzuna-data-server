import { Response, Request } from 'express';
import mongoose from 'mongoose';
import Category from '../models/Category';

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