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
});
