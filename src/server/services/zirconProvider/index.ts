import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconConfigurationBuilder, ZirconDefaultGroup, ZirconServer } from "@rbxts/zircon";
import { PrintFunction } from "./commands/print";

Log.SetLogger(Logger.configure().EnrichWithProperty("Version", PKG_VERSION).WriteTo(Zircon.Log.Console()).Create());

ZirconServer.Registry.Init(
	ZirconConfigurationBuilder.default().AddFunction(PrintFunction, [ZirconDefaultGroup.User]).Build(),
);
