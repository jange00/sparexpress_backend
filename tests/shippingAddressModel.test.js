const mongoose = require('mongoose');
const User = require('../models/userModel');
const ShippingAddress = require('../models/shipment_addressModel');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

afterAll(async () => {
  await mongoose.disconnect();
});

describe('ShippingAddress Model Tests', () => {
  test('should create shipping address with valid data', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const addressData = {
      userId: user._id,
      streetAddress: "123 Test Street",
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    };
    const address = new ShippingAddress(addressData);
    const savedAddress = await address.save();
    expect(savedAddress.userId.toString()).toBe(user._id.toString());
    expect(savedAddress.streetAddress).toBe("123 Test Street");
    expect(savedAddress.postalCode).toBe("12345");
    expect(savedAddress.city).toBe("Test City");
    expect(savedAddress.district).toBe("Test District");
    expect(savedAddress.province).toBe("Test Province");
    expect(savedAddress.country).toBe("Test Country");
    expect(savedAddress._id).toBeDefined();
    await ShippingAddress.deleteOne({ _id: savedAddress._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should validate required fields', async () => {
    const address = new ShippingAddress({});
    let err;
    try {
      await address.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.userId).toBeDefined();
    expect(err.errors.streetAddress).toBeDefined();
    expect(err.errors.postalCode).toBeDefined();
    expect(err.errors.city).toBeDefined();
    expect(err.errors.district).toBeDefined();
    expect(err.errors.province).toBeDefined();
    expect(err.errors.country).toBeDefined();
  });

  test('should validate userId reference', async () => {
    const uniq = uniqueStr();
    const addressData = {
      userId: new mongoose.Types.ObjectId(),
      streetAddress: "456 Test Avenue",
      postalCode: "54321",
      city: "Another City",
      district: "Another District",
      province: "Another Province",
      country: "Another Country"
    };
    const address = new ShippingAddress(addressData);
    const savedAddress = await address.save();
    expect(savedAddress.userId.toString()).toBe(addressData.userId.toString());
    await ShippingAddress.deleteOne({ _id: savedAddress._id });
  });

  test('should handle long addresses', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const longAddress = "A".repeat(500);
    const addressData = {
      userId: user._id,
      streetAddress: longAddress,
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    };
    const address = new ShippingAddress(addressData);
    const savedAddress = await address.save();
    expect(savedAddress.streetAddress).toBe(longAddress);
    await ShippingAddress.deleteOne({ _id: savedAddress._id });
    await User.deleteOne({ _id: user._id });
  });

  test('should handle multiple addresses for same user', async () => {
    const uniq = uniqueStr();
    const user = await new User({
      fullname: `Test User ${uniq}`,
      email: `testuser${uniq}@example.com`,
      phoneNumber: `9988776${uniq.slice(-4)}`,
      password: "testpassword123",
      role: "Customer"
    }).save();

    const addressData1 = {
      userId: user._id,
      streetAddress: "123 Test Street",
      postalCode: "12345",
      city: "Test City",
      district: "Test District",
      province: "Test Province",
      country: "Test Country"
    };
    const addressData2 = {
      userId: user._id,
      streetAddress: "456 Test Avenue",
      postalCode: "54321",
      city: "Another City",
      district: "Another District",
      province: "Another Province",
      country: "Another Country"
    };
    const address1 = new ShippingAddress(addressData1);
    const address2 = new ShippingAddress(addressData2);
    const savedAddress1 = await address1.save();
    const savedAddress2 = await address2.save();
    expect(savedAddress1.userId.toString()).toBe(user._id.toString());
    expect(savedAddress2.userId.toString()).toBe(user._id.toString());
    expect(savedAddress1.streetAddress).not.toBe(savedAddress2.streetAddress);
    await ShippingAddress.deleteOne({ _id: savedAddress1._id });
    await ShippingAddress.deleteOne({ _id: savedAddress2._id });
    await User.deleteOne({ _id: user._id });
  });
}); 