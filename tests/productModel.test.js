const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');
const Product = require('../models/productModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Product Model Tests', () => {
  test('should create product with valid data', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const productData = {
      name: `Test Product ${uniq}`,
      description: "Test product description",
      price: 99.99,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 10,
      shippingCharge: 5.00,
      image: ["test-image1.jpg", "test-image2.jpg"]
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.description).toBe(productData.description);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.categoryId.toString()).toBe(category._id.toString());
    expect(savedProduct.subCategoryId.toString()).toBe(subcategory._id.toString());
    expect(savedProduct.brandId.toString()).toBe(brand._id.toString());
    expect(savedProduct.stock).toBe(productData.stock);
    expect(savedProduct.shippingCharge).toBe(productData.shippingCharge);
    expect(savedProduct.image).toEqual(productData.image);
    expect(savedProduct._id).toBeDefined();
    await Product.deleteOne({ _id: savedProduct._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should validate required fields', async () => {
    const product = new Product({});
    let err;
    try {
      await product.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.name).toBeDefined();
    expect(err.errors.price).toBeDefined();
    expect(err.errors.categoryId).toBeDefined();
    expect(err.errors.subCategoryId).toBeDefined();
    expect(err.errors.brandId).toBeDefined();
    expect(err.errors.stock).toBeDefined();
    expect(err.errors.shippingCharge).toBeDefined();
  });

  test('should create product with minimal data', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const productData = {
      name: `Test Product ${uniq}`,
      price: 50.00,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 5,
      shippingCharge: 2.00
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.categoryId.toString()).toBe(category._id.toString());
    expect(savedProduct.subCategoryId.toString()).toBe(subcategory._id.toString());
    expect(savedProduct.brandId.toString()).toBe(brand._id.toString());
    expect(savedProduct.stock).toBe(productData.stock);
    expect(savedProduct.shippingCharge).toBe(productData.shippingCharge);
    await Product.deleteOne({ _id: savedProduct._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should handle decimal prices', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const productData = {
      name: `Test Product ${uniq}`,
      price: 123.45,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 3,
      shippingCharge: 1.00
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    expect(savedProduct.price).toBe(123.45);
    expect(typeof savedProduct.price).toBe('number');
    await Product.deleteOne({ _id: savedProduct._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should handle multiple images', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brand = await new Brand({ title: `Brand_${uniq}`, count: 1, categoryId: category._id, subcategoryId: subcategory._id }).save();
    const productData = {
      name: `Test Product ${uniq}`,
      price: 75.00,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 7,
      shippingCharge: 3.00,
      image: ["image1.jpg", "image2.jpg", "image3.jpg"]
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    expect(savedProduct.image).toEqual(productData.image);
    expect(savedProduct.image.length).toBe(3);
    await Product.deleteOne({ _id: savedProduct._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should validate references', async () => {
    const uniq = uniqueStr();
    const productData = {
      name: `Test Product ${uniq}`,
      price: 100.00,
      categoryId: new mongoose.Types.ObjectId(),
      subCategoryId: new mongoose.Types.ObjectId(),
      brandId: new mongoose.Types.ObjectId(),
      stock: 1,
      shippingCharge: 1.00
    };
    const product = new Product(productData);
    const savedProduct = await product.save();
    expect(savedProduct.categoryId.toString()).toBe(productData.categoryId.toString());
    expect(savedProduct.subCategoryId.toString()).toBe(productData.subCategoryId.toString());
    expect(savedProduct.brandId.toString()).toBe(productData.brandId.toString());
    await Product.deleteOne({ _id: savedProduct._id });
  });
}); 