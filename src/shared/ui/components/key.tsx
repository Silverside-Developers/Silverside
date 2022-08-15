import Roact from "@rbxts/roact";
import { TextService, UserInputService } from "@rbxts/services";

interface KeyProps {
	KeyCode: Enum.KeyCode;
	IsPressed: boolean;
}

export const Key: Roact.FunctionComponent<KeyProps> = (props) => {
	const keyString = UserInputService.GetStringForKeyCode(props.KeyCode);
	const keyWidth = TextService.GetTextSize(keyString, 18, Enum.Font.GothamBlack, new Vector2(1000, 1000)).X;

	return (
		<textlabel
			Size={UDim2.fromOffset(keyWidth + 10, 24)}
			BackgroundTransparency={0}
			BackgroundColor3={props.IsPressed ? new Color3(0, 0, 0) : new Color3(1, 1, 1)}
			Text={keyString}
			TextSize={18}
			Font={Enum.Font.GothamBlack}
			TextXAlignment={Enum.TextXAlignment.Center}
			TextYAlignment={Enum.TextYAlignment.Center}
			TextColor3={props.IsPressed ? new Color3(1, 1, 1) : new Color3(0, 0, 0)}
		>
			<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Thickness={1} Color={new Color3(0, 0, 0)} />
			<uicorner CornerRadius={new UDim(0, 5)} />
		</textlabel>
	);
};
