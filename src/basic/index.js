/**
 * Basic Auth plugin.
 */
class BasicAuth {
  constructor({ loginPath = '/login', logoutPath = '/logout', fetchUser = null } = {}) {
    this.loginPath = loginPath;
    this.logoutPath = logoutPath;
    this.fetchUser = fetchUser;

    if (!this.fetchUser || typeof this.fetchUser !== 'function') {
      throw new Error('fetchUser is required and must be a function');
    }
  }

  init() {
    return this.fetchUser()
      .then(user => {
        this.user = user;

        return this.user;
      })
      .catch(() => false);
  }

  signin() {
    window.location = `${this.loginPath}?continue=${window.location.hash}`;

    return Promise.resolve();
  }

  isLoggedIn() {
    return !!this.user;
  }

  signout() {
    window.location.href = this.logoutPath;
  }

  getUser() {
    return this.user;
  }

  // eslint-disable-next-line class-methods-use-this
  addEventListener() {
    console.warn('Adding listener is not supported in basic auth');
  }
}

export default BasicAuth;
