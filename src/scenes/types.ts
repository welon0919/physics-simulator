/**
 * The settings of a scene
 */
export interface SceneSettings {
  /** The gravitational pull in the scene */
  gravity: number;
  /** Time between each step (update), in milliseconds */
  timeStep: number;
  /** How many pixels to draw for each meter */
  pixelsPerMeter: number;
}
/**
 * A scene of the physics engine
 */
export interface SceneData {
  version: 1;
  /**  Settings for the scene */
  settings: SceneSettings;
  /** The entities in the scene */
  entities: EntityData[];
  /** The joints that join entities together in a string*/
  joints: JointData[];
}

/** The type of an entity */
export type EntityType = "block" | "ball" | "car" | "pulley" | "spring";

/** Represents a single entity instance in a scene */
export interface EntityData {
  /** A unique id of the entity */
  id: string;
  /** The type of the entity */
  type: EntityType;
  /** The x position of the entity in meters */
  x: number; // meters
  /** The y coordinate of the entity in meters */
  y: number; // meters
  /** The angle that the entity has rotated counterclockwise, in radians*/
  angle: number; // radians
  /** The properties of the entity (mass, friction, width height etc.) */
  props: Record<string, number | boolean>;
}

/** Type of a joint */
export type JointType = "rope" | "pulley" | "weld" | "hinge" | "spring";

/** A joint that joins two entities together */
export interface JointData {
  /** A unique id for the joint */
  id: string;
  /** The type of the joint */
  type: JointType;
  /** The first entity that the joint joins */
  a: {
    /** The id of the entity */
    entityId: string;
    /** The name of the anchor that the joint connects to*/
    anchor: string;
  };
  /** The second object that the joint joins */
  b: {
    /** The id of the entity */
    entityId: string;
    /** The name of the anchor that the joint connects to*/
    anchor: string;
  };
  /** The properties of the joint */
  props: Record<string, number | boolean>;
}

/** An anchor for the joint to connect to */
export interface Anchor {
  /** The name of the position of the anchor (e.g. left, right, top) */
  name: string;
  /** The anchor's position relative to the entity in meters */
  x: number;
  /** The anchor's position relative to the entity in meters , +y is upward*/
  y: number;
  /** Limits what type the anchor can connect to */
  accepts?: JointType[];
}
