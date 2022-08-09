import { Components } from "@flamework/components";
import { Controller, OnStart, OnInit, OnRender, Dependency } from "@flamework/core";
import { CharacterRigR6 } from "@rbxts/promise-character";
import { CollectionService } from "@rbxts/services";
import { Interactable } from "client/components/interactable";
import { CharacterController } from "./character/character-controller";

const TAG = "Interactable";

const components = Dependency<Components>();

@Controller({})
export class InteractionController implements OnStart, OnInit, OnRender {
	private currentCharacter?: CharacterRigR6;
	private activeInteractables = new Map<Enum.KeyCode, Interactable>();

	constructor(private readonly CharacterController: CharacterController) {}

	onInit() {}

	onStart() {
		this.currentCharacter = this.CharacterController.getCurrentCharacter();
		this.CharacterController.onCharacterAdded.Connect((character) => (this.currentCharacter = character));
	}

	onRender() {
		if (this.currentCharacter === undefined) return;
		// loop through all instances with the tag and check which one is the closest
		const interactables = CollectionService.GetTagged(TAG);

		const closestInteractables = new Map<Enum.KeyCode, Interactable>();
		for (const interactable of interactables) {
			if (!interactable.IsA("BasePart")) continue;

			const interactableComponent = components.getComponent<Interactable>(interactable);
			if (interactableComponent === undefined) continue;

			const position = interactable.Position;
			const distance = position.sub(this.currentCharacter.HumanoidRootPart.Position).Magnitude;
			const keycode = interactableComponent.getKeyCode();

			if (closestInteractables.has(keycode)) {
				const closestInteractable = closestInteractables.get(keycode)!;
				const closestInteractablePart = closestInteractable.getInstance();
				if (closestInteractablePart === undefined) continue;
				const closestDistance = closestInteractablePart.Position.sub(
					this.currentCharacter.HumanoidRootPart.Position,
				).Magnitude;
				if (distance < closestDistance) {
					closestInteractables.set(keycode, interactableComponent);
				}
			} else {
				closestInteractables.set(keycode, interactableComponent);
			}
		}

		// make closest interables active, all active interables that are not in the closestInteractables map are deactivated
		closestInteractables.forEach((interactable, keycode) => {
			if (this.activeInteractables.has(keycode) && this.activeInteractables.get(keycode) === interactable) return;
			if (this.activeInteractables.has(keycode)) {
				this.activeInteractables.get(keycode)!.deactivate();
			}
			this.activeInteractables.set(keycode, interactable);
			interactable.activate();
		});

		// make the closest interactable of each keycode's transparency 0.5
		closestInteractables.forEach((interactable, keycode) => {
			const part = interactable.getInstance();
			if (part === undefined) return;
			part.Transparency = 0.5;
		});
	}
}
