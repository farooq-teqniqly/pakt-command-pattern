import * as chai from "chai";
import * as _ from "lodash";
import "mocha";

import { EventEmitter } from "events";
import { Command } from "../src/index";

const expect = chai.expect;

describe("Command class", () => {
    let command: Command;

    beforeEach(() => {
        command = new Command();
    });

    it("when execute() successful the promise is resolved", () => {
        command.executeCallback = () => {
            return new Promise<any>((resolve) => resolve("ran executeCallback"));
        };

        const result = command.execute();

        result.then((data) => expect(data).to.eq("ran executeCallback"));
    });

    it("when execute() fails the promise is rejected", () => {
        command.executeCallback = () => {
            return new Promise<any>((resolve) => {
                throw new Error("FAIL!");
            });
        };

        const result = command.execute();

        result.catch((err) => expect(err.message).to.eq("FAIL!"));
    });

    it("emits the onBeforeExecute event", () => {
        command.onBeforeExecute = () => "emitted onBeforeExecute";

        (command as EventEmitter).on("onBeforeExecute", (data) => {
            expect(data).to.eq("emitted onBeforeExecute");
        });
    });

    it("emits the onAfterExecute event", () => {
        command.onAfterExecute = () => "emitted onAfterExecute";

        (command as EventEmitter).on("onAfterExecute", (data) => {
            expect(data).to.eq("emitted onAfterExecute");
        });
    });

    it("emits a custom event", () => {
        command.addEventListener("emitFoo", () => {
            return {data: "foo"};
        });

        const events: any[] = [];

        command.on("customEvent", (event) => {
            console.log(event);
            events.push(event.name);
        });

        command.executeCallback = () => {
            return new Promise<any>((resolve, reject) => {
                command.emit("emitFoo");
                resolve();
            });
        }
        const result = command.execute();

        result.then(() => {
            /* const fooEvent = events.find(e => e.name === "emitFoo");
            expect(fooEvent.data).to.eq("foo"); */
        });
        
        /* const barEvent = events.find(e => e.name === "emitBar");
        expect(barEvent.data).to.eq("bar"); */
    });

    it("throws when a duplicate custom event listener is added", () => {
        expect(() => {
            command.addEventListener("foo", () => true);
            command.addEventListener("foo", () => false);
        }).throws("An event handler named 'foo' has already been added.");
    });
});
