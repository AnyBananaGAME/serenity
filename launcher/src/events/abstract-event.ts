import type { Packet } from "@serenityjs/protocol";
import type { Serenity } from "../serenity";
import type { HookMethod } from "../types";

/**
 * The abstract event class.
 */
abstract class AbstractEvent {
	/**
	 * The serenity instance.
	 */
	public static serenity: Serenity;

	/**
	 * The packet to hook.
	 */
	public static readonly hook: Packet | null = null;

	/**
	 * The method to hook.
	 */
	public static readonly method: HookMethod | null = null;

	/**
	 * The logic to execute.
	 */
	public static logic(..._arguments: Array<unknown>): void {
		throw new Error("AbstractEvent.logic() method not implemented.");
	}

	public static initialize(): void {
		throw new Error("AbstractEvent.initialize() method not implemented.");
	}
}

export { AbstractEvent };