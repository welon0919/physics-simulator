import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type { EntityData, JointData, SceneData } from "./types";

type Mode = "edit" | "simulate";
/**
 * The current state of the scene for zustand to store
 */
interface SceneState {
  /** The actual scene data */
  scene: SceneData;
  /** The selected id of the entity or joint in the scene, null if nothing is selected */
  selectedId: string | null;
  /** edit or simulate mode */
  mode: Mode;
  /** Past snapshots of the scene for undo */
  past: SceneData[];

  /** Future snapshots of the scene for redo */
  future: SceneData[];

  /** Add an entity to the scene */
  addEntity: (entity: EntityData) => void;
  /** Update props for a single entity in the scene, identified by the id */
  updateProps: (id: string, props: Partial<EntityData["props"]>) => void;
  /** Move an entity in the scene, identified by the id */
  moveEntity: (id: string, x: number, y: number) => void;
  /** Remove an entity, identified by the id */
  removeEntity: (id: string) => void;
  /** Add a joint */
  addJoint: (joint: JointData) => void;
  /** Select an object, use null for id for unselecting */
  select: (id: string | null) => void;
  /** Set the mode */
  setMode: (mode: Mode) => void;
  /** Undo last change committed */
  undo: () => void;
  /** Redo last undo */
  redo: () => void;
}

export const useScene = create<SceneState>()(
  immer((set, get) => {
    const commit = (fn: (s: SceneData) => void) =>
      set((state) => {
        state.past.push(structuredClone(get().scene));
        state.future = [];
        fn(state.scene);
      });
    return {
      scene: {
        version: 1,
        settings: { gravity: 9.8, timeStep: 1 / 60, pixelsPerMeter: 50 },
        entities: [],
        joints: [],
      },
      selectedId: null,
      mode: "edit",
      past: [],
      future: [],
      addEntity: (e) =>
        commit((s) => {
          s.entities.push(e);
        }),
      updateProps: (id, props) =>
        commit((s) => {
          const e = s.entities.find((e) => e.id === id);
          if (e) Object.assign(e.props, props);
        }),
      moveEntity: (id, x, y) =>
        commit((s) => {
          const e = s.entities.find((e) => e.id === id);
          if (e) {
            e.x = x;
            e.y = y;
          }
        }),
      removeEntity: (id) =>
        commit((s) => {
          s.entities = s.entities.filter((e) => e.id !== id);
          s.joints = s.joints.filter((j) => j.a.entityId !== id && j.b.entityId !== id);
        }),
      addJoint: (j) =>
        commit((s) => {
          s.joints.push(j);
        }),

      select: (id) =>
        set((state) => {
          state.selectedId = id;
        }),
      setMode: (m) =>
        set((state) => {
          state.mode = m;
        }),

      undo: () =>
        set((state) => {
          const prev = state.past.pop();
          if (prev) {
            state.future.push(state.scene);
            state.scene = prev;
          }
        }),
      redo: () =>
        set((state) => {
          const next = state.future.pop();
          if (next) {
            state.past.push(state.scene);
            state.scene = next;
          }
        }),
    };
  }),
);
