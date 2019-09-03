# asciicam

👨‍💻👩‍💻 Video chat through the terminal using ASCII art. Built at Hack Lodge Summer 2019, Bay Area.

## Installation

_Packaged binaries installable via npm will be available soon. Below are the instructions for the development setup._

```bash
git clone https://github.com/ifvictr/asciicam
```

## Usage

### Client

```bash
cd asciicam/cli
# Install dependencies
yarn
# Start the client
node -r ts-node/register index.ts
```

```bash
Usage: index.ts [options] [command]

Options:
  -h, --help                              output usage information

Commands:
  create|c [options] [passphrase]         Create a new chat room, optionally locked with the specified passphrase
  join|j [options] <roomId> [passphrase]  Join the specified chat room
```

### Server

```bash
cd asciicam/server
# Install dependencies
yarn
# Start asciicam server in production mode…
yarn run prod
# …or development
yarn run dev
```
