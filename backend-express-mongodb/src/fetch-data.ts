import axios from 'axios';
import mongoose from 'mongoose';
import nodeCron from 'node-cron';
import Category from './models/category';
import Historical from './models/historical';
import Histogram from './models/histogram';

const BASE_URL = "https://api.adzuna.com/v1/api/jobs";

const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;

interface ICategory {
  __CLASS__: string;
  tag: string;
  label: string;
}

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const getAndSaveCategoriesData = async () => {
  const url = `${BASE_URL}/us/categories?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}`;
  const response = await axios.get(url);
  // console.log(response.data.results);
  const newData = [];
  const fetchedCategories = response.data.results;
  for (let i = 0; i < fetchedCategories.length; i += 1) {
    const existingCategory = await Category.findOne({ tag: fetchedCategories[i].tag });
    if (existingCategory) {
      if (existingCategory.label !== fetchedCategories[i].label) {
        existingCategory.label = fetchedCategories[i].label;
        existingCategory.save();
      }
    } else {
      newData.push({
        tag: fetchedCategories[i].tag,
        label: fetchedCategories[i].label
      })
    }
  }
  if (newData.length > 0) {
    Category.insertMany(newData);
  }
  return fetchedCategories.map((elem: ICategory) => elem.tag);
};

const getAndSaveHistoricalData = async (categories: string[]) => {
  const getHistoricalRawArr = async () => {
    const result = [];
    for (let i = 0; i < categories.length; i += 1) {
      await delay(3000);
      const url = `${BASE_URL}/us/history?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&category=${categories[i]}`;
      const response = await axios.get(url);
      result.push(response.data);
    }
    return result;
  }

  const historicalRawArr = await getHistoricalRawArr();
  for (let i = 0; i < historicalRawArr.length; i += 1) {
    await delay();
    const existingHistorical = await Historical.findOne({ category: categories[i] });
    if (!existingHistorical) {
      const historical = new Historical({
        category: categories[i],
        month: historicalRawArr[i].month
      });
      historical.save();
    } else {
      existingHistorical.month = historicalRawArr[i].month;
      existingHistorical.save();
    }
  }
};

const getAndSaveHistogramData = async (categories: string[]) => {
  const getHistogramRawArr = async () => {
    const result = [];
    for (let i = 0; i < categories.length; i += 1) {
      await delay(3000);
      const url = `${BASE_URL}/us/histogram?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&category=${categories[i]}`;
      const response = await axios.get(url);
      result.push(response.data);
    }
    return result;
  }

  const histogramRawArr = await getHistogramRawArr();
  for (let i = 0; i < histogramRawArr.length; i += 1) {
    await delay();
    const existingHistogram = await Histogram.findOne({ category: categories[i] });
    if (!existingHistogram) {
      const historical = new Histogram({
        category: categories[i],
        histogram: histogramRawArr[i].histogram
      });
      historical.save();
    } else {
      existingHistogram.histogram = histogramRawArr[i].histogram;
      existingHistogram.save();
    }
  }
};

const jobExecution = async () => {
  try {
    const dbConnection = await mongoose.connect(`${process.env.DB_HOST_ATLAS}`);
    
    const categories = await getAndSaveCategoriesData();
    console.log(categories);
    await getAndSaveHistoricalData(categories);
    await getAndSaveHistogramData(categories);
    
    dbConnection.disconnect();
  } catch (err) {
    console.log(err);
  }
};

export const initFetchData = () => {
  const job = nodeCron.schedule("0 0 1-30/3 * *", () => {
    jobExecution();
  });
  job.start();
};