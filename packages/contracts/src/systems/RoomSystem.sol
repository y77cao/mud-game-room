// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import {System} from "@latticexyz/world/src/System.sol";
import {addressToEntityKey} from "../addressToEntityKey.sol";
import {positionToEntityKey} from "../positionToEntityKey.sol";
import {getKeysWithValue} from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";
import {Room, RoomTableId, RoomLimit, Game, State} from "../codegen/Tables.sol";
import {RoomState} from "../codegen/Types.sol";
import {getKeysWithValue} from "@latticexyz/world/src/modules/keyswithvalue/getKeysWithValue.sol";

contract RoomSystem is System {
    function joinRoom(bytes32 roomId) public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32[] memory playersInRoom = getKeysWithValue(RoomTableId, Room.encode(roomId));
        uint256 roomLimit = RoomLimit.get(roomId);
        require(Room.get(player) == bytes32(0), "player in active room");
        require(playersInRoom.length >= 1, "invalid room id");
        require(playersInRoom.length < roomLimit, "room full");

        Room.set(player, roomId);
    }

    function createRoom(address gameAddress, uint256 roomLimit) public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        require(Room.get(player) == bytes32(0), "player already in room");

        bytes32 roomId = keccak256(abi.encode(player, block.timestamp));

        Room.set(player, roomId);
        RoomLimit.set(roomId, roomLimit);
        Game.set(roomId, gameAddress);
        State.set(roomId, bytes1(uint8(RoomState.PENDING)));
    }

    function startGame() public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 roomId = Room.get(player);
        require(roomId != bytes32(0), "player not in room");

        bytes32[] memory playersInRoom = getKeysWithValue(RoomTableId, Room.encode(roomId));
        require(playersInRoom.length >= 2, "not enough players in room");

        State.set(roomId, bytes1(uint8(RoomState.ACTIVE)));
    }

    function leaveRoom() public {
        bytes32 player = addressToEntityKey(address(_msgSender()));
        bytes32 roomId = Room.get(player);
        require(roomId != bytes32(0), "player not in room");

        Room.set(player, bytes32(0));
    }
}
