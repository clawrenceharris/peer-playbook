import { ColorToken } from "../../domain/value-objects/ColorToken";

export type PhaseIntentDTO = {
  id: string;
  label: string;
  colorToken: ColorToken;
  description: string;
};
