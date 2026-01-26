import { render, screen } from '@testing-library/react';
import React from 'react';
// @ts-ignore
import App from '../src/App';

describe('App', () => {
    it('renders "new application" text', () => {
        render(React.createElement(App));
        expect(screen.getByText(/new application/i)).toBeInTheDocument();
    });
});
