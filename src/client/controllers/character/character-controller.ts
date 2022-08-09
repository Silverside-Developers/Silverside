import { Controller, OnStart, OnInit } from "@flamework/core";
import { CharacterRigR6, promiseR6 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import Signal from "@rbxts/signal";

const player = Players.LocalPlayer;

@Controller({})
export class CharacterController implements OnStart {
	public readonly onCharacterAdded = new Signal<(character: CharacterRigR6) => void>();

	private currentCharacter: CharacterRigR6 | undefined;

	onStart() {
		if (player.Character) this.onCharacterAddedCallback(player.Character);
		player.CharacterAdded.Connect((character) => this.onCharacterAddedCallback(character));
		player.CharacterRemoving.Connect(() => (this.currentCharacter = undefined));
	}

	public getCurrentCharacter(): CharacterRigR6 | undefined {
		return this.currentCharacter;
	}

	async onCharacterAddedCallback(char: Model) {
		const character = await promiseR6(char);
		this.currentCharacter = character;
		this.onCharacterAdded.Fire(character);
	}
}
