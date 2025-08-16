import mongoose from 'mongoose';

export const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true, unique: true },
  img: { type: String, required: true, unique: true },
  alt: { type: String, required: true },
  oldPrice: { type: Number },
  price:{ type: Number, required: true },
  sale: { type: Number},
  link: { type: String, required: true, unique: true },
  isFavorite: { type: Boolean },
  showOnHomepage: { type: Boolean },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  subSubcategory: { type: String, required: false },
  content: { type: Array, required: false }
});

export const ProductModel = mongoose.model('Product', ProductSchema);