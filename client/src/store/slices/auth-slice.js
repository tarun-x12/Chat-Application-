// auth-store.js
class AuthStore {
  constructor(set) {
    this.set = set;
    this.userInfo = undefined;
  }

  setUserInfo(userInfo) {
    this.set({ userInfo });
  }
}

export default AuthStore;
  