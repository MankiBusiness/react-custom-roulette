import React, { useState, useEffect, useRef } from 'react';

import WheelCanvas from './WheelCanvas';
import { getRotationDegrees } from './utils';
import {
  DEFAULT_WIDTH,
  DEFAULT_HEIGHT,
  DEFAULT_BACKGROUND_COLORS,
  DEFAULT_TEXT_COLORS,
  DEFAULT_OUTER_BORDER_COLOR,
  DEFAULT_OUTER_BORDER_WIDTH,
  DEFAULT_INNER_RADIUS,
  DEFAULT_INNER_BORDER_COLOR,
  DEFAULT_INNER_BORDER_WIDTH,
  DEFAULT_RADIUS_LINE_COLOR,
  DEFAULT_RADIUS_LINE_WIDTH,
  DEFAULT_FONT_SIZE,
  DEFAULT_FONT_FAMILY,
  DEFAULT_TEXT_DISTANCE,
  DEFAULT_INITIAL_ROTATION,
  DEFAULT_CURSOR_OFFSET,
} from './strings';
// @ts-ignore
import rouletteSelectorImage from './assets/roulette-selector.png';

interface Props {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: WheelData[];
  initialRotation?: number;
  cursorOffset?: number;
  onStopSpinning?: () => any;
  width?: string;
  height?: string;
  customSelectorImage?: string;
  backgroundColors?: string[];
  textColors?: string[];
  outerBorderColor?: string;
  outerBorderWidth?: number;
  innerRadius?: number;
  innerBorderColor?: string;
  innerBorderWidth?: number;
  radiusLineColor?: string;
  radiusLineWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  perpendicularText?: boolean;
  textDistance?: number;
  textWrapDistance?: number;
}

export interface WheelData {
  text: string;
  subtext?: string;
  style?: StyleType;
}

export interface StyleType {
  backgroundColor?: string;
  textColor?: string;
  subtextColor?: string;
}

const STARTED_SPINNING = 'rcr-started-spinning';

const START_SPINNING_TIME = 1400;
const CONTINUE_SPINNING_TIME = 1250;
const STOP_SPINNING_TIME = 4000;

export const Wheel = ({
  mustStartSpinning,
  prizeNumber,
  data,
  onStopSpinning = () => null,
  initialRotation = DEFAULT_INITIAL_ROTATION,
  cursorOffset = DEFAULT_CURSOR_OFFSET,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  customSelectorImage = '',
  backgroundColors = DEFAULT_BACKGROUND_COLORS,
  textColors = DEFAULT_TEXT_COLORS,
  outerBorderColor = DEFAULT_OUTER_BORDER_COLOR,
  outerBorderWidth = DEFAULT_OUTER_BORDER_WIDTH,
  innerRadius = DEFAULT_INNER_RADIUS,
  innerBorderColor = DEFAULT_INNER_BORDER_COLOR,
  innerBorderWidth = DEFAULT_INNER_BORDER_WIDTH,
  radiusLineColor = DEFAULT_RADIUS_LINE_COLOR,
  radiusLineWidth = DEFAULT_RADIUS_LINE_WIDTH,
  fontSize = DEFAULT_FONT_SIZE,
  fontFamily = DEFAULT_FONT_FAMILY,
  perpendicularText = false,
  textDistance = DEFAULT_TEXT_DISTANCE,
  textWrapDistance,
}: Props) => {
  const [wheelData, setWheelData] = useState<WheelData[]>([...data]);
  const [startRotationDegrees, setStartRotationDegrees] = useState(0);
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);

  const mustStopSpinning = useRef<boolean>(false);

  useEffect(() => {
    const dataLength = data.length;
    const wheelDataAux = [{ text: '', subtext: '' }] as WheelData[];
    for (let i = 0; i < dataLength; i++) {
      wheelDataAux[i] = {
        ...data[i],
        style: {
          backgroundColor:
            data[i].style?.backgroundColor ||
            backgroundColors[i % backgroundColors.length],
          textColor:
            data[i].style?.textColor || textColors[i % textColors.length],
          subtextColor:
            data[i].style?.subtextColor ||
            data[i].style?.textColor ||
            textColors[i % textColors.length],
        },
      };
    }
    setWheelData([...wheelDataAux]);
    setIsDataUpdated(true);
  }, [data, backgroundColors, textColors]);

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);
      startSpinning();
      const finalRotationDegreesCalculated = getRotationDegrees(
        prizeNumber,
        data.length,
        cursorOffset
      );
      setFinalRotationDegrees(finalRotationDegreesCalculated);
    }
  }, [mustStartSpinning]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false);
      setStartRotationDegrees(finalRotationDegrees);
    }
  }, [hasStoppedSpinning]);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setHasStoppedSpinning(false);
    mustStopSpinning.current = true;
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false;
        setHasStartedSpinning(false);
        setHasStoppedSpinning(true);
        onStopSpinning();
      }
    }, START_SPINNING_TIME + CONTINUE_SPINNING_TIME + STOP_SPINNING_TIME - 300);
  };

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return '';
  };

  if (!isDataUpdated) {
    return null;
  }

  return (
    <div className="rcr-roulette-container" style={{ width, height }}>
      <div className="rcr-aspect-container">
        <div
          className={['rcr-rotation-container', getRouletteClass()].join(' ')}
        >
          <WheelCanvas
            data={wheelData}
            initialRotation={initialRotation}
            outerBorderColor={outerBorderColor}
            outerBorderWidth={outerBorderWidth}
            innerRadius={innerRadius}
            innerBorderColor={innerBorderColor}
            innerBorderWidth={innerBorderWidth}
            radiusLineColor={radiusLineColor}
            radiusLineWidth={radiusLineWidth}
            fontSize={fontSize}
            fontFamily={fontFamily}
            perpendicularText={perpendicularText}
            textDistance={textDistance}
            textWrapDistance={textWrapDistance}
          />
        </div>
        <img
          className="rcr-roulette-selector-image"
          src={customSelectorImage || rouletteSelectorImage}
          alt="roulette-static"
        />
      </div>
      <style>{`
        .rcr-rotation-container {
          transform: rotate(${startRotationDegrees}deg);
        }

        .rcr-rotation-container.rcr-started-spinning {
          animation: 
            rcr-spin ${(START_SPINNING_TIME + CONTINUE_SPINNING_TIME) / 1000}s
              cubic-bezier(0.71, -0.29, 0.96, 0.9) 0s 1 normal forwards running,
            rcr-stop-spin ${STOP_SPINNING_TIME / 1000}s
              cubic-bezier(.4, .42, .02, 1.03)
              ${(START_SPINNING_TIME + CONTINUE_SPINNING_TIME) / 1000}s
              1 normal forwards running;
        }
      
        @keyframes rcr-spin {
          from {
            transform: rotate(${startRotationDegrees}deg);
          }
          to {
            transform: rotate(${startRotationDegrees + 360}deg);
          }
        }
        @keyframes rcr-stop-spin {
          from {
            transform: rotate(${startRotationDegrees}deg);
          }
          to {
            transform: rotate(${1440 + finalRotationDegrees}deg);
          }
        }
      `}</style>
    </div>
  );
};
