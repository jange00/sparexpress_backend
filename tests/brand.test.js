// tests/brands.test.js

const request = require("supertest");
const app = require("../index");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const Brand = require("../models/brandModel");
const mongoose = require("mongoose");

let authToken;
let testCategoryId;
let testSubCategoryId;
let testBrandId;

const testUser = {
  fullname: "BrandAdmin",
  email: "brandadmin@example.com",
  phoneNumber: "9988776655",
  password: "testpassword",
};

beforeAll(async () => {
  await User.deleteOne({ email: testUser.email });
  await Category.deleteMany({ title: "Test Brand Category" });
  await SubCategory.deleteMany({ title: "Test Brand Subcategory" });
  await Brand.deleteMany({ title: "Test Brand" });

  await request(app).post("/api/auth/register").send(testUser);
  await User.updateOne({ email: testUser.email }, { role: "Admin" });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({ identifier: testUser.email, password: testUser.password });

  authToken = loginRes.body.token;
  if (!authToken) throw new Error("Failed to get auth token");

  const categoryRes = await request(app)
    .post("/api/admin/categories")
    .set("Authorization", `Bearer ${authToken}`)
    .send({ title: "Test Brand Category" });

  testCategoryId = categoryRes.body.data._id;

  const subCategoryRes = await request(app)
    .post("/api/admin/subcategories")
    .set("Authorization", `Bearer ${authToken}`)
    .send({
      categoryId: testCategoryId,
      title: "Test Brand Subcategory",
      description: "Testing subcategory",
      icon: "icon.png",
    });

  testSubCategoryId = subCategoryRes.body.data._id;
});

afterAll(async () => {
  await Brand.deleteMany({ title: "Test Brand" });
  await SubCategory.deleteMany({ _id: testSubCategoryId });
  await Category.deleteMany({ _id: testCategoryId });
  await User.deleteOne({ email: testUser.email });
  await mongoose.disconnect();
});

describe("Brand API", () => {
  test("should not create brand without auth token", async () => {
    const res = await request(app).post("/api/admin/brands").send({
      title: "Test Brand",
      count: 5,
      model: "Model X",
      categoryId: testCategoryId,
      subcategoryId: testSubCategoryId,
    });

    expect(res.statusCode).toBe(401);
  });

  test("should not create brand with missing required fields", async () => {
    const res = await request(app)
      .post("/api/admin/brands")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "", count: "", categoryId: "", subcategoryId: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should create brand with valid data and token", async () => {
    const res = await request(app)
      .post("/api/admin/brands")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Brand",
        count: 10,
        model: "Model A",
        categoryId: testCategoryId,
        subcategoryId: testSubCategoryId,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test Brand");

    testBrandId = res.body.data._id;
  });

  test("should fetch all brands", async () => {
    const res = await request(app)
      .get("/api/admin/brands")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should return 400 for invalid brand ID", async () => {
    const res = await request(app)
      .get("/api/admin/brands/invalid-id")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(400);
  });

  test("should return 404 for non-existent brand", async () => {
    const fakeId = "6123456789abcdef01234567";
    const res = await request(app)
      .get(`/api/admin/brands/${fakeId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });

  test("should fetch brand by valid ID", async () => {
    const res = await request(app)
      .get(`/api/admin/brands/${testBrandId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(testBrandId);
  });

  test("should not update brand without auth token", async () => {
    const res = await request(app).put(`/api/admin/brands/${testBrandId}`).send({
      title: "Updated Brand",
    });

    expect(res.statusCode).toBe(401);
  });

  test("should update brand with valid data and token", async () => {
    const res = await request(app)
      .put(`/api/admin/brands/${testBrandId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Updated Brand" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Brand");
  });

  test("should not delete brand without auth token", async () => {
    const res = await request(app).delete(`/api/admin/brands/${testBrandId}`);
    expect(res.statusCode).toBe(401);
  });

  test("should delete brand with valid token", async () => {
    const res = await request(app)
      .delete(`/api/admin/brands/${testBrandId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should return 404 when getting deleted brand", async () => {
    const res = await request(app)
      .get(`/api/admin/brands/${testBrandId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
});
