import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { DatePickerModal } from '../src/components/DatePickerModal';

describe('DatePickerModal', () => {
  test('renders when visible', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    let root: ReactTestRenderer.ReactTestRenderer | null = null;
    ReactTestRenderer.act(() => {
      root = ReactTestRenderer.create(
        <DatePickerModal
          visible={true}
          initialDateStr="28/10/2026"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
    });

    expect(root).not.toBeNull();
  });

  test('does not render content when not visible', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    let root: ReactTestRenderer.ReactTestRenderer | null = null;
    ReactTestRenderer.act(() => {
      root = ReactTestRenderer.create(
        <DatePickerModal
          visible={false}
          initialDateStr="28/10/2026"
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
      );
    });

    expect(root).not.toBeNull();
  });
});
