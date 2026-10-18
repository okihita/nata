import { NextResponse } from "next/server";
import {
  getPersistedRoutines,
  savePersistedRoutine,
  recordPersistedExecution,
  updateRoutineStatus,
} from "@/lib/routines-db";
import type { AutonomousRoutine, RoutineExecutionRecord } from "@/lib/routines-data";

/**
 * GET /api/routines
 * Fetches all registered routines from Firestore or local fallback.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("businessId") || "default";

  const { routines, isLiveFirestore } = await getPersistedRoutines(businessId);
  return NextResponse.json({
    routines,
    isLiveFirestore,
  });
}

/**
 * POST /api/routines
 * Persists a new routine, records an execution run, or updates routine status (soft-delete).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, routine, execution, routineId, status, businessId = "default" } = body;

    if (action === "create_routine" && routine) {
      const ok = await savePersistedRoutine(routine as AutonomousRoutine, businessId);
      return NextResponse.json({ success: ok, mode: ok ? "firestore" : "memory" });
    }

    if (action === "record_execution" && routineId && execution) {
      const ok = await recordPersistedExecution(
        routineId,
        execution as RoutineExecutionRecord,
        businessId
      );
      return NextResponse.json({ success: ok, mode: ok ? "firestore" : "memory" });
    }

    if (action === "update_status" && routineId && status) {
      const ok = await updateRoutineStatus(routineId, status, businessId);
      return NextResponse.json({ success: ok, mode: ok ? "firestore" : "memory" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
