import Log from "@rbxts/log";
import { ZirconFunctionBuilder } from "@rbxts/zircon";

export const PrintFunction = new ZirconFunctionBuilder("print")
	.AddVariadicArgument("unknown")
	.Bind((context, ...args) => Log.Info(args.map(tostring).join(" ")));
