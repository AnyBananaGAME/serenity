import { ActorFlag } from "@serenityjs/protocol";

import { EntityIdentifier } from "../../enums";

import { EntityTrait } from "./trait";

class EntityGravityTrait extends EntityTrait {
  public static readonly identifier = "gravity";

  public static readonly types = [EntityIdentifier.Player];

  public onSpawn(): void {
    // Check if the entity has a metadata flag value for gravity
    if (!this.entity.flags.has(ActorFlag.HasGravity)) {
      // Set the entity flag for gravity
      this.entity.flags.set(ActorFlag.HasGravity, true);
    }
  }
}

export { EntityGravityTrait };