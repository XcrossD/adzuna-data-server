import express from 'express';

import { getCategories, getCategory, getHistogramByCategory, getHistoricalByCategory } from '../controllers/Admin';

const router = express.Router();

router.get('/', getCategories);

router.get('/:categoryTag', getCategory);

router.get('/historical/:categoryTag', getHistoricalByCategory);

router.get('/histogram/:categoryTag', getHistogramByCategory);

export default router;