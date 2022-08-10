import { ZirconConfigurationBuilder, ZirconDefaultGroup, ZirconServer } from "@rbxts/zircon";
import { PrintFunction } from "./commands/print";

ZirconServer.Registry.Init(
	ZirconConfigurationBuilder.default().AddFunction(PrintFunction, [ZirconDefaultGroup.User]).Build(),
);
