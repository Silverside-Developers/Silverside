import Log from "@rbxts/log";
import { ZirconFunctionBuilder } from "@rbxts/zircon";

export const PrintFunction = new ZirconFunctionBuilder("print")
	.AddVariadicArgument("unknown")
	.Bind((context, ...args) => context.LogInfo(args.map(tostring).join(" ")));
