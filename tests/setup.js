require('dotenv').config();

// Set test environment
process.env.NODE_ENV = 'test';

// Increase timeout for tests
jest.setTimeout(30000);

// Mock external dependencies
jest.mock('../middlewares/fileUpload', () => ({
  single: jest.fn(() => (req, res, next) => next()),
  array: jest.fn(() => (req, res, next) => next()),
  fields: jest.fn(() => (req, res, next) => next())
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: 'test-message-id' })
  })
}));

jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: jest.fn().mockReturnValue('Mock AI response')
        }
      })
    })
  }))
}));

// Global test utilities
global.testUtils = {
  generateTestUser: () => ({
    fullname: `Test User ${Date.now()}_${Math.random().toString(36).substring(2)}`,
    email: `testuser${Date.now()}_${Math.random().toString(36).substring(2)}@example.com`,
    phoneNumber: `9988776${Date.now().toString().slice(-4)}`,
    password: "testpassword123",
    role: "Customer"
  }),

  generateTestAdmin: () => ({
    fullname: `Test Admin ${Date.now()}_${Math.random().toString(36).substring(2)}`,
    email: `testadmin${Date.now()}_${Math.random().toString(36).substring(2)}@example.com`,
    phoneNumber: `9988776${Date.now().toString().slice(-4)}`,
    password: "testpassword123",
    role: "Admin"
  }),

  generateTestCategory: () => ({
    title: `Test Category ${Date.now()}_${Math.random().toString(36).substring(2)}`,
    description: "Test category description",
    icon: "test-icon.png"
  }),

  generateTestSubcategory: (categoryId) => ({
    categoryId: categoryId,
    title: `Test Subcategory ${Date.now()}_${Math.random().toString(36).substring(2)}`,
    description: "Test subcategory description",
    icon: "test-sub-icon.png"
  }),

  generateTestBrand: (categoryId, subcategoryId) => ({
    title: `Test Brand ${Date.now()}_${Math.random().toString(36).substring(2)}`,
    count: 10,
    model: "Test Model",
    categoryId: categoryId,
    subcategoryId: subcategoryId
  }),

  generateTestProduct: (categoryId, subcategoryId, brandId) => ({
    name: `Test Product ${Date.now()}_${Math.random().toString(36).substring(2)}`,
    description: "Test product description",
    price: 99.99,
    categoryId: categoryId,
    subCategoryId: subcategoryId,
    brandId: brandId,
    stock: 10,
    shippingCharge: 5.00,
    images: ["test-image1.jpg", "test-image2.jpg"]
  })
};

// Setup database connection for tests
const mongoose = require('mongoose');

beforeAll(async () => {
  try {
    // Connect to test database with longer timeout
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spareXpress_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000
    });
    console.log('Test setup completed');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error('Database disconnection failed:', error);
  }
}); 