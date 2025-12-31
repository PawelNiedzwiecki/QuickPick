/**
 * Unit tests for Input Component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from './Input';

describe('Input Component', () => {
  it('should render without label', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Username" placeholder="Enter username" />
    );
    expect(getByText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Enter username')).toBeTruthy();
  });

  it('should display error message', () => {
    const { getByText } = render(
      <Input error="This field is required" placeholder="Test" />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Test" onChangeText={onChangeTextMock} />
    );

    const input = getByPlaceholderText('Test');
    fireEvent.changeText(input, 'New text');

    expect(onChangeTextMock).toHaveBeenCalledWith('New text');
  });

  it('should accept value prop', () => {
    const { getByDisplayValue } = render(
      <Input value="Initial value" placeholder="Test" />
    );
    expect(getByDisplayValue('Initial value')).toBeTruthy();
  });

  it('should apply custom className', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test" className="custom-class" />
    );
    expect(getByPlaceholderText('Test')).toBeTruthy();
  });

  it('should apply custom containerClassName', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test" containerClassName="custom-container" />
    );
    expect(getByPlaceholderText('Test')).toBeTruthy();
  });

  it('should pass through TextInput props', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Test"
        maxLength={10}
        keyboardType="numeric"
        secureTextEntry
      />
    );

    const input = getByPlaceholderText('Test');
    expect(input.props.maxLength).toBe(10);
    expect(input.props.keyboardType).toBe('numeric');
    expect(input.props.secureTextEntry).toBe(true);
  });

  it('should have correct placeholder color', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Test" />
    );
    const input = getByPlaceholderText('Test');
    expect(input.props.placeholderTextColor).toBe('#94A3B8');
  });

  it('should render both label and error', () => {
    const { getByText } = render(
      <Input
        label="Email"
        error="Invalid email"
        placeholder="test@example.com"
      />
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('should handle empty strings for label and error', () => {
    const { queryByText, getByPlaceholderText } = render(
      <Input label="" error="" placeholder="Test" />
    );
    expect(getByPlaceholderText('Test')).toBeTruthy();
    // Empty strings should not render text
    expect(queryByText('')).toBeNull();
  });

  it('should handle multiline text input', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Description" multiline numberOfLines={4} />
    );
    const input = getByPlaceholderText('Description');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(4);
  });

  it('should handle editable prop', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Read only" editable={false} />
    );
    const input = getByPlaceholderText('Read only');
    expect(input.props.editable).toBe(false);
  });
});
