import type { GlobalPoint } from "@excalidraw/math";
import { pointRotateRads, pointFrom } from "@excalidraw/math";
import type {
  ExcalidrawBindableElement,
  ExcalidrawRectanguloidElement,
  ExcalidrawEllipseElement,
  ExcalidrawDiamondElement,
} from "./types";
import { isRectanguloidElement } from "./typeChecks";

export type AnchorPoint = {
  type: "corner" | "edge-center";
  position: "top-left" | "top-center" | "top-right" | "center-left" | "center-right" | "bottom-left" | "bottom-center" | "bottom-right";
  point: GlobalPoint;
};

/**
 * Calculate anchor points for a bindable element.
 * These are specific points on the element where arrows can snap to for precise connections.
 */
export const getElementAnchorPoints = (
  element: ExcalidrawBindableElement,
): AnchorPoint[] => {
  const anchorPoints: AnchorPoint[] = [];
  
  // Get element center for calculations
  const centerX = element.x + element.width / 2;
  const centerY = element.y + element.height / 2;
  
  if (element.type === "rectangle" || element.type === "diamond") {
    // For rectangles and diamonds, provide 8 anchor points:
    // 4 corners + 4 edge centers
    
    const points = [
      // Corners
      { type: "corner" as const, position: "top-left" as const, x: element.x, y: element.y },
      { type: "corner" as const, position: "top-right" as const, x: element.x + element.width, y: element.y },
      { type: "corner" as const, position: "bottom-left" as const, x: element.x, y: element.y + element.height },
      { type: "corner" as const, position: "bottom-right" as const, x: element.x + element.width, y: element.y + element.height },
      
      // Edge centers
      { type: "edge-center" as const, position: "top-center" as const, x: centerX, y: element.y },
      { type: "edge-center" as const, position: "center-right" as const, x: element.x + element.width, y: centerY },
      { type: "edge-center" as const, position: "bottom-center" as const, x: centerX, y: element.y + element.height },
      { type: "edge-center" as const, position: "center-left" as const, x: element.x, y: centerY },
    ];
    
    // Apply rotation if the element is rotated
    points.forEach(({ type, position, x, y }) => {
      let point = pointFrom(x, y) as GlobalPoint;
      if (element.angle !== 0) {
        point = pointRotateRads(point, pointFrom(centerX, centerY) as GlobalPoint, element.angle) as GlobalPoint;
      }
      anchorPoints.push({ type, position, point });
    });
    
  } else if (element.type === "ellipse") {
    // For ellipses, provide 8 anchor points:
    // 4 cardinal directions + 4 diagonal points
    
    const rx = element.width / 2;
    const ry = element.height / 2;
    
    const points = [
      // Cardinal directions
      { type: "edge-center" as const, position: "top-center" as const, x: centerX, y: centerY - ry },
      { type: "edge-center" as const, position: "center-right" as const, x: centerX + rx, y: centerY },
      { type: "edge-center" as const, position: "bottom-center" as const, x: centerX, y: centerY + ry },
      { type: "edge-center" as const, position: "center-left" as const, x: centerX - rx, y: centerY },
      
      // Diagonal points (at 45-degree angles)
      { type: "corner" as const, position: "top-right" as const, x: centerX + rx * Math.cos(Math.PI / 4), y: centerY - ry * Math.sin(Math.PI / 4) },
      { type: "corner" as const, position: "bottom-right" as const, x: centerX + rx * Math.cos(Math.PI / 4), y: centerY + ry * Math.sin(Math.PI / 4) },
      { type: "corner" as const, position: "bottom-left" as const, x: centerX - rx * Math.cos(Math.PI / 4), y: centerY + ry * Math.sin(Math.PI / 4) },
      { type: "corner" as const, position: "top-left" as const, x: centerX - rx * Math.cos(Math.PI / 4), y: centerY - ry * Math.sin(Math.PI / 4) },
    ];
    
    // Apply rotation if the element is rotated
    points.forEach(({ type, position, x, y }) => {
      let point = pointFrom(x, y) as GlobalPoint;
      if (element.angle !== 0) {
        point = pointRotateRads(point, pointFrom(centerX, centerY) as GlobalPoint, element.angle) as GlobalPoint;
      }
      anchorPoints.push({ type, position, point });
    });
  }
  
  return anchorPoints;
};

/**
 * Find the closest anchor point to a given position.
 */
export const getClosestAnchorPoint = (
  element: ExcalidrawBindableElement,
  targetPoint: GlobalPoint,
  maxDistance: number = 20,
): AnchorPoint | null => {
  const anchorPoints = getElementAnchorPoints(element);
  
  let closestPoint: AnchorPoint | null = null;
  let closestDistance = maxDistance;
  
  for (const anchorPoint of anchorPoints) {
    const distance = Math.sqrt(
      Math.pow(anchorPoint.point[0] - targetPoint[0], 2) +
      Math.pow(anchorPoint.point[1] - targetPoint[1], 2)
    );
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = anchorPoint;
    }
  }
  
  return closestPoint;
};

/**
 * Check if a point is near any anchor point of an element.
 */
export const isNearAnchorPoint = (
  element: ExcalidrawBindableElement,
  targetPoint: GlobalPoint,
  snapDistance: number = 20,
): boolean => {
  return getClosestAnchorPoint(element, targetPoint, snapDistance) !== null;
};