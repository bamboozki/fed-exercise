import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

describe('Accordion Component', () => {
  it('renders the title', () => {
    render(<Accordion title="Test Title">Content</Accordion>);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<Accordion title="Test Title">Hidden Content</Accordion>);
    expect(screen.queryByText('Hidden Content')).not.toBeInTheDocument();
  });

  it('shows content when clicked', () => {
    render(<Accordion title="Test Title">Visible Content</Accordion>);
    fireEvent.click(screen.getByText('Test Title'));
    expect(screen.getByText('Visible Content')).toBeInTheDocument();
  });

  it('hides content when clicked again', () => {
    render(<Accordion title="Test Title">Toggle Content</Accordion>);
    const button = screen.getByText('Test Title');
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.queryByText('Toggle Content')).not.toBeInTheDocument();
  });
});
