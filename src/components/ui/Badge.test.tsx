/**
 * Unit tests for Badge Component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Badge } from './Badge';

describe('Badge Component', () => {
  it('should render with text', () => {
    const { getByText } = render(<Badge>New</Badge>);
    expect(getByText('New')).toBeTruthy();
  });

  it('should render with default variant', () => {
    const { getByText } = render(<Badge>Default</Badge>);
    expect(getByText('Default')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { getByText } = render(<Badge variant="secondary">Secondary</Badge>);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render with destructive variant', () => {
    const { getByText } = render(
      <Badge variant="destructive">Destructive</Badge>
    );
    expect(getByText('Destructive')).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(<Badge variant="outline">Outline</Badge>);
    expect(getByText('Outline')).toBeTruthy();
  });

  it('should render with success variant', () => {
    const { getByText } = render(<Badge variant="success">Success</Badge>);
    expect(getByText('Success')).toBeTruthy();
  });

  it('should render with warning variant', () => {
    const { getByText } = render(<Badge variant="warning">Warning</Badge>);
    expect(getByText('Warning')).toBeTruthy();
  });

  it('should render custom children (non-string)', () => {
    const { getByText } = render(
      <Badge>
        <Text>Custom Badge</Text>
      </Badge>
    );
    expect(getByText('Custom Badge')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { getByText } = render(
      <Badge className="custom-badge">Badge</Badge>
    );
    expect(getByText('Badge')).toBeTruthy();
  });

  it('should render with variant and className together', () => {
    const { getByText } = render(
      <Badge variant="success" className="extra-class">
        Combined
      </Badge>
    );
    expect(getByText('Combined')).toBeTruthy();
  });

  it('should handle empty string', () => {
    const { getByText } = render(<Badge></Badge>);
    expect(getByText('')).toBeTruthy();
  });

  it('should render multiple badges', () => {
    const { getByText } = render(
      <>
        <Badge variant="success">Active</Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="destructive">Error</Badge>
      </>
    );

    expect(getByText('Active')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
    expect(getByText('Error')).toBeTruthy();
  });

  it('should render badge with numeric children', () => {
    const { getByText } = render(<Badge>5</Badge>);
    expect(getByText('5')).toBeTruthy();
  });
});
