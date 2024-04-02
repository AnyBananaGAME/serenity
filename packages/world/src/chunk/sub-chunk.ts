import { BlockStorage } from "./block-storage";

import type { BinaryStream } from "@serenityjs/binarystream";

/**
 * Represents a sub chunk.
 */
export class SubChunk {
	/**
	 * Whether or not the sub chunk uses hashes.
	 */
	public readonly hashes: boolean;

	/**
	 * The version of the sub chunk.
	 */
	public readonly version: number;

	/**
	 * The layers of the sub chunk.
	 */
	public readonly layers: Array<BlockStorage>;

	/**
	 * Creates a new sub chunk.
	 *
	 * @param version The version of the sub chunk.
	 * @param layers The layers of the sub chunk.
	 */
	public constructor(
		hashes: boolean,
		version?: number,
		layers?: Array<BlockStorage>
	) {
		this.hashes = hashes;
		this.version = version ?? 8;
		this.layers = layers ?? [];
	}

	/**
	 * Checks if the sub chunk is empty.
	 *
	 * @returns True if the sub chunk is empty, false otherwise.
	 */
	public isEmpty(): boolean {
		// Loop through each storage.
		for (const storage of this.layers) {
			// Check if the storage is empty.
			if (!storage.isEmpty()) {
				// The sub chunk is not empty.
				return false;
			}
		}

		// The sub chunk is empty.
		return true;
	}

	/**
	 * Gets the block storage at the given index.
	 *
	 * @param index The index of the storage.
	 * @returns The block storage.
	 */
	public getLayer(index: number): BlockStorage {
		// Check if the storage exists.
		if (!this.layers[index]) {
			// Create a new storage.
			for (let index_ = 0; index_ <= index; index_++) {
				if (!this.layers[index_])
					this.layers[index_] = new BlockStorage(this.hashes);
			}
		}

		// Return the storage.
		return this.layers[index]!;
	}

	/**
	 * Gets the block state at the given coordinates.
	 *
	 * @param bx The x coordinate of the block.
	 * @param by The y coordinate of the block.
	 * @param bz The z coordinate of the block.
	 * @param layer The layer of the block.
	 * @returns The block state.
	 */
	public getState(bx: number, by: number, bz: number, layer: number): number {
		// Get the storage.
		const storage = this.getLayer(layer);

		// Get the block state.
		return storage.getState(bx, by, bz);
	}

	/**
	 * Sets the block state at the given coordinates.
	 *
	 * @param bx The x coordinate of the block.
	 * @param by The y coordinate of the block.
	 * @param bz The z coordinate of the block.
	 * @param state The block state.
	 * @param layer The layer of the block.
	 */
	public setState(
		bx: number,
		by: number,
		bz: number,
		state: number,
		layer?: number
	): void {
		// Get the storage.
		const storage = this.getLayer(layer ?? 0);

		// Set the block state.
		storage.setState(bx, by, bz, state);
	}

	/**
	 * Serializes the sub chunk.
	 *
	 * @param stream The binary stream to write to.
	 */
	public static serialize(subchunk: SubChunk, stream: BinaryStream): void {
		// Write the version.
		stream.writeUint8(subchunk.version);

		// Write the storage count.
		stream.writeUint8(subchunk.layers.length);

		// Loop through each storage and serialize it.
		for (const storage of subchunk.layers) {
			// Serialize the storage.
			BlockStorage.serialize(storage, stream);
		}
	}

	/**
	 * Deserializes the sub chunk.
	 *
	 * @param stream The binary stream to read from.
	 */
	public static deserialize(hashes: boolean, stream: BinaryStream): SubChunk {
		// Read the version.
		const version = stream.readUint8();

		// Read the storage count.
		const count = stream.readUint8();

		// Loop through each storage and deserialize it.
		const layers: Array<BlockStorage> = [];
		for (let index = 0; index < count; index++) {
			layers.push(BlockStorage.deserialize(hashes, stream));
		}

		// Return the sub chunk.
		return new SubChunk(hashes, version, layers);
	}
}
