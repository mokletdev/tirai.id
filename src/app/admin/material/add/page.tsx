import { findModels } from "@/utils/database/model.query";
import MaterialForm from "../components/MaterialForm";

export default async function AddMaterial() {
  const models = await findModels();

  return <MaterialForm models={models} />;
}
