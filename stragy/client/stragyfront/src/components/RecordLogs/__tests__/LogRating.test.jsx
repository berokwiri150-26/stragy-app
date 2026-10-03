import {render, screen} from '@testing-library/react';
import {describe, it, expect} from 'vitest';
import LogRating from '../LogRating';

describe('LogRating', () => {
    it('renders a rating to one decimal place', () => {
        render(<LogRating rating={8.456} />);
        expect(screen.getByText('8.5')).toBeInTheDocument();
    });

    it('renders a rating of 0 when no rating is provided', () => {
        const { container } = render(<LogRating rating={null} />);
        expect (container).toBeEmptyDomElement();

});
});
