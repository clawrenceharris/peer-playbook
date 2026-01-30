'use client';

import { createPlatePlugin } from 'platejs/react';

import { StrategyHeaderElement } from '@/components/ui/strategy-header-node';

/**
 * Plate element: strategyHeader
 * Renders a stitched, non-editable UI block inside the editor for phase/title/steps.
 */
export const StrategyHeaderKit = [
  createPlatePlugin({
    key: 'strategyHeader',
    node: {
      isElement: true,
      isVoid: true,
    },
  }).configure({
    node: {
      component: StrategyHeaderElement,
    },
  }),
];

