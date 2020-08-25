import OIDCStrategy from './strategy';

const DEFAULT_URL_PATTERN = /auth\/oidc\/callback/;

class OIDCAuth {
  constructor(options = {}) {
    this.options = options;
    this.strategy = new OIDCStrategy(options);
    this.callbackURLPattern = options.callbackURLPattern || DEFAULT_URL_PATTERN;
  }

  init() {
    // URL may be updated before now and the strategy.init promise resolution...
    const currentUrl = window.location.href;

    return this.strategy.init()
      .then(() => {
        if (currentUrl.match(this.callbackURLPattern)) {
          return this.strategy.completeAuthentication(currentUrl)
            .then(() => this._onSignIn());
        }

        if (!this.isLoggedIn()) {
          return false;
        }

        return this._onSignIn();
      });
  }

  _onSignIn() {
    this.options.onSignInComplete &&
    typeof this.options.onSignInComplete === 'function' &&
    this.options.onSignInComplete({ headers: { Authorization: this.strategy.getAuthorizationHeaderValue()}});

    return this.getUser();
  }

  login() {
    return this.strategy.startAuthentication();
  }

  isLoggedIn() {
    return this.strategy.isLoggedIn();
  }

  logout() {
    return this.strategy.startLogout();
  }

  getUser() {
    return this.strategy.getUser();
  }

  addEventListener(eventName, callback) {
    this.strategy.addListener(eventName, callback);
  }

  removeEventListener(eventName, callback) {
    this.strategy.removeListener(eventName, callback);
  }
}

export default OIDCAuth;
