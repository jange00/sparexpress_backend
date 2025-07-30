const mongoose = require('mongoose');
const Specification = require('../models/specification');

function uniqueStr() {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}`;
}

describe('Specification Model Tests', () => {
  test('should create specification with valid data', async () => {
    const uniq = uniqueStr();
    const specData = {
      material: "Steel",
      position: "Front",
      fitment: "Universal",
      warranty: "2 years",
      dimensions: "10x5x3 cm",
      weight: "2kg",
      features: ["Feature1", "Feature2"],
      compatibility: ["BrandA", "BrandB"]
    };
    const spec = new Specification(specData);
    const savedSpec = await spec.save();
    expect(savedSpec.material).toBe("Steel");
    expect(savedSpec.position).toBe("Front");
    expect(savedSpec.fitment).toBe("Universal");
    expect(savedSpec.warranty).toBe("2 years");
    expect(savedSpec.dimensions).toBe("10x5x3 cm");
    expect(savedSpec.weight).toBe("2kg");
    expect(savedSpec.features).toEqual(["Feature1", "Feature2"]);
    expect(savedSpec.compatibility).toEqual(["BrandA", "BrandB"]);
    expect(savedSpec._id).toBeDefined();
    await Specification.deleteOne({ _id: savedSpec._id });
  });

  test('should create specification with minimal data', async () => {
    const uniq = uniqueStr();
    const specData = {
      material: "Plastic"
    };
    const spec = new Specification(specData);
    const savedSpec = await spec.save();
    expect(savedSpec.material).toBe("Plastic");
    await Specification.deleteOne({ _id: savedSpec._id });
  });

  test('should handle array fields', async () => {
    const uniq = uniqueStr();
    const specData = {
      material: "Aluminum",
      features: ["Lightweight", "Durable"],
      compatibility: ["BrandX", "BrandY"]
    };
    const spec = new Specification(specData);
    const savedSpec = await spec.save();
    expect(savedSpec.features).toEqual(["Lightweight", "Durable"]);
    expect(savedSpec.compatibility).toEqual(["BrandX", "BrandY"]);
    await Specification.deleteOne({ _id: savedSpec._id });
  });

  test('should allow missing optional fields', async () => {
    const uniq = uniqueStr();
    const specData = {
      material: "Rubber"
    };
    const spec = new Specification(specData);
    const savedSpec = await spec.save();
    expect(savedSpec.material).toBe("Rubber");
    await Specification.deleteOne({ _id: savedSpec._id });
  });
}); 