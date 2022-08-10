import Rodux from "@rbxts/rodux";
import { Scene } from "types/enums/scene";

export interface ActionSetScene extends Rodux.Action<"SetScene"> {
	scene: Scene;
}
