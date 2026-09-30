import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PostCard from '../../pages/posts/PostCard';

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('PostCard', () => {
  it('renders the post title and author', () => {
    renderWithRouter(
      <PostCard post={{ id: 1, postTitle: 'Narok: Part One', author: { username: 'bernd' }, body: 'Loved it.' }} />
    );
    expect(screen.getAllByText('Narok: Part One').length).toBeGreaterThan(0);
    expect(screen.getByText(/@bernd/)).toBeInTheDocument();
  });

  it('falls back gracefully when post fields are missing', () => {
    renderWithRouter(<PostCard post={{}} />);
    expect(screen.getByText('Untitled post')).toBeInTheDocument();
    expect(screen.getByText(/@Anonymous/)).toBeInTheDocument();
  });
});
