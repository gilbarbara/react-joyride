/* eslint-disable import-x/export */
import type { ReactElement } from 'react';
import type { Matcher, MatcherOptions } from '@testing-library/dom/types/matches';
import {
  buildQueries,
  queries,
  queryHelpers,
  render,
  type RenderOptions,
  type Screen,
  screen,
  within,
} from '@testing-library/react';

// The queryAllByAttribute is a shortcut for attribute-based matchers
// You can also use document.querySelector or a combination of existing
// testing library utilities to find matching nodes for your query
const queryAllById = (container: HTMLElement, id: Matcher, options?: MatcherOptions) =>
  queryHelpers.queryAllByAttribute('id', container, id, options);

const getMultipleError = (_: Element | null, idValue?: Matcher) =>
  `Found multiple elements with the id attribute of: ${idValue}`;
const getMissingError = (_: Element | null, idValue?: Matcher) =>
  `Unable to find an element with the id attribute of: ${idValue}`;

const [queryById, getAllById, getById, findAllById, findById] = buildQueries(
  queryAllById,
  getMultipleError,
  getMissingError,
);

const customQueries = {
  queryById,
  queryAllById,
  getById,
  getAllById,
  findAllById,
  findById,
};

const allQueries = {
  ...queries,
  ...customQueries,
};

const customScreen: Screen<typeof allQueries> = { ...screen, ...within(document.body, allQueries) };
const customWithin = (element: HTMLElement) => within(element, allQueries);
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'queries'>) =>
  render(ui, { queries: allQueries, ...options });

export * from './test-helpers';

// re-export everything
export * from '@testing-library/react';

export * from '@total-typescript/shoehorn';

// override methods
export { customRender as render, customScreen as screen, customWithin as within };
