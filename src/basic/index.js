/**
 * Basic Auth plugin.
 */
class BasicAuth {
  constructor({ loginPath = '/login', logoutPath = '/logout', fetchUser = null } = {}) {
    this.loginPath = loginPath;
    this.logoutPath = logoutPath;
    this.fetchUser = fetchUser;

    if (!this.fetchUser) {
      throw new Error('fetchUser is required');
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

  login() {
    window.location = `${this.loginPath}?continue=${window.location.hash}`;

    return Promise.resolve();
  }

  isLoggedIn() {
    return !!this.user;
  }

  logout() {
    window.location = this.options.logoutPath;
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
