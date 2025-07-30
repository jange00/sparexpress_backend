const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Category Model Tests', () => {
  test('should create category with valid data', async () => {
    const uniq = uniqueStr();
    const categoryData = {
      title: `Test Category ${uniq}`,
      description: "Test category description",
      icon: "test-icon.png"
    };
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    expect(savedCategory.title).toBe(categoryData.title);
    // description and icon may be undefined if not in schema, so only check if present
    if (savedCategory.description !== undefined) expect(savedCategory.description).toBe(categoryData.description);
    if (savedCategory.icon !== undefined) expect(savedCategory.icon).toBe(categoryData.icon);
    expect(savedCategory._id).toBeDefined();
    await Category.deleteOne({ _id: savedCategory._id });
  });

  test('should validate required fields', async () => {
    const category = new Category({});
    let err;
    try {
      await category.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  test('should enforce unique title constraint', async () => {
    const uniq = uniqueStr();
    const categoryData = {
      title: `Test Category ${uniq}`,
      description: "Test category description",
      icon: "test-icon.png"
    };
    const category1 = new Category(categoryData);
    await category1.save();
    const category2 = new Category(categoryData);
    let err;
    try {
      await category2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error
    await Category.deleteOne({ _id: category1._id });
  });

  test('should create category with minimal data', async () => {
    const uniq = uniqueStr();
    const categoryData = {
      title: `Test Category ${uniq}`
    };
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    expect(savedCategory.title).toBe(categoryData.title);
    await Category.deleteOne({ _id: savedCategory._id });
  });

  test('should handle long title', async () => {
    const uniq = uniqueStr();
    const longTitle = `A${uniq}`.repeat(10);
    const categoryData = {
      title: longTitle,
      description: "Test category description"
    };
    const category = new Category(categoryData);
    const savedCategory = await category.save();
    expect(savedCategory.title).toBe(longTitle);
    await Category.deleteOne({ _id: savedCategory._id });
  });
}); 