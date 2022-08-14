// Credit to grilme99 @ https://github.com/grilme99/tabletop-island/blob/main/src/shared/ui/components/padding-component.tsx

import Roact from "@rbxts/roact";

type IProps = Roact.PropsWithChildren<{
	Padding: number;
}>;

const Padding = Roact.forwardRef<IProps, UIPadding>((props, ref) => {
	return (
		<uipadding
			Ref={ref}
			PaddingTop={new UDim(0, props.Padding)}
			PaddingBottom={new UDim(0, props.Padding)}
			PaddingLeft={new UDim(0, props.Padding)}
			PaddingRight={new UDim(0, props.Padding)}
		/>
	);
});

export default Padding;
