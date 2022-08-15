import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Roact from "@rbxts/roact";
import Interaction from "shared/ui/components/interaction/interaction";

interface Attributes {
	keycode: Enum.KeyCode;
}

@Component({
	tag: "Interactable",
	defaults: {
		keycode: Enum.KeyCode.F,
	},
})
export class Interactable extends BaseComponent<Attributes> implements OnStart {
	private handle?: Roact.Tree;

	onStart(): void {
		this.deactivate();
	}

	public getKeyCode(): Enum.KeyCode {
		return this.attributes.keycode;
	}

	public getInstance(): BasePart | undefined {
		if (this.instance.IsA("BasePart")) return this.instance;
	}

	public activate() {
		this.handle = Roact.mount(
			<billboardgui AlwaysOnTop Size={UDim2.fromOffset(500, 24)}>
				<Interaction
					KeyCode={this.getKeyCode()}
					ActionText="Activate"
					Alignment={Enum.HorizontalAlignment.Center}
				/>
			</billboardgui>,
			this.getInstance(),
			"Interaction",
		);
	}

	public deactivate() {
		if (!this.handle) return;
		Roact.unmount(this.handle);
	}
}
