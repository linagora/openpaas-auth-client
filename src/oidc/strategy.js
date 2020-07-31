import { UserManager } from 'oidc-client';

const EVENTS = [
  'userLoaded',
  'userUnloaded',
  'accessTokenExpiring',
  'accessTokenExpired',
  'silentRenewError',
  'userSignedOut'
];

const ADD_EVENTS = new Map(EVENTS.map(event => ([event, `add${uppercaseFirstLetter(event)}`])));
const REMOVE_EVENTS = new Map(EVENTS.map(event => ([event, `remove${uppercaseFirstLetter(event)}`])));

function uppercaseFirstLetter(name) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

class OIDCStrategy {
  // eslint-disable-next-line no-warning-comments
  // TODO
  // Check if we need to pass options or defaults for
  // userStore: new WebStorageStateStore(),
  // loadUserInfo: true,
  // automaticSilentSignin: true
  constructor(options) {
    this.options = options;
    this.oidcUserManager = new UserManager(this.options);
  }

  init() {
    return this.oidcUserManager.getUser()
      .then(user => {
        this.user = user;
      });
  }

  addListener(eventName, callback) {
    const event = ADD_EVENTS.get(eventName);

    if (!event || !this.oidcUserManager.events[event]) {
      throw new Error(`Can not add listener: ${eventName} does not exist`);
    }

    this.oidcUserManager.events[event](callback);
  }

  removeListener(eventName, callback) {
    const event = REMOVE_EVENTS.get(eventName);

    if (!event || !this.oidcUserManager.events[event]) {
      throw new Error(`Can not remove listener: ${eventName} does not exist`);
    }

    this.oidcUserManager.events[event](callback);
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

  startAuthentication() {
    return this.oidcUserManager.signinRedirect();
  }

  completeAuthentication(url) {
    return this.oidcUserManager.signinRedirectCallback(url)
      .then(user => {
        this.user = user;
      });
  }

  /**
   *
   * @param {Boolean} global: If for some reason you want to signout only for the current application, set global to false.
   */
  startLogout(global = true) {
    if (!global) {
      return this.oidcUserManager.removeUser().then(() => {
        this.user = null;
      });
    }

    return this.oidcUserManager.signoutRedirect();
  }

  completeLogout(url) {
    return this.oidcUserManager.signoutRedirectCallback(url);
  }
}

export default OIDCStrategy;
