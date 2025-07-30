const mongoose = require('mongoose');
const User = require('../models/userModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('User Model Tests', () => {
  test('should create user with valid data', async () => {
    const uniq = uniqueStr();
    const userData = {
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    };
    const user = new User(userData);
    const savedUser = await user.save();
    expect(savedUser.fullname).toBe(userData.fullname);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.phoneNumber).toBe(userData.phoneNumber);
    expect(savedUser.role).toBe("Customer");
    expect(savedUser._id).toBeDefined();
    await User.deleteOne({ _id: savedUser._id });
  });

  test('should create admin user', async () => {
    const uniq = uniqueStr();
    const userData = {
      fullname: `Test Admin ${uniq}`,
      email: `testadmin${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Admin"
    };
    const user = new User(userData);
    const savedUser = await user.save();
    expect(savedUser.role).toBe("Admin");
    await User.deleteOne({ _id: savedUser._id });
  });

  test('should validate required fields', async () => {
    const user = new User({});
    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.fullname).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.phoneNumber).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });

  test('should enforce unique constraints', async () => {
    const uniq = uniqueStr();
    const userData = {
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    };
    const user1 = new User(userData);
    await user1.save();
    const user2 = new User(userData);
    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.code).toBe(11000); // Duplicate key error
    await User.deleteOne({ _id: user1._id });
  });

  test('should set default role to Customer', async () => {
    const uniq = uniqueStr();
    const userData = {
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123"
    };
    const user = new User(userData);
    const savedUser = await user.save();
    expect(savedUser.role).toBe("Customer");
    await User.deleteOne({ _id: savedUser._id });
  });
}); 