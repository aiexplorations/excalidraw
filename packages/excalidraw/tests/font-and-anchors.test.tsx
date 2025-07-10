import { DEFAULT_FONT_FAMILY, FONT_FAMILY } from "@excalidraw/common";
import { getElementAnchorPoints } from "@excalidraw/element";
import { ExcalidrawRectangleElement, ExcalidrawEllipseElement } from "@excalidraw/element/types";

describe("Font and Anchor Points Changes", () => {
  it("should have Helvetica as default font", () => {
    expect(DEFAULT_FONT_FAMILY).toBe(FONT_FAMILY.Helvetica);
  });

  it("should calculate anchor points for rectangle", () => {
    const rect: ExcalidrawRectangleElement = {
      type: "rectangle",
      id: "test-rect",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      angle: 0,
      strokeColor: "#000",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roundness: null,
      roughness: 1,
      opacity: 100,
      seed: 1,
      version: 1,
      versionNonce: 1,
      index: null,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    };

    const anchorPoints = getElementAnchorPoints(rect);
    
    // Should have 8 anchor points (4 corners + 4 edge centers)
    expect(anchorPoints).toHaveLength(8);
    
    // Check specific anchor points
    const topLeft = anchorPoints.find(p => p.position === "top-left");
    expect(topLeft).toBeDefined();
    expect(topLeft?.point[0]).toBe(100);
    expect(topLeft?.point[1]).toBe(100);
    expect(topLeft?.type).toBe("corner");

    const topCenter = anchorPoints.find(p => p.position === "top-center");
    expect(topCenter).toBeDefined();
    expect(topCenter?.point[0]).toBe(200); // x + width/2
    expect(topCenter?.point[1]).toBe(100);
    expect(topCenter?.type).toBe("edge-center");
  });

  it("should calculate anchor points for ellipse", () => {
    const ellipse: ExcalidrawEllipseElement = {
      type: "ellipse",
      id: "test-ellipse",
      x: 100,
      y: 100,
      width: 200,
      height: 100,
      angle: 0,
      strokeColor: "#000",
      backgroundColor: "transparent",
      fillStyle: "solid",
      strokeWidth: 2,
      strokeStyle: "solid",
      roundness: null,
      roughness: 1,
      opacity: 100,
      seed: 1,
      version: 1,
      versionNonce: 1,
      index: null,
      isDeleted: false,
      groupIds: [],
      frameId: null,
      boundElements: null,
      updated: Date.now(),
      link: null,
      locked: false,
    };

    const anchorPoints = getElementAnchorPoints(ellipse);
    
    // Should have 8 anchor points
    expect(anchorPoints).toHaveLength(8);
    
    // Check center point
    const centerX = ellipse.x + ellipse.width / 2;
    const centerY = ellipse.y + ellipse.height / 2;
    const rx = ellipse.width / 2;
    const ry = ellipse.height / 2;

    const topCenter = anchorPoints.find(p => p.position === "top-center");
    expect(topCenter).toBeDefined();
    expect(topCenter?.point[0]).toBe(centerX);
    expect(topCenter?.point[1]).toBe(centerY - ry);
    expect(topCenter?.type).toBe("edge-center");
  });
});