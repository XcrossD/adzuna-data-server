import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import Category from './models/Category';

dotenv.config();

const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;

interface ICategory {
  __CLASS__: string;
  tag: string;
  label: string;
}

const getAndSaveCategoriesData = async () => {
  const url = `${BASE_URL}/us/categories?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}`;
  const response = await axios.get(url);
  // console.log(response.data.results);
  return mongoose.connect(`${process.env.DB_HOST_DOCKER}`)
    .then(async () => {
      const dataExistCheck = await Promise.all(response.data.results.map(async (elem: ICategory) => {
        const data = await Category.find({ tag: elem.tag });
        return data.length === 0;
      }));
      const newData = response.data.results.filter((elem: ICategory, index: number) => {
        return dataExistCheck[index];
      })
        .map((elem: ICategory) => {
          return {
            tag: elem.tag,
            label: elem.label
          };
        });
      if (newData.length > 0) {
        return Category.insertMany(newData);
      }
    })
    .catch((err: any) => {
      console.log(err);
    });
}

getAndSaveCategoriesData()
  .then((res) => console.log(res));