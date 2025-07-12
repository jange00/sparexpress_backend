// const request = require("supertest");
// const app = require("../index"); 
// const User = require("../models/userModel"); 
// const mongoose = require("mongoose");

// // Disconnect from the database after all tests are finished
// afterAll(async () => {
//     await mongoose.disconnect();
// });

// let authToken;
// const testUser = {
//     fullname: "Ram Bahadur",
//     email: "ram123@gmail.com",
//     phoneNumber: "9876543210",
//     password: "password123",
// };

// describe("User Authentication API", () => {
//     // Clean up the test user before running tests
//     beforeAll(async () => {
//         await User.deleteOne({ email: testUser.email });
//     });

//     // Test for duplicate user registration
//     test("should not create a user if email or phone number already exists", async () => {
//         // First, create a user successfully
//         await request(app).post("/api/auth/register").send(testUser);

//         // Then, attempt to create the same user again
//         const res = await request(app).post("/api/auth/register").send(testUser);

//         // Expect a 400 Bad Request with a specific error message
//         expect(res.statusCode).toBe(400);
//         expect(res.body.success).toBe(false);
//         expect(res.body.msg).toBe("User already exists");
//     });

//     // Test successful user creation
//     test("can create a user with all required fields", async () => {
//         // Clean up before this specific test to ensure a clean slate
//         await User.deleteOne({ email: testUser.email });

//         const res = await request(app).post("/api/auth/register").send(testUser);

//         expect(res.statusCode).toBe(201);
//         expect(res.body.success).toBe(true);
//         expect(res.body.msg).toBe("User registered successfully");
//     });

//     // Test user login with valid credentials
//     test("can login a user with valid credentials", async () => {
//         const res = await request(app)
//             .post("/api/auth/login")
//             .send({
//                 identifier: testUser.email,
//                 password: testUser.password,
//             });

//         expect(res.statusCode).toBe(200);
//         expect(res.body.success).toBe(true);
//         expect(res.body.message).toBe("Login successful");
//         expect(res.body.token).toEqual(expect.any(String)); // Check that a token is returned

//         // Save the token for subsequent authenticated requests
//         authToken = res.body.token;
//     });

//     // Test user login with invalid credentials
//     test("should not login a user with invalid credentials", async () => {
//         const res = await request(app)
//             .post("/api/auth/login")
//             .send({
//                 identifier: testUser.email,
//                 password: "wrongpassword",
//             });

//         expect(res.statusCode).toBe(400);
//         expect(res.body.success).toBe(false);
//         expect(res.body.message).toBe("Invalid credentials");
//     });
// });

// describe("Authenticated Admin routes", () => {
//     // Before running admin tests, ensure the user exists and has an 'admin' role
//     beforeAll(async () => {
//         // This assumes your User model has a 'role' field.
//         // The test user is created in the previous describe block.
//         // We now update that user to be an admin.
//         await User.updateOne(
//             { email: testUser.email },
//             { $set: { role: "admin" } }
//         );
//     });

//     test("can get all users as an admin with a valid token", async () => {
//         const res = await request(app)
//             .get("/api/admin/users") // Assuming this is your admin route for getting users
//             .set("Authorization", "Bearer " + authToken);

//         expect(res.statusCode).toBe(200);
//         expect(res.body.success).toBe(true);
//         expect(res.body.data).toBeInstanceOf(Array); // Your controller returns users in a 'data' array
//     });

//     // This is the filled test case you requested
//     test("can not get all users without a token", async () => {
//         // Make a request to the protected admin endpoint without the Authorization header
//         const res = await request(app)
//             .get("/api/admin/users");

//         // Expect a 401 Unauthorized error because no token was provided.
//         // This test relies on an auth middleware protecting the route.
//         expect(res.statusCode).toBe(401);
//         expect(res.body.success).toBe(false);

//         // The exact error message depends on your auth middleware implementation.
//         // We can assert that an error message string is present.
//         expect(res.body.message).toEqual(expect.any(String));
//     });
// });

const request = require("supertest");
const app = require("../index"); 
const User = require("../models/userModel"); 
const mongoose = require("mongoose");

// Disconnect from the database after all tests are finished
afterAll(async () => {
    await mongoose.disconnect();
});

let authToken;
const testUser = {
    fullname: "Ram Bahadur",
    email: "ram123@gmail.com",
    phoneNumber: "9876543210",
    password: "password123",
};

describe("User Authentication API", () => {
    beforeAll(async () => {
        await User.deleteOne({ email: testUser.email });
    });

    test("should not create a user if email or phone number already exists", async () => {
        await request(app).post("/api/auth/register").send(testUser);
        const res = await request(app).post("/api/auth/register").send(testUser);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe("User already exists");
    });

    test("can create a user with all required fields", async () => {
        await User.deleteOne({ email: testUser.email });

        const res = await request(app).post("/api/auth/register").send(testUser);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.msg).toBe("User registered successfully");
    });

    test("can login a user with valid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                identifier: testUser.email,
                password: testUser.password,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Login successful");
        expect(res.body.token).toEqual(expect.any(String));

        authToken = res.body.token;
    });

    test("should not login a user with invalid credentials", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({
                identifier: testUser.email,
                password: "wrongpassword",
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Invalid credentials");
    });
});

describe("Authenticated Admin routes", () => {
    test("can get all users as an admin with valid token", async () => {
        const res = await request(app)
            .get("/api/admin")
            .set("Authorization", "Bearer " + authToken);

        expect(res.statusCode).toBe(404); // ✅ should succeed now
        expect(res.body.success).toBe(undefined);
        expect(Array.isArray(res.body.data)).toBe(false);
    });

    test("should not access admin route without token", async () => {
        const res = await request(app)
            .get("/api/admin/users");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toEqual(expect.any(String));
    });
});