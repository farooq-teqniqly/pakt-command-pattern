export interface Command {
}
export interface ICommand {
    execute(): Promise<any>;
}
