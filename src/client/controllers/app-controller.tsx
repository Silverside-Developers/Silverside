import { Controller, Modding, OnInit } from "@flamework/core";
import { Constructor } from "@flamework/core/out/types";
import Log from "@rbxts/log";
import Roact from "@rbxts/roact";
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux";
import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { ClientStore, IClientStore, StoreActions } from "client/rodux/rodux";
import { Scene } from "types/enums/scene";
import { SceneController } from "./scene-controller";

const noop = () => {};

export type StoreDispatch = Rodux.Dispatch<StoreActions>;
export interface IAppConfig {
	name: string;
	requiredScenes?: Scene[];
	tag?: string;
	displayOrder?: number;
	ignoreGuiInset?: boolean;
	mapStateToProps?: (state: IClientStore) => unknown;
	mapDispatchToProps?: (dispatch: StoreDispatch) => unknown;
}

export const App = Modding.createDecorator<[IAppConfig]>("Class", (descriptor, [{ name }]) => {});

@Controller({})
export class AppController implements OnInit {
	private apps = new Map<Constructor, IAppConfig>();
	private appHandles = new Map<Constructor, Roact.Tree>();

	private playerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui")!;

	constructor(private readonly sceneController: SceneController) {}

	onInit() {
		this.sceneController.onSceneChanged.Connect((newScene, oldScene) => this.onSceneChanged(newScene, oldScene));

		const constructors = Modding.getDecorators<typeof App>();
		for (const { object, arguments: args } of constructors) {
			const config = args[0];
			this.apps.set(object, config);
		}
	}

	private onSceneChanged(newScene: Scene, oldScene?: Scene) {
		for (const [object, config] of this.apps) {
			// if open now and was not open before, show app
			// if closed now and was open before, hide app
			const openNow = config.requiredScenes?.includes(newScene);
			const openBefore = oldScene !== undefined ? config.requiredScenes?.includes(oldScene) : false;

			// if open now, print debug message
			if (openNow) {
				Log.Info(`Showing {Name}`, config.name);
			}

			if (openNow && !openBefore) {
				this.showApp(object);
			} else if (!openNow && openBefore) {
				this.hideApp(object);
			}
		}
	}

	private showApp(object: Constructor) {
		const config = this.apps.get(object)!;

		let component = object as unknown as Roact.FunctionComponent;
		// if map state to props or map dispatch to props is defined, connect it with roact rodux
		if (config.mapStateToProps || config.mapDispatchToProps) {
			const mapStateToProps = config.mapStateToProps || noop;
			const mapDispatchToProps = config.mapDispatchToProps || noop;

			component = RoactRodux.connect(
				(state: IClientStore) => mapStateToProps(state),
				(dispatch: StoreDispatch) => mapDispatchToProps(dispatch),
			)(component);
		}

		const content = <StoreProvider store={ClientStore}>{Roact.createElement(component)}</StoreProvider>;

		const handle = Roact.mount(
			<screengui
				Key={config.name}
				DisplayOrder={config.displayOrder}
				IgnoreGuiInset={config.ignoreGuiInset}
				ResetOnSpawn={false}
				ZIndexBehavior={Enum.ZIndexBehavior.Sibling}
			>
				{content}
			</screengui>,
			this.playerGui,
			config.name,
		);

		this.appHandles.set(object, handle);
		Log.Debug(`Mounted new app instance "{Name}"`, config.name);
	}

	private hideApp(object: Constructor) {
		const handle = this.appHandles.get(object);
		if (!handle) return Log.Warn(`Could not find handle for {@Object}`, object);
		Roact.unmount(handle);
	}
}
