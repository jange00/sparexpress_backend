const request = require("supertest");
const app = require("../index");
const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");
const mongoose = require("mongoose");

let authToken;
let testCategoryId;
let testSubCategoryId;

const testUser = {
  fullname: "SubAdmin",
  email: "subadmin@example.com",
  phoneNumber: "9998887777",
  password: "testpassword",
};

beforeAll(async () => {
  await User.deleteOne({ email: testUser.email });
  await Category.deleteMany({ title: "Test Category" });
  await SubCategory.deleteMany({ title: "Test Subcategory" });

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
    .send({ title: "Test Category" });

  testCategoryId = categoryRes.body.data._id;
});

afterAll(async () => {
  await SubCategory.deleteMany({ title: "Test Subcategory" });
  await Category.deleteMany({ _id: testCategoryId });
  await User.deleteOne({ email: testUser.email });
  await mongoose.disconnect();
});

describe("Subcategory API", () => {
  test("should not create subcategory without auth token", async () => {
    const res = await request(app).post("/api/admin/subcategories").send({
      categoryId: testCategoryId,
      title: "Test Subcategory",
      description: "Test Description",
      icon: "test-icon.png",
    });

    expect(res.statusCode).toBe(401);
  });

  test("should not create subcategory with missing required fields", async () => {
    const res = await request(app)
      .post("/api/admin/subcategories")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "", description: "", icon: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test("should create subcategory with valid data and token", async () => {
    const res = await request(app)
      .post("/api/admin/subcategories")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        categoryId: testCategoryId,
        title: "Test Subcategory",
        description: "Test Description",
        icon: "icon.png",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test Subcategory");

    testSubCategoryId = res.body.data._id;
  });

  test("should fetch all subcategories", async () => {
    const res = await request(app)
      .get("/api/admin/subcategories")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test("should return 400 for invalid subcategory ID", async () => {
    const res = await request(app)
      .get("/api/admin/subcategories/invalid-id")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(400);
  });

  test("should return 404 for non-existent subcategory", async () => {
    const fakeId = "6123456789abcdef01234567";
    const res = await request(app)
      .get(`/api/admin/subcategories/${fakeId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });

  test("should fetch subcategory by valid ID", async () => {
    const res = await request(app)
      .get(`/api/admin/subcategories/${testSubCategoryId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(testSubCategoryId);
  });

  test("should not update subcategory without auth token", async () => {
    const res = await request(app).put(`/api/admin/subcategories/${testSubCategoryId}`).send({
      title: "Updated Subcategory",
    });

    expect(res.statusCode).toBe(401);
  });

  test("should update subcategory with valid data and token", async () => {
    const res = await request(app)
      .put(`/api/admin/subcategories/${testSubCategoryId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ title: "Updated Subcategory" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated Subcategory");
  });

  test("should not delete subcategory without auth token", async () => {
    const res = await request(app).delete(`/api/admin/subcategories/${testSubCategoryId}`);
    expect(res.statusCode).toBe(401);
  });

  test("should delete subcategory with valid token", async () => {
    const res = await request(app)
      .delete(`/api/admin/subcategories/${testSubCategoryId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("should return 404 when getting deleted subcategory", async () => {
    const res = await request(app)
      .get(`/api/admin/subcategories/${testSubCategoryId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toBe(404);
  });
});
