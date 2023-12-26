import { createSelector } from '@reduxjs/toolkit';

export const baseState = (state) => state;

export const selectedTheme = createSelector(baseState, ({ theme }) => theme?.type);

export const currentUser = createSelector(baseState, ({ auth }) => auth?.user?._id);
export const currentUserData = createSelector(baseState, ({ auth }) => auth?.user);
export const loggedInStatus = createSelector(baseState, ({ auth }) => auth);
