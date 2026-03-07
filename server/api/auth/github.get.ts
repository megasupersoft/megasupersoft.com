export default defineOAuthGitHubEventHandler({
  config: {
    scope: ['read:user'],
  },
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        login: user.login,
        avatarUrl: user.avatar_url,
        id: user.id,
      },
    })
    return sendRedirect(event, '/dashboard')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
