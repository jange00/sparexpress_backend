const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');
const Wishlist = require('../models/wishlists');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Wishlist Model Tests', () => {
  test('should create wishlist item with valid data', async () => {
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

    const wishlistData = {
      userId: user._id,
      productId: product._id
    };
    const wishlist = new Wishlist(wishlistData);
    const savedWishlist = await wishlist.save();
    expect(savedWishlist.userId.toString()).toBe(user._id.toString());
    expect(savedWishlist.productId.toString()).toBe(product._id.toString());
    expect(savedWishlist._id).toBeDefined();
    await Wishlist.deleteOne({ _id: savedWishlist._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const wishlist = new Wishlist({});
    let err;
    try {
      await wishlist.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.productId).toBeDefined();
  });

  test('should validate references', async () => {
    const uniq = uniqueStr();
    const wishlistData = {
      userId: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId()
    };
    const wishlist = new Wishlist(wishlistData);
    const savedWishlist = await wishlist.save();
    expect(savedWishlist.userId.toString()).toBe(wishlistData.userId.toString());
    expect(savedWishlist.productId.toString()).toBe(wishlistData.productId.toString());
    await Wishlist.deleteOne({ _id: savedWishlist._id });
  });

  test('should handle multiple wishlist items for same user', async () => {
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
    const product1 = await new Product({
      name: `Test Product 1 ${uniq}`,
      price: 99.99,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 10,
      shippingCharge: 5.00
    }).save();

    const product2 = await new Product({
      name: `Test Product 2 ${uniq}`,
      price: 149.99,
      categoryId: category._id,
      subCategoryId: subcategory._id,
      brandId: brand._id,
      stock: 5,
      shippingCharge: 7.00
    }).save();

    const wishlistData1 = {
      userId: user._id,
      productId: product1._id
    };
    const wishlistData2 = {
      userId: user._id,
      productId: product2._id
    };
    const wishlist1 = new Wishlist(wishlistData1);
    const wishlist2 = new Wishlist(wishlistData2);
    const savedWishlist1 = await wishlist1.save();
    const savedWishlist2 = await wishlist2.save();
    expect(savedWishlist1.userId.toString()).toBe(user._id.toString());
    expect(savedWishlist2.userId.toString()).toBe(user._id.toString());
    expect(savedWishlist1.productId.toString()).not.toBe(savedWishlist2.productId.toString());
    await Wishlist.deleteOne({ _id: savedWishlist1._id });
    await Wishlist.deleteOne({ _id: savedWishlist2._id });
    await Product.deleteOne({ _id: product1._id });
    await Product.deleteOne({ _id: product2._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });
}); 