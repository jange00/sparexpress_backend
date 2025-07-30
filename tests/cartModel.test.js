const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');
const Cart = require('../models/cartModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Cart Model Tests', () => {
  test('should create cart item with valid data', async () => {
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

    const cartData = {
      userId: user._id,
      productId: product._id,
      quantity: 2
    };
    const cart = new Cart(cartData);
    const savedCart = await cart.save();
    expect(savedCart.userId.toString()).toBe(user._id.toString());
    expect(savedCart.productId.toString()).toBe(product._id.toString());
    expect(savedCart.quantity).toBe(2);
    expect(savedCart._id).toBeDefined();
    await Cart.deleteOne({ _id: savedCart._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const cart = new Cart({});
    let err;
    try {
      await cart.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.productId).toBeDefined();
    if (err.errors.quantity) {
      expect(err.errors.quantity).toBeDefined();
    }
  });

  test('should handle minimum quantity', async () => {
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

    const cartData = {
      userId: user._id,
      productId: product._id,
      quantity: 1
    };
    const cart = new Cart(cartData);
    const savedCart = await cart.save();
    expect(savedCart.quantity).toBe(1);
    await Cart.deleteOne({ _id: savedCart._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle large quantities', async () => {
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

    const cartData = {
      userId: user._id,
      productId: product._id,
      quantity: 100
    };
    const cart = new Cart(cartData);
    const savedCart = await cart.save();
    expect(savedCart.quantity).toBe(100);
    await Cart.deleteOne({ _id: savedCart._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate references', async () => {
    const uniq = uniqueStr();
    const cartData = {
      userId: new mongoose.Types.ObjectId(),
      productId: new mongoose.Types.ObjectId(),
      quantity: 1
    };
    const cart = new Cart(cartData);
    const savedCart = await cart.save();
    expect(savedCart.userId.toString()).toBe(cartData.userId.toString());
    expect(savedCart.productId.toString()).toBe(cartData.productId.toString());
    await Cart.deleteOne({ _id: savedCart._id });
  });
}); 