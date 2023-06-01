# mud-game-room
Player matchmaking system built with MUD2 for [Autonomous World Hackathon](https://ethglobal.com/showcase/mud-game-room-yu1io)

Note: the demo video in the project page is showing a version that didn't work (lol I uploaded the wrong video for my hackathon submission). See a functional demo video [here](https://drive.google.com/file/d/1vB5AmyCxtuv4xFL6SuVEBtwIciZUayRj/view?usp=sharing).
<img width="1585" alt="Screenshot 2023-05-23 at 1 42 35 AM" src="https://github.com/y77cao/mud-game-room/assets/16827269/28d83389-bc41-4f60-9726-b9a4bae62f15">

This projects uses [MUD2](https://mud.dev/) framework with React. It used the ECS framework from MUD2 and is managed by a single RoomSystem with Room entity containing State, Game, RoomLimit and players components. The in-app game is currently achieved by using an iframe directing to the client URL of the MUD2 game. The iframe URL contains the room entity ID as a param and allows the game to bootstrap the game session with the provided room ID. And example integrated game can be found in https://github.com/y77cao/minecollector.

Note that the current design of GameRoom posts some requirements for how the integrated games should be implemented. It requires the game to create and manage game sessions around room IDs, which means that the games that are suitable to be integrated are the ones that are multi-player and session based, like chess, mafia, or other strategic games, etc.

To run:
```
$ cd mud-game-room
$ pnpm install
$ pnpm run dev
```
