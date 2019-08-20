import { Command } from "commander"

export default (program: Command): any => program
    .command("join <roomId>", { isDefault: true })
    .alias("j")
    .description("")
    .action((roomId: string) => {
        // Send roomId to main server to see if it exists

        // If it doesn't, notify the user and exit
        // If it does, attempt to establish a connection to the server

        // If the attempt fails, notify and exit
        // If succeeds, connect and start streaming data
        console.log("You’ve joined the room: " + roomId)
    })