import type { BlockMapper, Chunk } from '../chunk/index.js';
import { BlockPermutation } from '../chunk/index.js';
import { TerrainGenerator } from './Generator.js';

export class NetherFlat extends TerrainGenerator {
	public readonly layersMetrix;
	public constructor(flatLayers: (BlockPermutation | BlockPermutation[])[]) {
		super(0);
		this.layersMetrix = flatLayers.map((e) => (Array.isArray(e) ? e : [e]));
	}
	/**
	 * Generates a chunk.
	 *
	 */
	public apply(chunk: Chunk): Chunk {
		// Generate the chunk.
		for (let x = 0; x < 16; x++) {
			for (let z = 0; z < 16; z++) {
				for (let y = 0; y < this.layersMetrix.length; y++) {
					const palette = this.layersMetrix[y];
					chunk.setPermutation(x, y - 64, z, palette[Math.floor(palette.length * Math.random())]);
				}
			}
		}

		// Return the chunk.
		return chunk;
	}
	public static BasicFlat(blockTypes: BlockMapper) {
		return new this([
			BlockPermutation.resolve('minecraft:bedrock')!,
			BlockPermutation.resolve('minecraft:netherrack')!,
			[
				BlockPermutation.resolve('minecraft:netherrack')!,
				BlockPermutation.resolve('minecraft:nether_gold_ore')!,
				BlockPermutation.resolve('minecraft:quartz_ore')!,
			],
		]);
	}
}
