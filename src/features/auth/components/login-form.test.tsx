import type { LoginFormProps } from './login-form'

import * as React from 'react'

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils'
import { LoginForm } from './login-form'

afterEach(cleanup)

const onSubmitMock: jest.Mock<LoginFormProps['onSubmit']> = jest.fn()

describe('loginForm Form ', () => {
  it('renders correctly', async () => {
    setup(<LoginForm />)
    expect(await screen.findByTestId('form-title')).toBeOnTheScreen()
  })

  it('should display required error when values are empty', async () => {
    const { user } = setup(<LoginForm />)

    const button = screen.getByTestId('login-button')
    expect(screen.queryByText(/El correo electrónico es requerido/i)).not.toBeOnTheScreen()
    await user.press(button)
    expect(await screen.findByText(/El correo electrónico es requerido/i)).toBeOnTheScreen()
    expect(screen.getByText(/La contraseña es requerida/i)).toBeOnTheScreen()
  })

  it('should display matching error when email is invalid', async () => {
    const { user } = setup(<LoginForm />)

    const button = screen.getByTestId('login-button')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    await user.type(emailInput, 'yyyyy')
    emailInput.props.onBlur() // Manually trigger blur to set touched state
    await user.type(passwordInput, 'test')
    await user.press(button)

    expect(await screen.findByText(/Formato de correo no válido/i)).toBeOnTheScreen()
    expect(screen.queryByText(/El correo electrónico es requerido/i)).not.toBeOnTheScreen()
  })

  it('should call LoginForm with correct values when values are valid', async () => {
    const { user } = setup(<LoginForm onSubmit={onSubmitMock} />)

    const button = screen.getByTestId('login-button')
    const emailInput = screen.getByTestId('email-input')
    const passwordInput = screen.getByTestId('password-input')

    await user.type(emailInput, 'youssef@gmail.com')
    await user.type(passwordInput, 'password')
    await user.press(button)
    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledTimes(1)
    })
    // expect.objectContaining({}) because we don't want to test the target event we are receiving from the onSubmit function
    expect(onSubmitMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'youssef@gmail.com',
        password: 'password',
      }),
    )
  })
})
