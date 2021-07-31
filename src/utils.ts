export const getRotationDegrees = (
  prizeNumber: number,
  numberOfPrizes: number,
  initialRotation: number
) => {
  const degreesPerPrize = 360 / numberOfPrizes;

  const initialCenteredRotation = initialRotation + degreesPerPrize / 2;

  const randomDifference = (-1 + Math.random() * 2) * degreesPerPrize * 0.35;

  const prizeRotation =
    degreesPerPrize * (numberOfPrizes - prizeNumber) -
    initialCenteredRotation +
    randomDifference;

  return numberOfPrizes - prizeNumber > numberOfPrizes / 2
    ? -360 + prizeRotation
    : prizeRotation;
};

export const clamp = (min: number, max: number, val: number) =>
  Math.min(Math.max(min, +val), max);
