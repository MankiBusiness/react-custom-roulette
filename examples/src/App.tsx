import React, { useState } from 'react';
import './App.css';
import '../../src/styles.css';

import { Wheel } from '../../src/Wheel';

const data = [
    { text: 'REACT', subtext: 'hello' },
    { text: 'CUSTOM' },
    { text: 'ROULETTE', style: { textColor: '#f9dd50' } },
    { text: 'WHEEL' },
    { text: 'REACT (2)' },
    { text: 'CUSTOM (2)' },
    { text: 'ROULETTE (2)', style: { textColor: '#70bbe0' } },
    { text: 'WHEEL (2)' },
];

const backgroundColors = ['#ff8f43', '#70bbe0', '#0b3351', '#f9dd50'];
const textColors = ['#0b3351'];
const outerBorderColor = '#eeeeee';
const outerBorderWidth = 10;
const innerBorderColor = '#30261a';
const innerBorderWidth = 0;
const innerRadius = 0;
const radiusLineColor = '#eeeeee';
const radiusLineWidth = 8;
const fontSize = 17;
const textDistance = 60;

const App = () => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);

    const handleSpinClick = () => {
        const newPrizeNumber = Math.floor(Math.random() * data.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
    }

    return (
        <div className="App">
            <header className="App-header" style={{ width: '600px', height: '600px' }}>
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    width="100%"
                    height="100%"
                    backgroundColors={backgroundColors}
                    textColors={textColors}
                    fontSize={fontSize}
                    outerBorderColor={outerBorderColor}
                    outerBorderWidth={outerBorderWidth}
                    innerRadius={innerRadius}
                    innerBorderColor={innerBorderColor}
                    innerBorderWidth={innerBorderWidth}
                    radiusLineColor={radiusLineColor}
                    radiusLineWidth={radiusLineWidth}
                    // perpendicularText
                    textDistance={textDistance}
                    onStopSpinning={() => setMustSpin(false)}
                />
                <button className={'spin-button'} onClick={handleSpinClick}>
                    SPIN
                </button>
            </header>
        </div>
    );
};

export default App;