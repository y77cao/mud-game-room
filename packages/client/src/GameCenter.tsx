import { useState } from "react";
import { useMUD } from "./MUDContext";
import {
  Has,
  HasValue,
  getComponentValueStrict,
  runQuery,
} from "@latticexyz/recs";
import { RoomState } from "./constants";
import { useEntityQuery } from "@latticexyz/react";

export const GameCenter = () => {
  const {
    components: { Room, State, Game, RoomLimit },
    network: { playerEntity, singletonEntity },
    systemCalls: { joinRoom, createRoom },
  } = useMUD();

  const pendingRooms = useEntityQuery([
    HasValue(State, { value: `${RoomState.PENDING}` }),
  ]).map((entity) => {
    const gameAddress = getComponentValueStrict(Game, entity)?.value;
    const roomLimit = getComponentValueStrict(
      RoomLimit,
      entity
    )?.value.toString();
    const players = [...runQuery([HasValue(Room, { value: entity })])];
    return { gameAddress, roomLimit, players };
  });

  const [showJoinRoomPopup, setShowJoinRoomPopup] = useState(false);
  const [showCreateRoomPopup, setShowCreateRoomPopup] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [gameAddress, setGameAddress] = useState("");
  const [roomLimit, setRoomLimit] = useState(0);

  return (
    <div>
      {showJoinRoomPopup ? (
        <div>
          Room ID:{" "}
          <input
            style={{ color: "black" }}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={() => joinRoom(roomId)}>Join</button>
        </div>
      ) : null}
      {showCreateRoomPopup ? (
        <div>
          Game Address:{" "}
          <input
            style={{ color: "black" }}
            onChange={(e) => setGameAddress(e.target.value)}
          />
          Room Limit:{" "}
          <input
            style={{ color: "black" }}
            onChange={(e) => setRoomLimit(parseInt(e.target.value))}
          />
          <button onClick={() => createRoom(gameAddress, roomLimit)}>
            Create
          </button>
        </div>
      ) : null}
      <button onClick={() => setShowJoinRoomPopup(true)}>Join a Room</button>
      <button onClick={() => setShowCreateRoomPopup(true)}>
        Create a Room
      </button>
      <div>
        {pendingRooms.map((room, i) => {
          return (
            <div key={i}>
              Playing {room.gameAddress}, Players: {room.players.length} /{" "}
              {room.roomLimit}
            </div>
          );
        })}
      </div>
    </div>
  );
};
