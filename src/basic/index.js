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
    return this.fetchUser().then(user => {
      this.user = user;
      return this.user;
    }).catch(() => {
      return false;
    });
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

  addEventListener(eventName, callback) {
    // TODO
  }
}

export default BasicAuth;