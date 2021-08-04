import { Log, UserManager } from 'oidc-client';

const EVENTS_MAPPING = new Map([
  ['userLoaded', 'userLoaded'],
  ['userUnloaded', 'userUnloaded'],
  ['userSignedOut', 'userSignedOut'],
  ['sessionExpiring', 'accessTokenExpiring'],
  ['sessionExpired', 'accessTokenExpired'],
  ['silentRenewError', 'silentRenewError']
]);

function uppercaseFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

class OIDCStrategy {
  constructor(options) {
    this.options = options;
    Log.logger = console;
    Log.info('OIDC Options', this.options);
    this.oidcUserManager = new UserManager(this.options);
  }

  init() {
    return this.oidcUserManager.getUser()
      .then(user => {
        this.user = user;
      });
  }

  addListener(eventName, callback) {
    const event = EVENTS_MAPPING.get(eventName);

    if (!event) {
      throw new Error(`'${eventName}' is not a valid event name`);
    }

    const listenerName = `add${uppercaseFirstLetter(event)}`;

    if (!this.oidcUserManager.events[listenerName]) {
      throw new Error(`Can not add listener: ${eventName} does not exist`);
    }

    this.oidcUserManager.events[listenerName](callback);
  }

  removeListener(eventName, callback) {
    const event = EVENTS_MAPPING.get(eventName);

    if (!event) {
      throw new Error(`'${eventName}' is not a valid event name`);
    }

    const listenerName = `add${uppercaseFirstLetter(event)}`;

    if (!this.oidcUserManager.events[listenerName]) {
      throw new Error(`Can not remove listener: ${eventName} does not exist`);
    }

    this.oidcUserManager.events[listenerName](callback);
  }

  isLoggedIn() {
    return this.user !== null && !this.user.expired;
  }

  getUser() {
    return this.user;
  }

  getAuthorizationHeaderValue() {
    return `${this.user.token_type} ${this.user.access_token}`;
  }

  signin() {
    this._storePreviousUrl();

    return this.oidcUserManager.signinRedirect();
  }

  completeSignin(url) {
    return this.oidcUserManager.signinRedirectCallback(url)
      .then(user => {
        this.user = user;
        this._redirectToPreviousUrl();
      });
  }

  /**
   *
   * @param {Boolean} global: If for some reason you want to signout only for the current application, set global to false.
   */
  signout(global = true) {
    if (!global) {
      return this.oidcUserManager.removeUser().then(() => {
        this.user = null;
      });
    }

    return this.oidcUserManager.signoutRedirect();
  }

  completeSignout(url) {
    return this.oidcUserManager.signoutRedirectCallback(url);
  }

  _storePreviousUrl() {
    window.localStorage.setItem('previousUrl', window.location.href);
  }

  _redirectToPreviousUrl() {
    const previousUrl = window.localStorage.getItem('previousUrl');
    window.localStorage.removeItem('previousUrl');

    if (previousUrl) {
      window.location.href = previousUrl;
    }
  }
}

export default OIDCStrategy;
