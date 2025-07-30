const mongoose = require('mongoose');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Payment Model Tests', () => {
  test('should create payment with valid data', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const paymentData = {
      userId: user._id,
      orderId: new mongoose.Types.ObjectId(),
      amount: 99.99,
      paymentMethod: "Credit Card",
      paymentStatus: "Pending"
    };
    const payment = new Payment(paymentData);
    const savedPayment = await payment.save();
    expect(savedPayment.userId.toString()).toBe(user._id.toString());
    expect(savedPayment.orderId.toString()).toBe(paymentData.orderId.toString());
    expect(savedPayment.amount).toBe(99.99);
    expect(savedPayment.paymentMethod).toBe("Credit Card");
    expect(savedPayment.paymentStatus).toBe("Pending");
    expect(savedPayment._id).toBeDefined();
    await Payment.deleteOne({ _id: savedPayment._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const payment = new Payment({});
    let err;
    try {
      await payment.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.orderId).toBeDefined();
    expect(err.errors.amount).toBeDefined();
    expect(err.errors.paymentMethod).toBeDefined();
  });

  test('should validate payment method enum', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const paymentData = {
      userId: user._id,
      orderId: new mongoose.Types.ObjectId(),
      amount: 50.00,
      paymentMethod: "Invalid Method",
      paymentStatus: "Pending"
    };
    const payment = new Payment(paymentData);
    let err;
    try {
      await payment.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.paymentMethod).toBeDefined();
    await User.deleteOne({ _id: user._id });
  });

  test('should validate payment status enum', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const paymentData = {
      userId: user._id,
      orderId: new mongoose.Types.ObjectId(),
      amount: 75.00,
      paymentMethod: "Debit Card",
      paymentStatus: "Invalid Status"
    };
    const payment = new Payment(paymentData);
    let err;
    try {
      await payment.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.paymentStatus).toBeDefined();
    await User.deleteOne({ _id: user._id });
  });

  test('should set default payment status to Pending', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const paymentData = {
      userId: user._id,
      orderId: new mongoose.Types.ObjectId(),
      amount: 25.00,
      paymentMethod: "Cash on Delivery"
    };
    const payment = new Payment(paymentData);
    const savedPayment = await payment.save();
    expect(savedPayment.paymentStatus).toBe("Pending");
    await Payment.deleteOne({ _id: savedPayment._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle different payment methods', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const validMethods = ["Credit Card", "Debit Card", "Cash on Delivery", "Esewa", "Net Banking", "Other"];
    for (const method of validMethods) {
      const paymentData = {
        userId: user._id,
        orderId: new mongoose.Types.ObjectId(),
        amount: 100.00,
        paymentMethod: method,
        paymentStatus: "Completed"
      };
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      expect(savedPayment.paymentMethod).toBe(method);
      await Payment.deleteOne({ _id: savedPayment._id });
    }
    await User.deleteOne({ _id: user._id });
  });

  test('should handle different payment statuses', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const validStatuses = ["Pending", "Completed", "Failed", "Refunded"];
    for (const status of validStatuses) {
      const paymentData = {
        userId: user._id,
        orderId: new mongoose.Types.ObjectId(),
        amount: 50.00,
        paymentMethod: "Credit Card",
        paymentStatus: status
      };
      const payment = new Payment(paymentData);
      const savedPayment = await payment.save();
      expect(savedPayment.paymentStatus).toBe(status);
      await Payment.deleteOne({ _id: savedPayment._id });
    }
    await User.deleteOne({ _id: user._id });
  });

  test('should handle decimal amounts', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const paymentData = {
      userId: user._id,
      orderId: new mongoose.Types.ObjectId(),
      amount: 123.45,
      paymentMethod: "Esewa",
      paymentStatus: "Completed"
    };
    const payment = new Payment(paymentData);
    const savedPayment = await payment.save();
    expect(savedPayment.amount).toBe(123.45);
    expect(typeof savedPayment.amount).toBe('number');
    await Payment.deleteOne({ _id: savedPayment._id });
    await User.deleteOne({ _id: user._id });
  });
}); 