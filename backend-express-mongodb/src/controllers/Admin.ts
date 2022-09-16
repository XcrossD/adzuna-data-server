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
  const tweetId = req.params.tweetId;

  console.log('Tweet ID', tweetId);

  // This line of code fixes the CastError: Cast to ObjectId failed for value "favicon.ico" (type string) at path "_id" for model "contents"

  if (!mongoose.Types.ObjectId.isValid(tweetId)) return false;

  await Category.findById(tweetId).exec();

  Category.findById(tweetId, (err: any, tweet: any) => {
      console.log(tweet);

      res.json(tweet);

      if (err) {
          console.log(err);
      }
  });
};