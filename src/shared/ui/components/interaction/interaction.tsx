import Roact from "@rbxts/roact";
import { useState } from "@rbxts/roact-hooked";

interface InteractionProps {
	KeyCode: Enum.KeyCode;
	ActionText: string;
	IsPressed?: boolean;
}

export const Interaction: Roact.FunctionComponent<InteractionProps> = (props) => {
	return <frame></frame>;
};
