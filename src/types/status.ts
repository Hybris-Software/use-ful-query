import { Status } from "../utils/constants";

export type TStatus = (typeof Status)[keyof typeof Status];
