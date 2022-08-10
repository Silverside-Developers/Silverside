// Modified code from grilme99

import { Controller, OnStart, OnInit } from "@flamework/core";
import Log from "@rbxts/log";
import Signal from "@rbxts/signal";
import { ClientStore } from "client/rodux/rodux";
import { Scene } from "types/enums/scene";

@Controller({})
export class SceneController implements OnStart {
	public readonly onSceneChanged = new Signal<(newScene: Scene, oldScene?: Scene) => void>();

	onStart() {
		this.onSceneChangedCallback(ClientStore.getState().gameState.openScene);

		ClientStore.changed.connect((newState, oldState) => {
			if (newState.gameState.openScene !== oldState.gameState.openScene) {
				this.onSceneChangedCallback(newState.gameState.openScene, oldState.gameState.openScene);
			}
		});
	}

	public getSceneEnteredSignal(scene: Scene): Signal {
		const sceneEntered = new Signal();
		this.onSceneChanged.Connect((newScene, oldScene) => {
			if (newScene === scene) sceneEntered.Fire();
		});
		return sceneEntered;
	}

	public setScene(scene: Scene) {
		ClientStore.dispatch({ type: "SetScene", scene });
	}

	private onSceneChangedCallback(newScene: Scene, oldScene?: Scene) {
		Log.Debug(`Scene changed from ${oldScene} to ${newScene}`);
		this.onSceneChanged.Fire(newScene, oldScene);
	}
}
