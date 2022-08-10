import { Controller, Flamework, OnInit, Reflect } from "@flamework/core";
import Log from "@rbxts/log";
import Roact from "@rbxts/roact";
import RoactRodux, { StoreProvider } from "@rbxts/roact-rodux";
import Rodux from "@rbxts/rodux";
import { Players } from "@rbxts/services";
import { ClientStore, IClientStore, StoreActions } from "client/rodux/rodux";
import { Scene } from "types/enums/scene";
import { DecoratorMetadata } from "types/interfaces/flamework";
import { SceneController } from "./scene-controller";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassDecorator = (ctor: any) => any;
type Constructor<T = Roact.Component> = new (...args: never[]) => T;

const noop = () => {};

export type StoreDispatch = Rodux.Dispatch<StoreActions>;

export interface IAppConfig {
	name: string;
	requiredScenes?: Scene[];
	displayOrder?: number;
	ignoreGuiInset?: boolean;
	mapStateToProps?: (state: IClientStore) => unknown;
	mapDispatchToProps?: (dispatch: StoreDispatch) => unknown;
}

interface AppInfo {
	ctor: Constructor;
	config: IAppConfig;
	identifier: string;
}

export declare function App(config: IAppConfig): ClassDecorator;

@Controller({})
export class AppController implements OnInit {
	private apps = new Map<Constructor, AppInfo>();
	private appHandles = new Map<Constructor, Roact.Tree>();

	private playerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui")!;

	constructor(private readonly sceneController: SceneController) {}

	onInit() {
		this.sceneController.onSceneChanged.Connect((n, o) => this.onSceneChanged(n, o));

		for (const [ctor, identifier] of Reflect.objToId) {
			const app = Reflect.getOwnMetadata<DecoratorMetadata<IAppConfig>>(
				ctor,
				`flamework:decorators.${Flamework.id<typeof App>()}`,
			);

			if (app) {
				const config = app.arguments[0];

				this.apps.set(ctor as Constructor, {
					ctor: ctor as Constructor,
					config,
					identifier,
				});
			}
		}
	}

	private onSceneChanged(newScene: Scene, oldScene?: Scene) {
		for (const [element, { config }] of this.apps) {
			if (config.requiredScenes === undefined) continue;

			const usedToBeOpen = oldScene !== undefined ? config.requiredScenes.includes(oldScene) : false;
			const openNow = config.requiredScenes.includes(newScene);

			if (usedToBeOpen && !openNow) {
				// this app should be hidden
				Log.Debug(`HIDING app "{Name}"`, config.name);
				this.hideApp(element);
			} else if (!usedToBeOpen && openNow) {
				// this app should be shown
				Log.Debug(`SHOWING app "{Name}"`, config.name);
				this.showApp(element);
			}
		}
	}

	private showApp(element: Constructor) {
		const { config } = this.apps.get(element)!;

		let component = element as unknown as Roact.FunctionComponent;
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

		this.appHandles.set(element, handle);
		Log.Debug(`Mounted new app instance "{Name}"`, config.name);
	}

	private hideApp(element: Constructor) {
		const handle = this.appHandles.get(element);
		if (handle === undefined) return Log.Warn(`No handle found for element "{@Element}"`, element);
		Roact.unmount(handle);
	}
}
