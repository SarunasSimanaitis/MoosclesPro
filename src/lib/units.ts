import type { AppPreferences } from "./preferences";

export type WeightUnit = AppPreferences["weightUnit"];

const POUNDS_PER_KILOGRAM = 2.2046226218;

export function fromKilograms(value: number, unit: WeightUnit): number {
  return unit === "lb" ? value * POUNDS_PER_KILOGRAM : value;
}

export function toKilograms(value: number, unit: WeightUnit): number {
  return unit === "lb" ? value / POUNDS_PER_KILOGRAM : value;
}

export function formatWeight(valueInKg: number, unit: WeightUnit): string {
  return fromKilograms(valueInKg, unit).toLocaleString(undefined, {
    maximumFractionDigits: unit === "lb" ? 0 : 1,
  });
}

export function formatVolume(valueInKg: number, unit: WeightUnit): string {
  return fromKilograms(valueInKg, unit).toLocaleString(undefined, {
    maximumFractionDigits: unit === "lb" ? 0 : 1,
  });
}
