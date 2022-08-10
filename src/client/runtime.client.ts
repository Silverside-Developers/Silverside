import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconClient } from "@rbxts/zircon";

Log.SetLogger(Logger.configure().WriteTo(Zircon.Log.Console()).EnrichWithProperty("Version", PKG_VERSION).Create());

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components");

ZirconClient.Init();
Flamework.ignite();
