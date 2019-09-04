import program from 'commander'
import * as commands from './commands'
import pkg from './package.json'

program
    .version(pkg.version)
    .description(pkg.description)

program
    .command('create [passphrase]')
    .alias('c')
    .option('-s, --server <address>', '')
    .option('-h, --hacker', 'colorless')
    .option('-t, --text', '(not) custom text')
    .description('Create a new chat room, optionally locked with the specified passphrase')
    .action(commands.create)

program
    .command('join <roomId> [passphrase]')
    .alias('j')
    .option('-s, --server <address>', '')
    .description('Join the specified chat room')
    .action(commands.join)

program.parse(process.argv)