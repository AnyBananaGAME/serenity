import { EntityIdentifier } from "../../enums";

import { EntityMovementTrait } from "./attribute";
import { EntityTrait } from "./trait";

class EntityLookAtPlayerTrait extends EntityTrait {
  public static readonly identifier = "look-at-player";
  public static readonly types = [EntityIdentifier.Npc];

  /**
   * The radius of the entity to look at the player.
   */
  public radius = 5;

  public onTick(): void {
    // Check if the current tick is even.
    const currentTick = this.entity.world.currentTick;
    if (currentTick % 2n !== 0n) return;

    // Check if the entity has a movement trait.
    if (!this.entity.hasTrait(EntityMovementTrait)) return;

    // Get the dimension of the entity.
    const dimension = this.entity.dimension;

    // Get all the players near the entity.
    const players = dimension
      .getEntities({
        position: this.entity.position,
        maxDistance: this.radius
      })
      .filter((entity) => entity.isPlayer());

    // Check if there are no players.
    if (players.length === 0) return;

    // Find the closest player.
    const player = players.reduce((closest, current) =>
      closest.position.distance(this.entity.position) <
      current.position.distance(this.entity.position)
        ? closest
        : current
    );

    // Check if the player exists.
    if (!player) return;

    // Get the movement trait of the entity.
    const movement = this.entity.getTrait(EntityMovementTrait);

    // Clone the position of the player, and increase the y value by 0.9.
    const position = player.position.clone();

    // Make the entity look at the player
    return movement.lookAt(position);
  }
}

export { EntityLookAtPlayerTrait };
