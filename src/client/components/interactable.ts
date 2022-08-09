import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";

interface Attributes {
	keycode: Enum.KeyCode;
}

@Component({
	tag: "Interactable",
	defaults: {
		keycode: Enum.KeyCode.F,
	},
})
export class Interactable extends BaseComponent<Attributes> {
	public getKeyCode(): Enum.KeyCode {
		return this.attributes.keycode;
	}

	public getInstance(): BasePart | undefined {
		if (this.instance.IsA("BasePart")) return this.instance;
	}

	public activate() {
		if (!this.instance.IsA("BasePart")) return;
		this.instance.Color = new Color3(0, 1, 0);
	}

	public deactivate() {
		if (!this.instance.IsA("BasePart")) return;
		this.instance.Color = new Color3(1, 0, 0);
	}
}
