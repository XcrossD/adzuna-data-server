import { Schema, model } from 'mongoose';

interface Category {
  tag: string;
  label: string;
}

const schema = new Schema<Category>({
  tag: { type: String, required: true },
  label: { type: String, required: true },
});

const CategoryModel = model<Category>('categories', schema);

export default CategoryModel;