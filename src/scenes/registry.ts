import * as pixi from "pixi.js";
import * as planck from "planck";

import type { Anchor, EntityData, EntityType } from "./types";

/**
 * A definition of a component, with the properties it should have and how to draw it
 * @param P The interface for the properties of this type of component
 */
export interface ComponentDef<P> {
  /** The type of the component */
  type: EntityType;
  /** The label (name) of the component */
  label: string;
  /** The default parameters when dragged into the scene */
  defaults: P;
  /**
   * The anchors that joints can connect to
   * It is a function since anchors' relative position varies for objects (e.g. different sizes)
   */
  anchors: (e: EntityData) => Anchor[];
  /**
   * Receives the world and build the entity into a planck world's bodies
   * Some objects have more than one body (e.g. car), so it returns an array
   */
  build: (world: planck.World, e: EntityData) => planck.Body[];
  /**
   * Receives the canvas and bodies, then renders it for preview
   */
  draw: (g: pixi.Graphics, e: EntityData, bodies: planck.Body[]) => void;
}
