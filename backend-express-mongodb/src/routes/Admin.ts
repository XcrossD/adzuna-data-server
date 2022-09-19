import express from 'express';

import { getCategories, getCategory } from '../controllers/Admin';

const router = express.Router();

router.get('/', getCategories);

router.get('/:categoryTag', getCategory);

export default router;