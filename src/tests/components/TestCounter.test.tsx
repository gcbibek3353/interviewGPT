import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

describe('Test Component which will be removed Later', () => {
    it('should increment count when add button is clicked', () => {
        expect(screen.getByRole('heading')).toHaveTextContent('0');
        userEvent.click(screen.getByText('add'));
        expect(screen.getByRole('heading')).toHaveTextContent('1');
    })
})