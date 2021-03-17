export const objectToVector = (c) => ({ x: c.x, y: c.y });

export const addVectors = (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });

export const subtractVectors = (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y });

export const vectorScalarMult = (v, s) => ({ x: v.x * s, y: v.y * s });

export const perpendicularClockwise = (v) => ({ x: -v.y, y: v.x });

export const perpendicularCounterClockwise = (v) => ({ x: v.y, y: -v.x });

export const magnitude = (v) => Math.sqrt(sqMagnitude(v));

export const sqMagnitude = (v) => v.x ** 2 + v.y ** 2;

export const normalize = (v) => vectorScalarMult(v, 1 / (magnitude(v) + 0.0001));

export const distance = (v1, v2) => Math.sqrt(sqDistance(sqDistance));

export const sqDistance = (v1, v2) => (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;

export const negatedVector = (v) => ({ x: -v.x, y: -v.y });

export const crossProduct2D = (v1, v2) => v1.x * v2.y - v1.y * v2.x;