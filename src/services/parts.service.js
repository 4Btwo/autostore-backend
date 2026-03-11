import {db} from "../config/firebase.js";

export async function getPartsByVehicle(vehicleId) {
  const partsSnap = await db.collection("parts").get();

  const parts = [];

  for (const partDoc of partsSnap.docs) {
    const compatSnap = await partDoc.ref
      .collection("compatibilities")
      .where("vehicleId", "==", vehicleId)
      .where("active", "==", true)
      .get();

    if (!compatSnap.empty) {
      parts.push({
        id: partDoc.id,
        ...partDoc.data(),
      });
    }
  }

  return parts;
}
export const findPartsByVehicle = async (vehicle) => {

  const parts = await getPartsByVehicle(vehicle);

  return parts;

};