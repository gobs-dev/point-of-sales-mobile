import * as React from 'react';
import type { SvgProps } from 'react-native-svg';
import Svg, { Path } from 'react-native-svg';

export const Trash = ({ ...props }: SvgProps) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    {...props}
    className="stroke-black dark:stroke-white"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 6h18"
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
    />
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
    />
  </Svg>
);