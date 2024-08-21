import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sumVolumeM3({ d1, d2, d3, d4, meters }: { d1: number, d2: number, d3: number, d4: number, meters: number }) {
  const pi = Math.PI;
  const averageD1D2 = (((d1 / 100) + (d2 / 100)) / 2)
  const averageD3D4 = (((d3 / 100) + (d4 / 100)) / 2)
  const volumeM3 = ((((Math.pow(averageD1D2, 2) * (pi / 4)) + (Math.pow(averageD3D4, 2) * (pi / 4))) / 2) * (meters / 100))
  console.log(volumeM3)
  return volumeM3
}