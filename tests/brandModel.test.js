const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Brand Model Tests', () => {
  test('should create brand with valid data', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brandData = {
      title: `Test Brand ${uniq}`,
      count: 10,
      model: "Test Model",
      categoryId: category._id,
      subcategoryId: subcategory._id
    };
    const brand = new Brand(brandData);
    const savedBrand = await brand.save();
    expect(savedBrand.title).toBe(brandData.title);
    expect(savedBrand.count).toBe(brandData.count);
    expect(savedBrand.model).toBe(brandData.model);
    expect(savedBrand.categoryId.toString()).toBe(category._id.toString());
    expect(savedBrand.subcategoryId.toString()).toBe(subcategory._id.toString());
    expect(savedBrand._id).toBeDefined();
    await Brand.deleteOne({ _id: savedBrand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should validate required fields', async () => {
    const brand = new Brand({});
    let err;
    try {
      await brand.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.categoryId).toBeDefined();
    expect(err.errors.count).toBeDefined();
    expect(err.errors.subcategoryId).toBeDefined();
  });

  test('should create brand with minimal data', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brandData = {
      title: `Test Brand ${uniq}`,
      count: 1,
      categoryId: category._id,
      subcategoryId: subcategory._id
    };
    const brand = new Brand(brandData);
    const savedBrand = await brand.save();
    expect(savedBrand.title).toBe(brandData.title);
    expect(savedBrand.categoryId.toString()).toBe(category._id.toString());
    expect(savedBrand.count).toBe(1);
    expect(savedBrand.subcategoryId.toString()).toBe(subcategory._id.toString());
    await Brand.deleteOne({ _id: savedBrand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should handle numeric count values', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategory = await new Subcategory({ categoryId: category._id, title: `Sub_${uniq}` }).save();
    const brandData = {
      title: `Test Brand ${uniq}`,
      count: 25,
      categoryId: category._id,
      subcategoryId: subcategory._id
    };
    const brand = new Brand(brandData);
    const savedBrand = await brand.save();
    expect(savedBrand.count).toBe(25);
    expect(typeof savedBrand.count).toBe('number');
    expect(savedBrand.subcategoryId.toString()).toBe(subcategory._id.toString());
    await Brand.deleteOne({ _id: savedBrand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should validate categoryId reference', async () => {
    const uniq = uniqueStr();
    const brandData = {
      title: `Test Brand ${uniq}`,
      count: 1,
      categoryId: new mongoose.Types.ObjectId(),
      subcategoryId: new mongoose.Types.ObjectId()
    };
    const brand = new Brand(brandData);
    const savedBrand = await brand.save();
    expect(savedBrand.categoryId.toString()).toBe(brandData.categoryId.toString());
    expect(savedBrand.subcategoryId.toString()).toBe(brandData.subcategoryId.toString());
    expect(savedBrand.count).toBe(1);
    await Brand.deleteOne({ _id: savedBrand._id });
  });
}); 