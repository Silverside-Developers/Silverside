import { Service, OnStart, OnInit } from "@flamework/core";
import { promiseR6 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";

@Service({})
export class CharacterService implements OnStart {
	onStart() {
		Players.PlayerAdded.Connect((player) => {
			player.CharacterAppearanceLoaded.Connect((character) => this.onCharacterAppearanceLoaded(character));
		});
	}

	async onCharacterAppearanceLoaded(char: Model) {
		const currentCharacter = await promiseR6(char);

		const humanoidDescription = currentCharacter.Humanoid.GetAppliedDescription();
		humanoidDescription.Head = 0;
		humanoidDescription.Torso = 0;
		humanoidDescription.RightLeg = 0;
		humanoidDescription.LeftLeg = 0;
		humanoidDescription.RightArm = 0;
		humanoidDescription.LeftArm = 0;
		currentCharacter.Humanoid.ApplyDescription(humanoidDescription);
	}
}
