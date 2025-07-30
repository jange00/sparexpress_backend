const mongoose = require('mongoose');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subCategoryModel');
const Brand = require('../models/brandModel');
const ShippingAddress = require('../models/shipment_addressModel');
const Order = require('../models/orderModel');
const Delivery = require('../models/deliveryModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Delivery Model Tests', () => {
  test('should create delivery with valid data', async () => {
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

    const order = await new Order({
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Processing",
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    }).save();

    const deliveryData = {
      userId: user._id,
      orderId: order._id,
      deliveryStatus: "Pending",
      customerContact: "John Doe",
      customerPhone: "1234567890",
      deliveryAddress: "123 Test Street, Test City",
      deliveryCost: 5.00,
      totalCost: 109.99
    };
    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    expect(savedDelivery.userId.toString()).toBe(user._id.toString());
    expect(savedDelivery.orderId.toString()).toBe(order._id.toString());
    expect(savedDelivery.deliveryStatus).toBe("Pending");
    expect(savedDelivery.customerContact).toBe("John Doe");
    expect(savedDelivery.customerPhone).toBe("1234567890");
    expect(savedDelivery.deliveryAddress).toBe("123 Test Street, Test City");
    expect(savedDelivery.deliveryCost).toBe(5.00);
    expect(savedDelivery.totalCost).toBe(109.99);
    expect(savedDelivery.trackingNumber).toBeDefined();
    expect(savedDelivery._id).toBeDefined();
    await Delivery.deleteOne({ _id: savedDelivery._id });
    await Order.deleteOne({ _id: order._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const delivery = new Delivery({});
    let err;
    try {
      await delivery.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.orderId).toBeDefined();
  });

  test('should set default delivery status to Pending', async () => {
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

    const order = await new Order({
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Processing",
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    }).save();

    const deliveryData = {
      userId: user._id,
      orderId: order._id,
      customerContact: "John Doe",
      customerPhone: "1234567890",
      deliveryAddress: "123 Test Street, Test City"
    };
    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    expect(savedDelivery.deliveryStatus).toBe("Pending");
    await Delivery.deleteOne({ _id: savedDelivery._id });
    await Order.deleteOne({ _id: order._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle different delivery statuses', async () => {
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

    const order = await new Order({
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Processing",
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    }).save();

    const deliveryData = {
      userId: user._id,
      orderId: order._id,
      deliveryStatus: "Out for Delivery",
      customerContact: "John Doe",
      customerPhone: "1234567890",
      deliveryAddress: "123 Test Street, Test City"
    };
    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    expect(savedDelivery.deliveryStatus).toBe("Out for Delivery");
    await Delivery.deleteOne({ _id: savedDelivery._id });
    await Order.deleteOne({ _id: order._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle different priorities', async () => {
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

    const order = await new Order({
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Processing",
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    }).save();

    const deliveryData = {
      userId: user._id,
      orderId: order._id,
      deliveryStatus: "Pending",
      customerContact: "John Doe",
      customerPhone: "1234567890",
      deliveryAddress: "123 Test Street, Test City",
      priority: "high"
    };
    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    expect(savedDelivery.priority).toBe("high");
    await Delivery.deleteOne({ _id: savedDelivery._id });
    await Order.deleteOne({ _id: order._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should generate unique tracking number', async () => {
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

    const order = await new Order({
      userId: user._id,
      Amount: 104.99,
      shippingAddressId: shippingAddress._id,
      orderStatus: "Processing",
      items: [{
        productId: product._id,
        quantity: 1,
        total: 99.99
      }]
    }).save();

    const deliveryData = {
      userId: user._id,
      orderId: order._id,
      customerContact: "John Doe",
      customerPhone: "1234567890",
      deliveryAddress: "123 Test Street, Test City"
    };
    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    expect(savedDelivery.trackingNumber).toBeDefined();
    expect(typeof savedDelivery.trackingNumber).toBe('string');
    expect(savedDelivery.trackingNumber.length).toBeGreaterThan(0);
    await Delivery.deleteOne({ _id: savedDelivery._id });
    await Order.deleteOne({ _id: order._id });
    await ShippingAddress.deleteOne({ _id: shippingAddress._id });
    await Product.deleteOne({ _id: product._id });
    await Brand.deleteOne({ _id: brand._id });
    await Subcategory.deleteOne({ _id: subcategory._id });
    await Category.deleteOne({ _id: category._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate references', async () => {
    const uniq = uniqueStr();
    const deliveryData = {
      userId: new mongoose.Types.ObjectId(),
      orderId: new mongoose.Types.ObjectId(),
      deliveryStatus: "Pending",
      customerContact: "John Doe",
      customerPhone: "1234567890",
      deliveryAddress: "123 Test Street, Test City"
    };
    const delivery = new Delivery(deliveryData);
    const savedDelivery = await delivery.save();
    expect(savedDelivery.userId.toString()).toBe(deliveryData.userId.toString());
    expect(savedDelivery.orderId.toString()).toBe(deliveryData.orderId.toString());
    await Delivery.deleteOne({ _id: savedDelivery._id });
  });
}); 