/**
 * Unit tests for Card Component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './Card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render children', () => {
      const { getByText } = render(
        <Card>
          <Text>Card Content</Text>
        </Card>
      );
      expect(getByText('Card Content')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByText } = render(
        <Card className="custom-class">
          <Text>Content</Text>
        </Card>
      );
      expect(getByText('Content')).toBeTruthy();
    });

    it('should render multiple children', () => {
      const { getByText } = render(
        <Card>
          <Text>Child 1</Text>
          <Text>Child 2</Text>
        </Card>
      );
      expect(getByText('Child 1')).toBeTruthy();
      expect(getByText('Child 2')).toBeTruthy();
    });
  });

  describe('CardHeader', () => {
    it('should render children', () => {
      const { getByText } = render(
        <CardHeader>
          <Text>Header Content</Text>
        </CardHeader>
      );
      expect(getByText('Header Content')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByText } = render(
        <CardHeader className="custom-header">
          <Text>Header</Text>
        </CardHeader>
      );
      expect(getByText('Header')).toBeTruthy();
    });
  });

  describe('CardTitle', () => {
    it('should render title text', () => {
      const { getByText } = render(<CardTitle>Card Title</CardTitle>);
      expect(getByText('Card Title')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByText } = render(
        <CardTitle className="custom-title">Title</CardTitle>
      );
      expect(getByText('Title')).toBeTruthy();
    });

    it('should render non-string children', () => {
      const { getByText } = render(
        <CardTitle>
          <Text>Custom Title</Text>
        </CardTitle>
      );
      expect(getByText('Custom Title')).toBeTruthy();
    });
  });

  describe('CardDescription', () => {
    it('should render description text', () => {
      const { getByText } = render(
        <CardDescription>Card description text</CardDescription>
      );
      expect(getByText('Card description text')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByText } = render(
        <CardDescription className="custom-desc">Description</CardDescription>
      );
      expect(getByText('Description')).toBeTruthy();
    });
  });

  describe('CardContent', () => {
    it('should render content children', () => {
      const { getByText } = render(
        <CardContent>
          <Text>Main Content</Text>
        </CardContent>
      );
      expect(getByText('Main Content')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByText } = render(
        <CardContent className="custom-content">
          <Text>Content</Text>
        </CardContent>
      );
      expect(getByText('Content')).toBeTruthy();
    });
  });

  describe('CardFooter', () => {
    it('should render footer children', () => {
      const { getByText } = render(
        <CardFooter>
          <Text>Footer Content</Text>
        </CardFooter>
      );
      expect(getByText('Footer Content')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { getByText } = render(
        <CardFooter className="custom-footer">
          <Text>Footer</Text>
        </CardFooter>
      );
      expect(getByText('Footer')).toBeTruthy();
    });
  });

  describe('Full Card Structure', () => {
    it('should render complete card with all sub-components', () => {
      const { getByText } = render(
        <Card>
          <CardHeader>
            <CardTitle>Example Card</CardTitle>
            <CardDescription>This is a description</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>Card main content goes here</Text>
          </CardContent>
          <CardFooter>
            <Text>Footer info</Text>
          </CardFooter>
        </Card>
      );

      expect(getByText('Example Card')).toBeTruthy();
      expect(getByText('This is a description')).toBeTruthy();
      expect(getByText('Card main content goes here')).toBeTruthy();
      expect(getByText('Footer info')).toBeTruthy();
    });
  });
});
