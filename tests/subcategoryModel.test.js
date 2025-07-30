const mongoose = require('mongoose');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Subcategory Model Tests', () => {
  test('should create subcategory with valid data', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategoryData = {
      categoryId: category._id,
      title: `Test Subcategory ${uniq}`,
      description: "Test subcategory description",
      icon: "test-sub-icon.png"
    };
    const subcategory = new Subcategory(subcategoryData);
    const savedSubcategory = await subcategory.save();
    expect(savedSubcategory.categoryId.toString()).toBe(category._id.toString());
    expect(savedSubcategory.title).toBe(subcategoryData.title);
    expect(savedSubcategory._id).toBeDefined();
    await Subcategory.deleteOne({ _id: savedSubcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should validate required fields', async () => {
    const subcategory = new Subcategory({});
    let err;
    try {
      await subcategory.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.categoryId).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  test('should validate categoryId reference', async () => {
    const uniq = uniqueStr();
    const subcategoryData = {
      categoryId: new mongoose.Types.ObjectId(),
      title: `Test Subcategory ${uniq}`
    };
    const subcategory = new Subcategory(subcategoryData);
    const savedSubcategory = await subcategory.save();
    expect(savedSubcategory.categoryId.toString()).toBe(subcategoryData.categoryId.toString());
    await Subcategory.deleteOne({ _id: savedSubcategory._id });
  });

  test('should create subcategory with minimal data', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategoryData = {
      categoryId: category._id,
      title: `Test Subcategory ${uniq}`
    };
    const subcategory = new Subcategory(subcategoryData);
    const savedSubcategory = await subcategory.save();
    expect(savedSubcategory.categoryId.toString()).toBe(category._id.toString());
    expect(savedSubcategory.title).toBe(subcategoryData.title);
    await Subcategory.deleteOne({ _id: savedSubcategory._id });
    await Category.deleteOne({ _id: category._id });
  });

  test('should handle multiple subcategories for same category', async () => {
    const uniq = uniqueStr();
    const category = await new Category({ title: `Cat_${uniq}` }).save();
    const subcategoryData1 = {
      categoryId: category._id,
      title: `Test Subcategory 1 ${uniq}`
    };
    const subcategoryData2 = {
      categoryId: category._id,
      title: `Test Subcategory 2 ${uniq}`
    };
    const subcategory1 = new Subcategory(subcategoryData1);
    const subcategory2 = new Subcategory(subcategoryData2);
    const savedSubcategory1 = await subcategory1.save();
    const savedSubcategory2 = await subcategory2.save();
    expect(savedSubcategory1.categoryId.toString()).toBe(category._id.toString());
    expect(savedSubcategory2.categoryId.toString()).toBe(category._id.toString());
    expect(savedSubcategory1.title).not.toBe(savedSubcategory2.title);
    await Subcategory.deleteOne({ _id: savedSubcategory1._id });
    await Subcategory.deleteOne({ _id: savedSubcategory2._id });
    await Category.deleteOne({ _id: category._id });
  });
}); 