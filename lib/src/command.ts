import { EventEmitter } from "events";
import { ICommandEvent } from "./command-event.interface";
import { ICommand } from "./command.interface";
import { ICommandExecuteCallback } from "./execute-callback.interface";

interface ICustomEventHandler {
    name: string;
    handler: ICommandEvent
}

export class Command extends EventEmitter implements ICommand {

    private customEventHandlers: ICustomEventHandler[] = [];

    public executeCallback: ICommandExecuteCallback = () => {
        return new Promise<any>((resolve, reject) => resolve());
    }

    public onBeforeExecute: ICommandEvent = () => null;
    public onAfterExecute: ICommandEvent = () => null;

    public execute(): Promise<any> {
        this.addListenersForCustomEventHandlers();

        try {
            this.emit("onBeforeExecute", this.onBeforeExecute());
            const promise = this.executeCallback();
            this.emit("onAfterExecute", this.onAfterExecute());
            return promise;
        } catch (err) {
            return new Promise<any>((resolve, reject) => reject(err));
        }
    }

    public addEventListener(customEventHandler: ICustomEventHandler): void {
        if (this.customEventHandlers.find(el => el.name === customEventHandler.name)) {
            throw new Error(`An event handler named '${name}' has already been added.`);
        }

        this.customEventHandlers.push(customEventHandler);
    }

    private addListenersForCustomEventHandlers() {
        for (let i = 0; i < this.customEventHandlers.length; i++) {
            this.on(
                this.customEventHandlers[i].name,
                () => {
                    this.emit("customEvent", () => {
                        return {
                            name: this.customEventHandlers[i].name,
                            data: this.customEventHandlers[i].handler()
                        }
                    });
                });
        }
    }
}
