import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('App Component', () => {
    it('renders without crashing', () => {
        // We wrap App in BrowserRouter because it likely contains Routes/Links
        render(
            <App />
        );
        // Basic smoke test - just checks if it renders. 
        // You can add more specific assertions based on your landing page.
        // For example, if you have a title "UniGIG":
        // expect(screen.getByText(/UniGIG/i)).toBeInTheDocument();
    });
});
