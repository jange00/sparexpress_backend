const request = require("supertest");
const app = require("../index");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");

let authToken;
let testCategoryId;

const testUser = {
  fullname: "Test Admin",
  email: "testadmin@example.com",
  phoneNumber: "9999999999",
  password: "testpassword",
};

const testCategory = {
  title: "Test Category",
  isTestData: true, // flag to identify test data for safe cleanup
};

beforeAll(async () => {
  // Cleanup test user and category before tests run
  await User.deleteOne({ email: testUser.email });
  await Category.deleteMany({ isTestData: true });

  // Register user
  await request(app).post("/api/auth/register").send(testUser);

  // Make user an admin
  await User.updateOne({ email: testUser.email }, { role: "Admin" });

  // Login user to get token
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ identifier: testUser.email, password: testUser.password });
  authToken = loginRes.body.token;
  if (!authToken) throw new Error("Failed to get auth token");
});

afterAll(async () => {
  // Cleanup test categories and users
  await Category.deleteMany({ isTestData: true });
  await User.deleteOne({ email: testUser.email });
  await mongoose.disconnect();
});

describe("Category API", () => {
  test("should not create category without auth token", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .send({ title: "Unauthorized Category" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("should not create category with missing title", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .set("Authorization", "Bearer " + authToken)
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should create category with valid data", async () => {
    const res = await request(app)
      .post("/api/admin/categories")
      .set("Authorization", "Bearer " + authToken)
      .send(testCategory);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(testCategory.title);

    testCategoryId = res.body.data._id; // save for other tests
  });

  test("should fetch all categories", async () => {
    const res = await request(app)
      .get("/api/admin/categories")
      .set("Authorization", "Bearer " + authToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should return 400 for invalid category ID", async () => {
    const res = await request(app)
      .get("/api/admin/categories/invalidID")
      .set("Authorization", "Bearer " + authToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should return 404 for non-existent category", async () => {
    const fakeId = "6123456789abcdef01234567"; // valid ObjectId format but non-existent
    const res = await request(app)
      .get(`/api/admin/categories/${fakeId}`)
      .set("Authorization", "Bearer " + authToken);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("should fetch category by valid ID", async () => {
    const res = await request(app)
      .get(`/api/admin/categories/${testCategoryId}`)
      .set("Authorization", "Bearer " + authToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(testCategory.title);
  });

  test("should not update category without auth token", async () => {
    const res = await request(app)
      .put(`/api/admin/categories/${testCategoryId}`)
      .send({ title: "Updated Title" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("should not update category with empty title", async () => {
    const res = await request(app)
      .put(`/api/admin/categories/${testCategoryId}`)
      .set("Authorization", "Bearer " + authToken)
      .send({ title: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should update category with valid data and token", async () => {
    const updatedTitle = "Updated Test Category";
    const res = await request(app)
      .put(`/api/admin/categories/${testCategoryId}`)
      .set("Authorization", "Bearer " + authToken)
      .send({ title: updatedTitle });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(updatedTitle);
  });

  test("should not delete category without auth token", async () => {
    const res = await request(app)
      .delete(`/api/admin/categories/${testCategoryId}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  test("should delete category with valid token", async () => {
    const res = await request(app)
      .delete(`/api/admin/categories/${testCategoryId}`)
      .set("Authorization", "Bearer " + authToken);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should return 404 when getting deleted category", async () => {
    const res = await request(app)
      .get(`/api/admin/categories/${testCategoryId}`)
      .set("Authorization", "Bearer " + authToken);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
