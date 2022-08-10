import Roact from "@rbxts/roact";
import { App } from "client/controllers/app-controller";
import { Scene } from "types/enums/scene";

interface IProps {}

@App({
	name: "menu",
	requiredScenes: [Scene.Menu],
	ignoreGuiInset: true,
})
export class MenuApp extends Roact.PureComponent<IProps> {
	public render(): Roact.Element | undefined {
		return <></>;
	}
}
