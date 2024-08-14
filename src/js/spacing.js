import { UseCase } from "./usecase.js";

/** @param {UseCase[]} useCases */
export function makeSpace(useCases) {
  for (const useCase1 of useCases) {
    for (const useCase2 of useCases) {
      if (useCase1 === useCase2) {
        continue;
      }
      const delta = useCase2.pos.sub(useCase1.pos);
      const desiredMinLength =
        UseCase.PADDING +
        useCase1.dimensions.radius +
        useCase2.dimensions.radius;

      if (delta.mag() < desiredMinLength) {
        const desiredDelta = delta.norm().scalarMul(desiredMinLength);
        useCase2.pos = useCase1.pos.add(desiredDelta);
      }
    }
  }
}

/**
 * @param {UseCase} useCase1
 * @param {UseCase[]} useCases
 */
export function makeSpaceSingle(useCase1, useCases) {
  for (const useCase2 of useCases) {
    if (useCase1 === useCase2) {
      continue;
    }
    const delta = useCase2.pos.sub(useCase1.pos);
    const desiredMinLength =
      UseCase.PADDING + useCase1.dimensions.radius + useCase2.dimensions.radius;

    if (delta.mag() < desiredMinLength) {
      const desiredDelta = delta.norm().scalarMul(desiredMinLength);
      useCase2.pos = useCase1.pos.add(desiredDelta);
    }
  }
}
