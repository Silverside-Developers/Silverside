import Roact from "@rbxts/roact";
import { useEffect, useState, withHooks } from "@rbxts/roact-hooked";
import { TextService, UserInputService } from "@rbxts/services";
import { Key } from "../key";

interface InteractionProps {
	KeyCode: Enum.KeyCode;
	ActionText: string;
	Alignment: Enum.HorizontalAlignment;
}

function Interaction(props: InteractionProps): Roact.Element {
	const textWidth = TextService.GetTextSize(props.ActionText, 18, Enum.Font.GothamMedium, new Vector2(1000, 1000)).X;

	// listen to UserInputService for key presses of this specific key
	const [isPressed, setIsPressed] = useState(false);

	// connect to UserInputService to listen for key presses
	// clean up when unmounted

	useEffect(() => {
		const connections = [
			UserInputService.InputBegan.Connect((input) => {
				if (input.KeyCode === props.KeyCode) {
					setIsPressed(true);
				}
			}),
			UserInputService.InputEnded.Connect((input) => {
				if (input.KeyCode === props.KeyCode) {
					setIsPressed(false);
				}
			}),
		];

		return () => {
			for (const connection of connections) {
				connection.Disconnect();
			}
		};
	});

	return (
		<frame Size={new UDim2(1, 0, 0, 24)} BackgroundTransparency={1}>
			<uilistlayout
				Padding={new UDim(0, 5)}
				FillDirection={Enum.FillDirection.Horizontal}
				HorizontalAlignment={props.Alignment}
			/>
			<Key KeyCode={props.KeyCode} IsPressed={isPressed} />
			<textlabel
				Size={UDim2.fromOffset(textWidth + 10, 24)}
				BackgroundTransparency={1}
				Text={props.ActionText}
				TextSize={18}
				Font={Enum.Font.GothamMedium}
				TextXAlignment={Enum.TextXAlignment.Center}
				TextYAlignment={Enum.TextYAlignment.Center}
				TextColor3={new Color3(1, 1, 1)}
			>
				<uistroke ApplyStrokeMode={Enum.ApplyStrokeMode.Contextual} Thickness={1} Color={new Color3(0, 0, 0)} />
			</textlabel>
		</frame>
	);
}

export default withHooks(Interaction);
