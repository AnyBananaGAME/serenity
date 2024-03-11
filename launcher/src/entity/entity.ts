import {
	Rotation,
	Vector3f,
	MetadataKey,
	AddEntity,
	RemoveEntity,
	MoveEntity
} from "@serenityjs/protocol";

import { EntityMetaComponent } from "./components/meta";

import type { MetadataFlags, MetadataType } from "@serenityjs/protocol";
import type { Player } from "..";
import type { EntityComponents } from "../types";
import type { Dimension } from "../world";
import type { EntityComponent } from "./components";

let RUNTIME_ID = 1n;

interface EntityMetadata {
	flag?: boolean;
	type: MetadataType;
	value: bigint | boolean | number | string;
}

class Entity {
	public readonly runtimeId: bigint;
	public readonly uniqueId: bigint;
	public readonly identifier: string;
	public dimension: Dimension;
	public readonly position: Vector3f;
	public readonly velocity: Vector3f;
	public readonly rotation: Rotation;
	public readonly metadata: Map<MetadataFlags | MetadataKey, EntityMetadata>;
	public readonly properties: Map<string, bigint | number | string>;
	public readonly components: Map<string, EntityComponent>; // TODO: Probably should merge properties into components.

	public constructor(
		identifier: string,
		dimension: Dimension,
		uniqueId?: bigint
	) {
		this.runtimeId = RUNTIME_ID++;
		this.uniqueId =
			uniqueId ??
			BigInt.asIntN(
				64,
				BigInt(Math.floor((Math.random() * 256) ^ Number(this.runtimeId)))
			);
		this.identifier = identifier;
		this.dimension = dimension;
		this.position = new Vector3f(0, 0, 0);
		this.velocity = new Vector3f(0, 0, 0);
		this.rotation = new Rotation(0, 0, 0);
		this.metadata = new Map();
		this.properties = new Map();
		this.components = new Map();
	}

	/**
	 * Handles the a tick for the entity.
	 */
	public tick(): void {}

	/**
	 * Gets the component from the entity.
	 *
	 * @param type - The type of the component.
	 * @returns The component.
	 */
	public getComponent<T extends keyof EntityComponents>(
		type: T
	): EntityComponents[T] {
		return this.components.get(type) as EntityComponents[T];
	}

	/**
	 * Sets the component to the entity.
	 *
	 * @param component - The component to set.
	 */
	public setComponent<T extends keyof EntityComponents>(
		component: EntityComponents[T]
	): void {
		this.components.set(component.identifier, component);
	}

	/**
	 * Gets the metadata components from the entity.
	 *
	 * @returns The metadata components.
	 */
	public getMetadata(): Array<EntityMetaComponent> {
		return [...this.components.values()].filter(
			(component): component is EntityMetaComponent =>
				component instanceof EntityMetaComponent
		);
	}

	/**
	 * Spawns the entity into the world.
	 * If a player is provided, the entity will only be sent to the player.
	 *
	 * @param player - The player to send the entity to.
	 */
	public spawn(player?: Player): void {
		// Create a new AddEntity packet.
		const packet = new AddEntity();

		// Assign packet data.
		packet.uniqueEntityId = this.uniqueId;
		packet.runtimeId = this.runtimeId;
		packet.identifier = this.identifier;
		packet.position = this.position;
		packet.velocity = this.velocity;
		packet.pitch = this.rotation.pitch;
		packet.yaw = this.rotation.yaw;
		packet.headYaw = this.rotation.headYaw;
		packet.bodyYaw = this.rotation.yaw;
		packet.attributes = [];
		packet.metadata = this.getMetadata().map((entry) => {
			return {
				key: entry.flag ? MetadataKey.Flags : (entry.key as MetadataKey),
				type: entry.type,
				value: entry.currentValue,
				flag: entry.flag ? (entry.key as MetadataFlags) : undefined
			};
		});
		packet.properties = {
			ints: [],
			floats: []
		};
		packet.links = [];

		// Check if the player is provided.
		// If so, then we will only send the packet to the player.
		if (player) {
			// Send the packet to the player.
			player.session.send(packet);
		} else {
			// Broadcast the packet to the dimension.
			this.dimension.broadcast(packet);

			// Add the entity to the dimension entities map.
			this.dimension.entities.set(this.uniqueId, this);
		}
	}

	/**
	 * Despawns the entity from the world.
	 */
	public despawn(): void {
		// Create a new RemoveEntity packet.
		const packet = new RemoveEntity();

		// Assign packet data.
		packet.uniqueEntityId = this.uniqueId;

		// Broadcast the packet to the dimension.
		this.dimension.broadcast(packet);

		// Remove the entity from the dimension entities map.
		this.dimension.entities.delete(this.uniqueId);
	}

	/**
	 * Teleports the entity to the specified position.
	 *
	 * @param position - The position to teleport to.
	 * @param rotation - The rotation to teleport to.
	 */
	public teleport(position: Vector3f, rotation?: Rotation): void {
		// Create a new MoveEntity packet.
		let packet = new MoveEntity();

		// Assign packet data.
		packet.runtimeEntityId = this.runtimeId;
		packet.flags = 0x04;
		packet.position = position;
		packet.rotation = rotation ?? this.rotation;

		// Broadcast the packet to the dimension.
		this.dimension.broadcast(packet);

		// For some reason, we must send another packet to update the rotation.
		if (!rotation) return;

		// Create a new MoveEntity packet.
		packet = new MoveEntity();
		packet.runtimeEntityId = this.runtimeId;
		packet.flags = 0x04;
		packet.position = position;
		packet.rotation = rotation;

		// Broadcast the packet to the dimension.
		this.dimension.broadcast(packet);
	}
}

export { Entity };