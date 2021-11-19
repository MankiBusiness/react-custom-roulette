import React, { RefObject, createRef, useEffect } from 'react';

import { WheelData } from './Wheel';
import { clamp, getTextAsLines } from './utils';

interface WheelCanvasProps extends DrawWheelProps {
  data: WheelData[];
}

interface DrawWheelProps {
  initialRotation: number;
  outerBorderColor: string;
  outerBorderWidth: number;
  innerRadius: number;
  innerBorderColor: string;
  innerBorderWidth: number;
  radiusLineColor: string;
  radiusLineWidth: number;
  fontSize: number;
  fontFamily: string;
  perpendicularText: boolean;
  textDistance: number;
  textWrapDistance?: number;
}

const drawWheel = (
  canvasRef: RefObject<HTMLCanvasElement>,
  data: WheelData[],
  drawWheelProps: DrawWheelProps
) => {
  const QUANTITY = data.length;
  /* eslint-disable prefer-const */
  let {
    initialRotation,
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontSize,
    fontFamily,
    perpendicularText,
    textDistance,
    textWrapDistance,
  } = drawWheelProps;
  /* eslint-enable prefer-const */

  outerBorderWidth *= 2;
  innerBorderWidth *= 2;
  radiusLineWidth *= 2;
  fontSize *= 2;

  const canvas = canvasRef.current;
  if (canvas?.getContext('2d')) {
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = 'transparent';
    ctx.lineWidth = 0;
    // ctx.translate(0.5, 0.5)

    const arc = Math.PI / (QUANTITY / 2);
    const startAngle = (initialRotation - 45) * (Math.PI / 180);
    const outsideRadius = canvas.width / 2 - 10;

    const clampedTextDistance = clamp(0, 100, textDistance);
    const textRadius = (outsideRadius * clampedTextDistance) / 100;

    const clampedInsideRadius = clamp(0, 100, innerRadius);
    const insideRadius = (outsideRadius * clampedInsideRadius) / 100;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.font = `bold ${fontSize}px ${fontFamily}`;

    for (let i = 0; i < data.length; i++) {
      const angle = startAngle + i * arc;
      const { style } = data[i];
      ctx.fillStyle = (style && style.backgroundColor) as string;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
      ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
      ctx.stroke();
      ctx.fill();

      ctx.save();

      // WHEEL RADIUS LINES
      ctx.strokeStyle = radiusLineWidth <= 0 ? 'transparent' : radiusLineColor;
      ctx.lineWidth = radiusLineWidth;
      for (let j = 0; j < data.length; j++) {
        const radiusAngle = startAngle + j * arc;
        ctx.beginPath();
        ctx.moveTo(
          centerX + (insideRadius + 1) * Math.cos(radiusAngle),
          centerY + (insideRadius + 1) * Math.sin(radiusAngle)
        );
        ctx.lineTo(
          centerX + (outsideRadius - 1) * Math.cos(radiusAngle),
          centerY + (outsideRadius - 1) * Math.sin(radiusAngle)
        );
        ctx.closePath();
        ctx.stroke();
      }

      // WHEEL OUTER BORDER
      ctx.strokeStyle =
        outerBorderWidth <= 0 ? 'transparent' : outerBorderColor;
      ctx.lineWidth = outerBorderWidth;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        outsideRadius - ctx.lineWidth / 2,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.stroke();

      // WHEEL INNER BORDER
      ctx.strokeStyle =
        innerBorderWidth <= 0 ? 'transparent' : innerBorderColor;
      ctx.lineWidth = innerBorderWidth;
      ctx.beginPath();
      ctx.arc(
        centerX,
        centerY,
        insideRadius + ctx.lineWidth / 2 - 1,
        0,
        2 * Math.PI
      );
      ctx.closePath();
      ctx.stroke();

      // TEXT FILL
      const text = data[i].text;
      const lines = getTextAsLines(
        ctx,
        text,
        textWrapDistance || centerX * 0.6
      );
      const textOffset =
        (lines.length - 1) * -0.1 + (!!data[i].subtext ? 1 : 0) * 0.05;
      ctx.translate(
        centerX + Math.cos(angle + (arc + textOffset) / 2) * textRadius,
        centerY + Math.sin(angle + (arc + textOffset) / 2) * textRadius
      );

      const textRotationAngle = perpendicularText
        ? angle + arc / 2 + Math.PI / 2
        : angle + arc / 2;
      ctx.rotate(textRotationAngle);

      ctx.fillStyle = (style && style.textColor) as string;
      ctx.textAlign = 'right';

      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], canvas.width / 7, fontSize / 2.7 + i * fontSize);
      }

      if (data[i].subtext) {
        const subtext = data[i].subtext as string;
        ctx.fillStyle = (style && style.subtextColor) as string;
        ctx.font = `bold ${fontSize / 1.5}px ${fontFamily}`;
        ctx.fillText(subtext, canvas.width / 7, -(fontSize / 2.7) - 10);
      }

      ctx.restore();
    }
  }
};

const WheelCanvas = ({
  data,
  initialRotation,
  outerBorderColor,
  outerBorderWidth,
  innerRadius,
  innerBorderColor,
  innerBorderWidth,
  radiusLineColor,
  radiusLineWidth,
  fontSize,
  fontFamily,
  perpendicularText,
  textDistance,
  textWrapDistance,
}: WheelCanvasProps) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const drawWheelProps = {
    initialRotation,
    outerBorderColor,
    outerBorderWidth,
    innerRadius,
    innerBorderColor,
    innerBorderWidth,
    radiusLineColor,
    radiusLineWidth,
    fontSize,
    fontFamily,
    perpendicularText,
    textDistance,
    textWrapDistance,
  };

  useEffect(() => {
    drawWheel(canvasRef, data, drawWheelProps);
  }, [canvasRef, data, drawWheelProps]);

  return (
    <canvas className="rcr-canvas" ref={canvasRef} width="900" height="900" />
  );
};

export default WheelCanvas;
