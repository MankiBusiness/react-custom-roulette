export const getRotationDegrees = (
  prizeNumber: number,
  numberOfPrizes: number,
  cursorOffset: number
) => {
  const degreesPerPrize = 360 / numberOfPrizes;

  const cursorRotationOffset = cursorOffset + degreesPerPrize / 2;

  const prizeRotation =
    degreesPerPrize * (numberOfPrizes - prizeNumber)
    // If cursor is offset from top-center, add offset to align with cursor
    - cursorRotationOffset
    // Stop in ceter of choice
    + (degreesPerPrize / 2);

  return numberOfPrizes - prizeNumber > numberOfPrizes / 2
    ? -360 + prizeRotation
    : prizeRotation;
};

export const clamp = (min: number, max: number, val: number) =>
  Math.min(Math.max(min, +val), max);
