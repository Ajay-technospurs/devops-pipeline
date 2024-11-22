import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Header from './header';

describe('Header Component', () => {
  it('renders the title correctly', () => {
    render(<Header title="Projects" />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('does not render action button when actionType is not provided', () => {
    render(<Header title="Projects" />);
    expect(screen.queryByTestId('header-action-button')).not.toBeInTheDocument();
  });

  // TODO
  // it('renders add button when actionType is add', () => {
  //   render(<Header title="Projects" actionType="add" />);
  //   const button = screen.getByTestId('header-action-button');
  //   expect(button).toBeInTheDocument();
  //   expect(button.querySelector('svg')).toBeInTheDocument();
  // });

  it('renders close button when actionType is close', () => {
    render(<Header title="Search Canvas" actionType="close" />);
    const button = screen.getByTestId('header-action-button');
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('renders info button when actionType is info', () => {
    render(<Header title="Palettes" actionType="info" />);
    const button = screen.getByTestId('header-action-button');
    expect(button).toBeInTheDocument();
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('calls onActionClick when action button is clicked', async () => {
    const handleClick = jest.fn();
    render(
      <Header title="Projects" actionType="add" onActionClick={handleClick} />
    );
    
    const button = screen.getByTestId('header-action-button');
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});