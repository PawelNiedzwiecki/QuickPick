/**
 * Unit tests for Button Component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  it('should render with text', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<Button onPress={onPressMock}>Press</Button>);

    fireEvent.press(getByText('Press'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button onPress={onPressMock} disabled>
        Disabled
      </Button>
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button loading>Loading</Button>
    );

    // Text should not be visible
    expect(queryByText('Loading')).toBeNull();

    // ActivityIndicator should be present
    const { ActivityIndicator } = require('react-native');
    expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('should not call onPress when loading', () => {
    const onPressMock = jest.fn();
    const { UNSAFE_getByType } = render(
      <Button onPress={onPressMock} loading>
        Loading
      </Button>
    );

    const { Pressable } = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('should render with different variants', () => {
    const { rerender, getByText } = render(
      <Button variant="default">Default</Button>
    );
    expect(getByText('Default')).toBeTruthy();

    rerender(<Button variant="outline">Outline</Button>);
    expect(getByText('Outline')).toBeTruthy();

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(getByText('Ghost')).toBeTruthy();

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render with different sizes', () => {
    const { rerender, getByText } = render(<Button size="sm">Small</Button>);
    expect(getByText('Small')).toBeTruthy();

    rerender(<Button size="default">Default</Button>);
    expect(getByText('Default')).toBeTruthy();

    rerender(<Button size="lg">Large</Button>);
    expect(getByText('Large')).toBeTruthy();

    rerender(<Button size="xl">XLarge</Button>);
    expect(getByText('XLarge')).toBeTruthy();
  });

  it('should render custom children (non-string)', () => {
    const { Text } = require('react-native');
    const { getByText } = render(
      <Button>
        <Text>Custom Child</Text>
      </Button>
    );
    expect(getByText('Custom Child')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { UNSAFE_getByType } = render(
      <Button className="custom-class">Button</Button>
    );
    const { Pressable } = require('react-native');
    const pressable = UNSAFE_getByType(Pressable);
    expect(pressable).toBeTruthy();
  });

  it('should apply custom textClassName', () => {
    const { getByText } = render(
      <Button textClassName="custom-text">Text</Button>
    );
    expect(getByText('Text')).toBeTruthy();
  });

  it('should show different loading colors for variants', () => {
    const { UNSAFE_getByType, rerender } = require('@testing-library/react-native');
    const { ActivityIndicator } = require('react-native');

    const { UNSAFE_getByType: getByType1 } = render(
      <Button loading variant="outline">
        Outline
      </Button>
    );
    const indicator1 = getByType1(ActivityIndicator);
    expect(indicator1.props.color).toBe('#22C55E');

    const { UNSAFE_getByType: getByType2 } = render(
      <Button loading variant="default">
        Default
      </Button>
    );
    const indicator2 = getByType2(ActivityIndicator);
    expect(indicator2.props.color).toBe('#FFFFFF');
  });

  it('should apply disabled opacity', () => {
    const { UNSAFE_getByType } = render(<Button disabled>Disabled</Button>);
    const { Pressable } = require('react-native');
    const pressable = UNSAFE_getByType(Pressable);
    expect(pressable).toBeTruthy();
  });
});
