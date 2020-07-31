import BasicAuth from './basic/index';
import OIDCAuth from './oidc/index';

const AUTHS = {
  oidc: OIDCAuth,
  basic: BasicAuth
};

function getAuthProvider(provider, options = {}) {
  const AuthProvider = AUTHS[provider];

  if (!AuthProvider) {
    throw new Error('Unknown auth provider', provider);
  }

  return new AuthProvider(options);
}

export default { getAuthProvider };
