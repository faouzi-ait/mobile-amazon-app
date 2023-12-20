import { createSelector } from '@reduxjs/toolkit';

export const baseState = (state) => state.theme;
export const selectedTheme = createSelector(baseState, ({ type }) => type);
