import { EventEmitter } from "events";
import { ICommandEvent } from "./command-event.interface";
import { ICommand } from "./command.interface";
import { ICommandExecuteCallback } from "./execute-callback.interface";

export class Command extends EventEmitter implements ICommand {
    public executeCallback: ICommandExecuteCallback = () => {
        return new Promise<any>((resolve, reject) => resolve());
    }

    get eventEmitter(): EventEmitter {
        return this as EventEmitter;
    }

    public onBeforeExecute: ICommandEvent = () => null;
    public onAfterExecute: ICommandEvent = () => null;

    public execute(): Promise<any> {
        try {
            this.emit("onBeforeExecute", this.onBeforeExecute());
            const promise = this.executeCallback();
            this.emit("onAfterExecute", this.onAfterExecute());
            return promise;
        } catch (err) {
            return new Promise<any>((resolve, reject) => reject(err));
        }
    }
}
