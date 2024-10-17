import {
  NetworkItemInstanceDescriptor,
  NetworkItemStackDescriptor
} from "@serenityjs/protocol";
import { CompoundTag } from "@serenityjs/nbt";

import { Container } from "../container";
import { ItemIdentifier } from "../enums";
import { Trait } from "../trait";
import { Items, JSONLikeValue } from "../types";

import { ItemType } from "./identity";

interface ItemStackProperties {
  amount: number;
  auxillary: number;
}

const DefaultItemStackProperties: ItemStackProperties = {
  amount: 1,
  auxillary: 0
};

class ItemStack<T extends keyof Items = keyof Items> {
  public readonly type: ItemType<T>;

  public readonly auxillary: number;

  public readonly components = new Map<string, JSONLikeValue>();

  public readonly traits = new Map<string, Trait>();

  public readonly nbt = new CompoundTag();

  /**
   * If the item stack is stackable.
   */
  public readonly stackable: boolean;

  /**
   * The maximum stack size of the item stack.
   */
  public readonly maxAmount: number;

  /**
   * The container the item stack is in.
   * If the item stack is not in a container, this will be null.
   */
  public container: Container | null = null;

  public amount: number;

  public constructor(
    identifier: T | ItemIdentifier | ItemType<T>,
    properties?: Partial<ItemStackProperties>
  ) {
    // Assign the type of the item stack
    this.type =
      identifier instanceof ItemType
        ? identifier
        : (ItemType.get(identifier as T) as ItemType<T>); // TODO: Fix this, fetch from palette

    // Spread the default properties and the provided properties
    const props = { ...DefaultItemStackProperties, ...properties };

    // Assign the properties to the item stack
    this.amount = props.amount;
    this.auxillary = props.auxillary;

    // Assign the stackable and max amount properties
    this.stackable = this.type.stackable;
    this.maxAmount = this.type.maxAmount;
  }

  /**
   * Updates the item stack in the container.
   */
  public update(): void {
    // Check if the item is in a container.
    if (!this.container) return;

    // Get the slot of the item in the container.
    const slot = this.container.storage.indexOf(this);

    // Check if the item is 0 or less.
    if (this.amount <= 0) {
      // Remove the item from the container.
      this.container.clearSlot(slot);
    }

    // Set the item in the container.
    else this.container.setItem(slot, this);
  }

  /**
   * Set the amount of the item stack.
   * @param amount The amount to set.
   */
  public setAmount(amount: number): void {
    // Update the amount of the item stack.
    this.amount = amount;

    // Update the item in the container.
    this.update();
  }

  /**
   * Decrements the amount of the item stack.
   * @param amount The amount to decrement.
   */
  public decrement(amount?: number): void {
    this.setAmount(this.amount - (amount ?? 1));
  }

  /**
   * Increments the amount of the item stack.
   * @param amount The amount to increment.
   */
  public increment(amount?: number): void {
    this.setAmount(this.amount + (amount ?? 1));
  }

  /**
   * Converts the item stack to a network item instance descriptor.
   * Which is used on the protocol level.
   * @param item The item stack to convert.
   * @returns The network item instance descriptor.
   */
  public static toNetworkInstance(
    item: ItemStack
  ): NetworkItemInstanceDescriptor {
    // Get the permutation of the block.
    const permutation = item.type.block?.permutations[item.auxillary];

    // Return the item instance descriptor.
    return {
      network: item.type.network,
      stackSize: item.amount,
      metadata: item.auxillary,
      networkBlockId: permutation?.network ?? 0,
      extras: {
        nbt: item.nbt,
        canDestroy: [],
        canPlaceOn: []
      }
    };
  }

  /**
   * Converts the item stack to a network item stack descriptor.
   * Which is used on the protocol level.
   * @param item The item stack to convert.
   * @returns The network item stack descriptor.
   */
  public static toNetworkStack(item: ItemStack): NetworkItemStackDescriptor {
    // Get network item instance descriptor.
    const instance = ItemStack.toNetworkInstance(item);

    // Return the item stack descriptor.
    return {
      ...instance,
      stackNetId: null // TODO: Implement stackNetId, this is so that the server can track the item stack.
    };
  }
}

export { ItemStack, ItemStackProperties, DefaultItemStackProperties };