import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import * as mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'

import { Register } from '.';
import { ThemeProvider } from 'styled-components/native'
import theme from '../../styles/theme'

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)

const Providers: React.FC = ({ children }) => (
    <ThemeProvider theme={theme}>{ children }</ThemeProvider>
)

describe('Register Screen', () => {
    it('should be open category modal when user click on button', async () => {
        const { getByTestId } = render(
                <Register />,
            {
                wrapper: Providers
            }
        );
        
        const categoryModal = getByTestId('modal-category');
        const buttonCategory = getByTestId('button-category');
        fireEvent.press(buttonCategory);

        await waitFor(() => {
            expect(categoryModal.props.visible).toBeTruthy();
        })
        
    });
})