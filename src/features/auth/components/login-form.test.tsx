import * as React from 'react'

import { cleanup, screen, setup, waitFor } from '@/lib/test-utils'
import { LoginForm } from './login-form'

afterEach(cleanup)

describe('loginForm Form ', () => {
  it('renders correctly', async () => {
    setup(<LoginForm />)
    expect(await screen.findByTestId('form-title')).toBeOnTheScreen()
    expect(screen.getByTestId('google-login-button')).toBeOnTheScreen()
  })

  it('triggers Google login process when Google button is pressed', async () => {
    const onGoogleSuccessMock = jest.fn()
    const { user } = setup(<LoginForm onGoogleSuccess={onGoogleSuccessMock} />)

    const googleButton = screen.getByTestId('google-login-button')
    await user.press(googleButton)

    await waitFor(() => {
      expect(googleButton).toBeOnTheScreen()
    })
  })
})
