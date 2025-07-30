const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');
const Rating = require('../models/ratingsModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Rating Model Tests', () => {
  test('should create rating with valid data', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const product = await new Product({
      name: `Test Product ${uniq}`,
      price: 99.99,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 10,
      shippingCharge: 5.00
    }).save();

    const ratingData = {
      userId: user._id,
      productId: product._id,
      ratings: 5,
      comments: "Excellent product!"
    };
    const rating = new Rating(ratingData);
    const savedRating = await rating.save();
    expect(savedRating.userId.toString()).toBe(user._id.toString());
    expect(savedRating.productId.toString()).toBe(product._id.toString());
    expect(savedRating.ratings).toBe(5);
    expect(savedRating.comments).toBe("Excellent product!");
    expect(savedRating._id).toBeDefined();
    await Rating.deleteOne({ _id: savedRating._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const rating = new Rating({});
    let err;
    try {
      await rating.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.productId).toBeDefined();
    expect(err.errors.ratings).toBeDefined();
  });

  test('should handle different rating values', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const product = await new Product({
      name: `Test Product ${uniq}`,
      price: 99.99,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 10,
      shippingCharge: 5.00
    }).save();

    const ratingData = {
      userId: user._id,
      productId: product._id,
      ratings: 3,
      comments: "Good product"
    };
    const rating = new Rating(ratingData);
    const savedRating = await rating.save();
    expect(savedRating.ratings).toBe(3);
    await Rating.deleteOne({ _id: savedRating._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate references', async () => {
    const uniq = uniqueStr();
    const ratingData = {
      userId: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      ratings: 4,
      comments: "Test review"
    };
    const rating = new Rating(ratingData);
    const savedRating = await rating.save();
    expect(savedRating.userId.toString()).toBe(ratingData.userId.toString());
    expect(savedRating.productId.toString()).toBe(ratingData.productId.toString());
    await Rating.deleteOne({ _id: savedRating._id });
  });

  test('should handle long reviews', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const product = await new Product({
      name: `Test Product ${uniq}`,
      price: 99.99,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 10,
      shippingCharge: 5.00
    }).save();

    const longReview = "A".repeat(1000);
    const ratingData = {
      userId: user._id,
      productId: product._id,
      ratings: 5,
      comments: longReview
    };
    const rating = new Rating(ratingData);
    const savedRating = await rating.save();
    expect(savedRating.comments).toBe(longReview);
    await Rating.deleteOne({ _id: savedRating._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });
}); 