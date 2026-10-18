/**
 * Server-side Firestore persistence adapter for Autonomous Routines & Audit History.
 *
 * Uses Application Default Credentials (ADC) on Google Cloud Run.
 * If credentials or project ID are not available (e.g. offline local development),
 * operations gracefully fall back to in-memory demo data with zero crashes.
 */

import { Firestore } from "@google-cloud/firestore";
import {
  DEMO_ROUTINES,
  type AutonomousRoutine,
  type RoutineExecutionRecord,
} from "./routines-data";

let firestoreInstance: Firestore | null = null;
let firestoreDisabled = false;

function getDb(): Firestore | null {
  if (firestoreDisabled) return null;
  if (!firestoreInstance) {
    try {
      const projectId =
        process.env.GOOGLE_CLOUD_PROJECT ||
        process.env.GCP_PROJECT ||
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

      firestoreInstance = new Firestore({
        projectId: projectId || undefined,
        ignoreUndefinedProperties: true,
      });
    } catch {
      firestoreDisabled = true;
      return null;
    }
  }
  return firestoreInstance;
}

const COLLECTION_NAME = "routines";

/**
 * Fetch all registered routines for a given business/tenant.
 * Seeds default routines if collection is empty.
 */
export async function getPersistedRoutines(
  businessId = "default"
): Promise<{ routines: AutonomousRoutine[]; isLiveFirestore: boolean }> {
  const db = getDb();
  if (!db) {
    return { routines: DEMO_ROUTINES, isLiveFirestore: false };
  }

  try {
    const snapshot = await db
      .collection("businesses")
      .doc(businessId)
      .collection(COLLECTION_NAME)
      .get();

    if (snapshot.empty) {
      // Seed default demo routines into Firestore atomically
      const batch = db.batch();
      for (const routine of DEMO_ROUTINES) {
        const ref = db
          .collection("businesses")
          .doc(businessId)
          .collection(COLLECTION_NAME)
          .doc(routine.id);
        batch.set(ref, routine);
      }
      await batch.commit();
      return { routines: DEMO_ROUTINES, isLiveFirestore: true };
    }

    const routines: AutonomousRoutine[] = [];
    snapshot.forEach((doc) => {
      routines.push(doc.data() as AutonomousRoutine);
    });

    return { routines, isLiveFirestore: true };
  } catch {
    return { routines: DEMO_ROUTINES, isLiveFirestore: false };
  }
}

/**
 * Persist a newly created custom routine.
 */
export async function savePersistedRoutine(
  routine: AutonomousRoutine,
  businessId = "default"
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    await db
      .collection("businesses")
      .doc(businessId)
      .collection(COLLECTION_NAME)
      .doc(routine.id)
      .set(routine);
    return true;
  } catch {
    return false;
  }
}

/**
 * Record a new execution run in the routine's history.
 */
export async function recordPersistedExecution(
  routineId: string,
  execution: RoutineExecutionRecord,
  businessId = "default"
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const routineRef = db
      .collection("businesses")
      .doc(businessId)
      .collection(COLLECTION_NAME)
      .doc(routineId);

    const doc = await routineRef.get();
    if (!doc.exists) return false;

    const current = doc.data() as AutonomousRoutine;
    const updatedExecutions = [execution, ...(current.recentExecutions || [])];

    await routineRef.update({
      lastRunTime: execution.timestamp,
      lastRunStatus: execution.status,
      recentExecutions: updatedExecutions,
    });

    // Also persist into subcollection for high-scale time-series indexing
    await routineRef.collection("executions").doc(execution.id).set(execution);
    return true;
  } catch {
    return false;
  }
}

/**
 * Update routine status (e.g. soft-delete to 'archived', or restore to 'active'/'paused').
 */
export async function updateRoutineStatus(
  routineId: string,
  status: AutonomousRoutine["status"],
  businessId = "default"
): Promise<boolean> {
  const db = getDb();
  if (!db) return false;

  try {
    const routineRef = db
      .collection("businesses")
      .doc(businessId)
      .collection(COLLECTION_NAME)
      .doc(routineId);

    await routineRef.update({ status });
    return true;
  } catch {
    return false;
  }
}
