import { Endianness, Int64, Uint8 } from "@serenityjs/binarystream";
import { Proto, Serialize } from "@serenityjs/raknet";

import { CommandPermissionLevel, Packet, PermissionLevel } from "../../enums";
import { AbilityLayers } from "../types";

import { DataPacket } from "./data-packet";

@Proto(Packet.UpdateAbilities)
class UpdateAbilitiesPacket extends DataPacket {
	@Serialize(Int64, Endianness.Little) public entityUniqueId!: bigint;
	@Serialize(Uint8) public permissionLevel!: PermissionLevel;
	@Serialize(Uint8) public commandPersmissionLevel!: CommandPermissionLevel;
	@Serialize(AbilityLayers) public abilities!: Array<AbilityLayers>;
}

export { UpdateAbilitiesPacket };
