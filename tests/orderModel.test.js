const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');
const ShippingAddress = require('../models/shipment_addressModel');
const Order = require('../models/orderModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Order Model Tests', () => {
  test('should create order with valid data', async () => {
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

    const shippingAddress = await new ShippingAddress({
      userId: user._id,
      streetAddress: "123 Test Street",
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    }).save();

    const orderData = {
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Pending",
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    };
    const order = new Order(orderData);
    const savedOrder = await order.save();
    expect(savedOrder.userId.toString()).toBe(user._id.toString());
    expect(savedOrder.Amount).toBe(104.99);
    expect(savedOrder.shippingAddressId.toString()).toBe(shippingAddress._id.toString());
    expect(savedOrder.orderStatus).toBe("Pending");
    expect(savedOrder.items.length).toBe(1);
    expect(savedOrder.items[0].productId.toString()).toBe(product._id.toString());
    expect(savedOrder.items[0].quantity).toBe(1);
    expect(savedOrder.items[0].total).toBe(99.99);
    expect(savedOrder._id).toBeDefined();
    await Order.deleteOne({ _id: savedOrder._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const order = new Order({});
    let err;
    try {
      await order.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.Amount).toBeDefined();
    expect(err.errors.shippingAddressId).toBeDefined();
  });

  test('should set default order status to Pending', async () => {
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

    const shippingAddress = await new ShippingAddress({
      userId: user._id,
      streetAddress: "123 Test Street",
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    }).save();

    const orderData = {
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    };
    const order = new Order(orderData);
    const savedOrder = await order.save();
    expect(savedOrder.orderStatus).toBe("Pending");
    await Order.deleteOne({ _id: savedOrder._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle different order statuses', async () => {
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

    const shippingAddress = await new ShippingAddress({
      userId: user._id,
      streetAddress: "123 Test Street",
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    }).save();

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    for (const status of validStatuses) {
      const orderData = {
        userId: user._id,
        Amount: 104.99,
        shippingAddressId: shippingAddress._id,
        orderStatus: status,
        items: [{
          productId: product._id,
          quantity: 1,
          total: 99.99
        }]
      };
      const order = new Order(orderData);
      const savedOrder = await order.save();
      expect(savedOrder.orderStatus).toBe(status);
      await Order.deleteOne({ _id: savedOrder._id });
    }
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle multiple items in order', async () => {
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

    const shippingAddress = await new ShippingAddress({
      userId: user._id,
      streetAddress: "123 Test Street",
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    }).save();

    const orderData = {
      userId: user._id,
      Amount: 259.98,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Pending",
      items: [
        {
          productId: product1._id,
          quantity: 1,
          total: 99.99
        },
        {
          productId: product2._id,
          quantity: 1,
          total: 149.99
        }
      ]
    };
    const order = new Order(orderData);
    const savedOrder = await order.save();
    expect(savedOrder.items.length).toBe(2);
    expect(savedOrder.items[0].productId.toString()).toBe(product1._id.toString());
    expect(savedOrder.items[1].productId.toString()).toBe(product2._id.toString());
    await Order.deleteOne({ _id: savedOrder._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product1._id });
    await Product.deleteOne({ _id: product2._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate references', async () => {
    const uniq = uniqueStr();
    const orderData = {
      userId: new mongoose.Types.ObjectId(),
      Amount: 100.00,
      shippingAddressId: new mongoose.Types.ObjectId(),
      orderStatus: "Pending",
      items: [{
        productId: new mongoose.Types.ObjectId(),
        quantity: 1,
        total: 100.00
      }]
    };
    const order = new Order(orderData);
    const savedOrder = await order.save();
    expect(savedOrder.userId.toString()).toBe(orderData.userId.toString());
    expect(savedOrder.shippingAddressId.toString()).toBe(orderData.shippingAddressId.toString());
    expect(savedOrder.items[0].productId.toString()).toBe(orderData.items[0].productId.toString());
    await Order.deleteOne({ _id: savedOrder._id });
  });
}); 