import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Circle, Path } from 'react-native-svg';

export const CirclePlus = ({ ...props }: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
    className="stroke-black dark:stroke-white"
  >
    <Circle
      cx={12}
      cy={12}
      r={10}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Path
      d="M8 12h8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
    <Path
      d="M12 8v8"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Svg>
);