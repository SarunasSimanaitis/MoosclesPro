import { invalidateCached } from "../api/cache";
import { useRoutineStore } from "../stores/routineStore";

/** Clear account-scoped data whenever the signed-in user changes. */
export function clearPrivateClientState() {
  invalidateCached(
    "routines:list",
    "workout-sessions:list",
    "statistics:get",
    "dashboard:get",
  );
  useRoutineStore.getState().setCustomRoutines([]);
}
