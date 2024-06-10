import { Jsonify } from "type-fest";

import { KdfType } from "../../../platform/enums/kdf-type.enum";
import { RangeWithDefault } from "../../../platform/misc/range-with-default";

/**
 * Represents a type safe KDF configuration.
 */
export type KdfConfig = PBKDF2KdfConfig | Argon2KdfConfig;

/**
 * Password-Based Key Derivation Function 2 (PBKDF2) KDF configuration.
 */
export class PBKDF2KdfConfig {
  static PBKDF2_ITERATIONS = new RangeWithDefault(600_000, 2_000_000, 600_000);
  kdfType: KdfType.PBKDF2_SHA256 = KdfType.PBKDF2_SHA256;
  iterations: number;

  constructor(iterations?: number) {
    this.iterations = iterations ?? PBKDF2KdfConfig.PBKDF2_ITERATIONS.defaultValue;
  }

  /**
   * Validates the PBKDF2 KDF configuration.
   * A Valid PBKDF2 KDF configuration has KDF iterations between the 600_000 and 2_000_000.
   */
  validateKdfConfig(): void {
    if (!PBKDF2KdfConfig.PBKDF2_ITERATIONS.inRange(this.iterations)) {
      throw new Error(
        `PBKDF2 iterations must be between ${PBKDF2KdfConfig.PBKDF2_ITERATIONS.min} and ${PBKDF2KdfConfig.PBKDF2_ITERATIONS.max}`,
      );
    }
  }

  static fromJSON(json: Jsonify<PBKDF2KdfConfig>): PBKDF2KdfConfig {
    return new PBKDF2KdfConfig(json.iterations);
  }
}

/**
 * Argon2 KDF configuration.
 */
export class Argon2KdfConfig {
  static ARGON2_MEMORY = new RangeWithDefault(16, 1024, 64);
  static ARGON2_PARALLELISM = new RangeWithDefault(1, 16, 4);
  static ARGON2_ITERATIONS = new RangeWithDefault(2, 10, 3);
  kdfType: KdfType.Argon2id = KdfType.Argon2id;
  iterations: number;
  memory: number;
  parallelism: number;

  constructor(iterations?: number, memory?: number, parallelism?: number) {
    this.iterations = iterations ?? Argon2KdfConfig.ARGON2_ITERATIONS.defaultValue;
    this.memory = memory ?? Argon2KdfConfig.ARGON2_MEMORY.defaultValue;
    this.parallelism = parallelism ?? Argon2KdfConfig.ARGON2_PARALLELISM.defaultValue;
  }

  /**
   * Validates the Argon2 KDF configuration.
   * A Valid Argon2 KDF configuration has iterations between 2 and 10, memory between 16mb and 1024mb, and parallelism between 1 and 16.
   */
  validateKdfConfig(): void {
    if (!Argon2KdfConfig.ARGON2_ITERATIONS.inRange(this.iterations)) {
      throw new Error(
        `Argon2 iterations must be between ${Argon2KdfConfig.ARGON2_ITERATIONS.min} and ${Argon2KdfConfig.ARGON2_ITERATIONS.max}`,
      );
    }

    if (!Argon2KdfConfig.ARGON2_MEMORY.inRange(this.memory)) {
      throw new Error(
        `Argon2 memory must be between ${Argon2KdfConfig.ARGON2_MEMORY.min}mb and ${Argon2KdfConfig.ARGON2_MEMORY.max}mb`,
      );
    }

    if (!Argon2KdfConfig.ARGON2_PARALLELISM.inRange(this.parallelism)) {
      throw new Error(
        `Argon2 parallelism must be between ${Argon2KdfConfig.ARGON2_PARALLELISM.min} and ${Argon2KdfConfig.ARGON2_PARALLELISM.max}.`,
      );
    }
  }

  static fromJSON(json: Jsonify<Argon2KdfConfig>): Argon2KdfConfig {
    return new Argon2KdfConfig(json.iterations, json.memory, json.parallelism);
  }
}

export const DEFAULT_KDF_CONFIG = new PBKDF2KdfConfig(
  PBKDF2KdfConfig.PBKDF2_ITERATIONS.defaultValue,
);
