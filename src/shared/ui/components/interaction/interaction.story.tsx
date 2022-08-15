import Roact from "@rbxts/roact";
import Interaction from "./interaction";

export = (target: Instance) => {
	const handle = Roact.mount(
		<Interaction KeyCode={Enum.KeyCode.F} ActionText="Activate" Alignment={Enum.HorizontalAlignment.Center} />,
		target,
		"Interaction",
	);
	return () => {
		Roact.unmount(handle);
	};
};
