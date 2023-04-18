import React, { useEffect, useRef, useState } from "react";
import "./index.css";

interface AnimatedCostProps {
  cost: number;
}

const AnimatedCost: React.FC<AnimatedCostProps> = ({ cost }) => {
  const [previousCost, setPreviousCost] = useState(cost);
  const [animatedCost, setAnimatedCost] = useState<string>(cost.toFixed(2));
  const animationRef = useRef<number>(0);

  useEffect(() => {
    setPreviousCost(cost);
    animate();
  }, [cost]);

  useEffect(() => {
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const animate = () => {
    let start = parseFloat(previousCost.toFixed(2));
    const end = parseFloat(cost.toFixed(2));
    let step = (end - start) / 20; // Number of frames
    let count = start;
    let frame = 0;

    const animateFrame = () => {
      count += step;
      frame++;

      if (frame < 20) {
        setAnimatedCost(count.toFixed(2));
        animationRef.current = requestAnimationFrame(animateFrame);
      } else {
        setAnimatedCost(cost.toFixed(2));
        setPreviousCost(cost);
      }
    };

    animateFrame();
  };

  const getDigit = (digit: any, position: number): JSX.Element => {
    let digitClass = "digit";

    if (animatedCost.length >= position) {
      const animatedDigit = parseInt(
        animatedCost[animatedCost.length - position]
      );
      const previousDigit = parseInt(
        previousCost.toFixed(2)[previousCost.toFixed(2).length - position]
      );

      if (animatedDigit > previousDigit) {
        digitClass += " up";
      } else if (animatedDigit < previousDigit) {
        digitClass += " down";
      }
    }

    return (
      <span key={position} className={digitClass}>
        {digit}
      </span>
    );
  };

  const renderCost = () => {
    let digits = animatedCost.split(".")[0].split("");
    let result = [];
    let position = 1;

    for (let i = 0; i < digits.length; i++) {
      result.push(getDigit(digits[i], position));
      position++;
    }

    result.push(
      <span key="dot" className="dot">
        .
      </span>
    );

    digits = animatedCost.split(".")[1].split("");
    for (let i = 0; i < digits.length; i++) {
      result.push(getDigit(Number(digits[i]), position));
      position++;
    }

    // result.unshift(
    //   <span key="dollar" className="dollar">
    //     $
    //   </span>
    // );
    return result;
  };

  return <div className="cost">{renderCost()}</div>;
};

export default AnimatedCost;
