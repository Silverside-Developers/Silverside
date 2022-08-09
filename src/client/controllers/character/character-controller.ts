import { Controller, OnStart, OnInit } from "@flamework/core";
import { CharacterRigR6, promiseR6 } from "@rbxts/promise-character";
import { Players, RunService, Workspace } from "@rbxts/services";
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

		const neck = this.currentCharacter.FindFirstChild("Neck", true) as Motor6D;
		const neckOffset = neck.C0;

		const leftShoulder = this.currentCharacter.FindFirstChild("Left Shoulder", true) as Motor6D;
		const leftShoulderOffset = leftShoulder.C0;

		const rightShoulder = this.currentCharacter.FindFirstChild("Right Shoulder", true) as Motor6D;
		const rightShoulderOffset = rightShoulder.C0;

		RunService.BindToRenderStep("CharacterController", Enum.RenderPriority.Character.Value, () => {
			if (Workspace.CurrentCamera === undefined) return;
			if (this.currentCharacter === undefined) return;
			if (neck === undefined) return;

			const cameraDirection = this.currentCharacter.HumanoidRootPart.CFrame.ToObjectSpace(
				Workspace.CurrentCamera.CFrame,
			).LookVector;

			neck.C0 = neckOffset
				.mul(CFrame.Angles(0, 0, -0.8 * math.asin(cameraDirection.X)))
				.mul(CFrame.Angles(-0.8 * math.asin(cameraDirection.Y), 0, 0));

			leftShoulder.C0 = leftShoulderOffset.mul(CFrame.Angles(0, 0, -0.3 * math.asin(cameraDirection.Y)));
			rightShoulder.C0 = rightShoulderOffset.mul(CFrame.Angles(0, 0, 0.3 * math.asin(cameraDirection.Y)));
		});
	}
}
