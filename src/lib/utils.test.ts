/**
 * Unit tests for lib utility functions
 */

import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('class1', 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle conditional classes', () => {
    const result = cn('base', true && 'conditional', false && 'excluded');
    expect(result).toContain('base');
    expect(result).toContain('conditional');
    expect(result).not.toContain('excluded');
  });

  it('should merge Tailwind classes correctly', () => {
    // twMerge should override conflicting classes
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });

  it('should handle arrays of classes', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle objects with boolean values', () => {
    const result = cn({
      'class1': true,
      'class2': false,
      'class3': true,
    });
    expect(result).toContain('class1');
    expect(result).toContain('class3');
    expect(result).not.toContain('class2');
  });

  it('should handle undefined and null values', () => {
    const result = cn('class1', undefined, null, 'class2');
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  it('should handle empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should merge conflicting Tailwind utilities', () => {
    // Test that later classes override earlier ones
    const result = cn('text-sm', 'text-lg');
    expect(result).toContain('text-lg');
    expect(result).not.toContain('text-sm');
  });
});
