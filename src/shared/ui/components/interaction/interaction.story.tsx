import Roact from "@rbxts/roact";
import { Interaction } from "./interaction";

export = (target: Frame) => {
	const mount = Roact.mount(<Interaction KeyCode={Enum.KeyCode.E} ActionText="Interact" />, target, "YourComponent");
	return () => Roact.unmount(mount);
};
