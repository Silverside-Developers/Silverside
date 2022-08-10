import Rodux from "@rbxts/rodux";
import { DataActions, dataReducer, IDataReducer } from "./reducers/data-reducer";
import { GameActions, gameReducer, IGameReducer } from "./reducers/game-reducer";

export interface IClientStore {
	gameState: IGameReducer;
	playerData: IDataReducer;
}

export type StoreActions = DataActions | GameActions;

export const StoreReducer = Rodux.combineReducers<IClientStore, StoreActions>({
	gameState: gameReducer,
	playerData: dataReducer,
});

export const ClientStore = new Rodux.Store<IClientStore, StoreActions>(StoreReducer, {}, [
	Rodux.thunkMiddleware,
] as never);
