import { ContainerId, ContainerType } from "@serenityjs/protocol";

import { EntityIdentifier } from "../../enums";
import { EntityContainer } from "../container";
import { Entity } from "../entity";
import { ItemStack } from "../../item";
import { ItemStackEntry, JSONLikeObject } from "../../types";

import { EntityTrait } from "./trait";

interface InventoryComponent extends JSONLikeObject {
  size: number;
  items: Array<[number, ItemStackEntry]>;
}

class EntityInventoryTrait extends EntityTrait {
  public static readonly identifier = "inventory";

  public static readonly types = [EntityIdentifier.Player];

  /**
   * The container that holds the inventory items.
   */
  public readonly container: EntityContainer;

  /**
   * The type of container that this trait represents.
   */
  public readonly containerType: ContainerType = ContainerType.Inventory;

  /**
   * The identifier of the container that this trait represents.
   */
  public readonly containerId: ContainerId = ContainerId.Inventory;

  /**
   * The amount of slots in the inventory.
   */
  public readonly inventorySize: number = 36;

  /**
   * The selected slot in the inventory.
   */
  public selectedSlot: number = 0;

  public constructor(entity: Entity) {
    super(entity);

    // Create a new container
    this.container = new EntityContainer(
      entity,
      this.containerType,
      this.containerId,
      this.inventorySize
    );
  }

  /**
   * Gets the held item in the inventory.
   * @returns The held item in the inventory.
   */
  public getHeldItem(): ItemStack | null {
    return this.container.getItem(this.selectedSlot);
  }

  /**
   * Sets the held item in the inventory.
   * @param slot The slot to set the held item to.
   */
  public setHeldItem(_slot: number): void {
    throw new Error("Method not implemented.");
  }

  public onSpawn(): void {
    // Check if the entity has an inventory component
    if (this.entity.components.has("inventory")) {
      // Get the inventory component from the entity
      const inventory = this.entity.components.get(
        "inventory"
      ) as InventoryComponent;

      // Iterate over each item in the inventory
      for (const item of inventory.items) {
        // Get the slot and entry from the item
        const slot = item[0] as number;
        const entry = item[1] as ItemStackEntry;

        // Create a new item stack
        const stack = new ItemStack(entry.identifier, {
          amount: entry.amount,
          auxillary: entry.auxillary,
          world: this.entity.getWorld(),
          entry
        });

        // Add the item stack to the container
        this.container.setItem(slot, stack);
      }
    }

    // Update the container if the entity is a player
    if (this.entity.isPlayer()) this.container.update(this.entity);
  }

  public onDespawn(): void {
    // Create a new inventory component
    const inventory: InventoryComponent = {
      size: this.inventorySize,
      items: []
    };

    // Iterate over each item in the container
    for (let i = 0; i < this.inventorySize; i++) {
      // Get the item stack at the index
      const item = this.container.getItem(i);

      // Check if the item is null
      if (item === null) continue;

      // Get the data entry of the item stack
      const entry = item.getDataEntry();

      // Push the item stack entry to the inventory items
      inventory.items.push([i, entry]);
    }

    // Set the inventory component to the entity
    this.entity.components.set("inventory", inventory);
  }
}

export { EntityInventoryTrait };
