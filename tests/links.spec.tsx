import React from 'react';
import { render, prettyDOM } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DemoEditor } from '../demo/init';

jest.mock('lit-element');

describe('links', () => {
  test('should render', () => {
    const { container, getAllByText } = render(
      <DemoEditor content='<a href="https://curvenote.com">curvenote.com</a>"' />,
    );
    const [target] = getAllByText('curvenote.com');
    expect(target).toBeInTheDocument();
    expect(target.getAttribute('href')).toBe('https://curvenote.com');
    expect(target.getAttribute('target')).toBe('_blank');
    expect(target.getAttribute('title')).toBe('https://curvenote.com');
    expect(target.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
