// __tests__/components/ui/select.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '@/components/ui/select';

const options = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' },
];

describe('Select', () => {
  it('should render the select field', () => {
    render(<Select options={options} value="option1" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Option 1' })).toBeInTheDocument();
  });

  it('should open the dropdown menu when clicked', async () => {
    render(<Select options={options} value="option1" onChange={() => {}} />);
    const buttonElement = screen.getByRole('button', { name: 'Option 1' });
    await userEvent.click(buttonElement);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('should call the onChange function when an option is selected', async () => {
    const mockOnChange = jest.fn();
    render(<Select options={options} value="option1" onChange={mockOnChange} />);
    const buttonElement = screen.getByRole('button', { name: 'Option 1' });
    await userEvent.click(buttonElement);
    const option2Element = screen.getByRole('option', { name: 'Option 2' });
    await userEvent.click(option2Element);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('should display the selected value in the button', () => {
    render(<Select options={options} value="option2" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Option 2' })).toBeInTheDocument();
  });
});