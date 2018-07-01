import { USER_LOGGED_IN } from '../types';
import { USER_LOGGED_OUT } from '../types';
import api from '../api';

export const userLoggedIn = user => ({
  type: USER_LOGGED_IN,
  user
});

export const userLoggedOut = user => ({
  type: USER_LOGGED_OUT
});

export const login = credentials => dispatch =>
  api.user.login(credentials).then(user => {
    localStorage.socialJWT = user.token;
    dispatch(userLoggedIn(user));
  });

  export const logout = () => dispatch => {
      localStorage.removeItem('socialJWT');
      dispatch(userLoggedOut());
    };
