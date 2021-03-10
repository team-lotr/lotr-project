import * as d3 from "d3";
import _ from "underscore";

const drawControlPoints = false;
const drawPoints = false;
const useCurves = true;

// Function for generating a path string from the selection of a path.
// { character: {}, timeline: {} }
export const drawTimeline = (pathData, currentTime) => {
    const coordinates = pathData.timeline;

    // If there is only a single coordinate left, there is nothing to draw.
    if (coordinates.length < 1) return;

    // Initialize D3 path serializer.
    const path = d3.path();
    path.moveTo(coordinates[0].x, coordinates[0].y);

    // Decide whether to draw curves or lines.
    if (useCurves) {
        // Initialize empty list of control points.
        let controlPoints = [];

        if (drawPoints) {
            coordinates.forEach(coordinate => d3
                .select("#zoomContainer")
                .append("circle")
                .attr("cx", coordinate.x)
                .attr("cy", coordinate.y)
                .attr("r", 10)
                .style("fill", "cyan"));
        }

        // Convert coordinates to position vectors and iterate to make control points.
        coordinates
            .map((coordinate) => coordinateToVector(coordinate))
            .forEach(function(inner, i, array) {
                if (i == 0 || i == array.length - 1) return; // Do nothing for endpoints (outer points).

                // "inner" is an inner point, meaning it is not an endpoint.
                const left = array[i - 1]; // The point before inner.
                const right = array[i + 1]; // The point after inner.

                // See if the point before is to the left of the point after.
                const leftIsLeft = left.x <= right.x;

                // See if the line between left and right is above inner.
                const innerIsAbove = right.y > inner.y && left.y > inner.y;

                // Find vector from right to left.
                const rightToLeft = subtractVectors(left, right);
                const rightTowardsLeft = normalized(rightToLeft);

                // The vector from inner to the line between left and right, orthogonal to that line
                // is clockwise or counter clockwise perpendicular from the right-left vector depending on
                // the exclusive or of leftIsLeft and innerIsAbove.
                const innerTowardsCenter = xor(leftIsLeft, innerIsAbove) ?
                    perpendicularClockwise(rightTowardsLeft) :
                    perpendicularCounterClockwise(rightTowardsLeft);

                // Find intersection between ray from inner orthogonal to the right-left vector using method
                // as suggested in: https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/565282#565282
                const distanceAlongToCenter =
                    crossProduct2D(subtractVectors(right, inner), rightTowardsLeft) /
                    (crossProduct2D(innerTowardsCenter, rightTowardsLeft) + 0.0001);

                // Find the center point that is inner "projected" onto the right-left vector.
                const center = addVectors(
                    inner,
                    vectorScalarMult(innerTowardsCenter, distanceAlongToCenter)
                );

                // Find a tenth of the distance between right and left.
                const distance = magnitude(rightToLeft) * 0.1;

                // The vector from inner to center.
                const innerToCenter = subtractVectors(center, inner);

                // Calculate the offset vector from inner perpendicular to inner-center vector clockwise.
                const clockwiseOffsetVector = vectorScalarMult(
                    normalized(perpendicularClockwise(innerToCenter)),
                    distance
                );

                // Find points offset from inner perpendicular clockwise and counter clockwise the distance calculated earlier.
                const clockwiseOffsetPoint = addVectors(inner, clockwiseOffsetVector);
                const counterClockwiseOffsetPoint = addVectors(
                    inner,
                    negatedVector(clockwiseOffsetVector)
                );

                // Add the control points in an order depending on the distance from left.
                // One is always the clockwise offset point and the other is always the opposite.
                _.sortBy(
                        [
                            { point: clockwiseOffsetPoint, distanceToLeft: sqDistance(clockwiseOffsetPoint, left) },
                            { point: counterClockwiseOffsetPoint, distanceToLeft: sqDistance(counterClockwiseOffsetPoint, left) }
                        ],
                        element => element.distanceToLeft)
                    .forEach(element => controlPoints.push(element.point));
            });

        // Createa one control point for each of the endpoints.
        const firstPoint = { x: coordinates[0].x, y: coordinates[0].y };
        const lastPoint = {
            x: coordinates[coordinates.length - 1].x,
            y: coordinates[coordinates.length - 1].y,
        };

        if (controlPoints.length > 0) {
            // If there are control points, place the endpoint control points between the endpoint and its nearest control point.
            controlPoints.splice(
                0,
                0,
                addVectors(
                    firstPoint,
                    vectorScalarMult(subtractVectors(controlPoints[0], firstPoint), 0.5)
                )
            );
            controlPoints.push(
                addVectors(
                    lastPoint,
                    vectorScalarMult(subtractVectors(controlPoints[controlPoints.length - 1], lastPoint), 0.5)
                )
            );
        } else {
            // If there are no control points, place the control points 0.25 and 0.75 of the distance between the endpoints.
            controlPoints.push(
                addVectors(
                    firstPoint,
                    vectorScalarMult(subtractVectors(lastPoint, firstPoint), 0.25)
                )
            );
            controlPoints.push(
                addVectors(
                    firstPoint,
                    vectorScalarMult(subtractVectors(lastPoint, firstPoint), 0.75)
                )
            );
        }

        if (drawControlPoints) {
            controlPoints.forEach((element, i, array) => d3.select("#zoomContainer").append("circle").attr("cx", element.x).attr("cy", element.y).attr("r", 10).attr("fill", d3.interpolateBlues(i / array.length)));
        }

        // Create path instructions from the control points and the coordinates.
        coordinates.forEach(function(coordinate, i) {
            if (i == 0) return;

            path.bezierCurveTo(
                controlPoints[(i - 1) * 2].x,
                controlPoints[(i - 1) * 2].y,
                controlPoints[(i - 1) * 2 + 1].x,
                controlPoints[(i - 1) * 2 + 1].y,
                coordinate.x,
                coordinate.y
            );
        });
    } else {
        // Create line instructions from the coordinates.
        coordinates.forEach((coordinate) =>
            path.lineTo(coordinate.x, coordinate.y)
        );
    }

    return path.toString();
};

// Helper functions for vector math and logical operators.

const coordinateToVector = (c) => ({ x: c.x, y: c.y });

const addVectors = (v1, v2) => ({ x: v1.x + v2.x, y: v1.y + v2.y });

const subtractVectors = (v1, v2) => ({ x: v1.x - v2.x, y: v1.y - v2.y });

const vectorScalarMult = (v, s) => ({ x: v.x * s, y: v.y * s });

const perpendicularClockwise = (v) => ({ x: -v.y, y: v.x });

const perpendicularCounterClockwise = (v) => ({ x: v.y, y: -v.x });

const magnitude = (v) => Math.sqrt(v.x ** 2 + v.y ** 2);

const normalized = (v) => vectorScalarMult(v, 1 / (magnitude(v) + 0.0001));

const distance = (v1, v2) => Math.sqrt(sqDistance(sqDistance));

const sqDistance = (v1, v2) => (v1.x - v2.x) ** 2 + (v1.y - v2.y) ** 2;

const negatedVector = (v) => ({ x: -v.x, y: -v.y });

const crossProduct2D = (v1, v2) => v1.x * v2.y - v1.y * v2.x;

const xor = (a, b) => (a || b) && !(a && b);
