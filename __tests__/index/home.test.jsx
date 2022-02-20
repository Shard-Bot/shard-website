// __tests__/index.test.jsx

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../../src/pages/index';

describe('Home', () => {
	it('renders a heading', () => {
		render(<Home />);

		const heading = screen.getByRole('heading', {
			name: /hello/i,
		});

		expect(heading).toBeInTheDocument();
	});
});
