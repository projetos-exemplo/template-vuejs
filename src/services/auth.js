import endpoints from "@/endpoints";
import api from "./api";

export default {  
  loggedIn() {
    const user = JSON.parse(localStorage.getItem('user'));
    return !!user;
  },

  async login(email, senha) {
    try {
      const data = {
        "userName": email,
        "password": senha,
        "client": "avmb",
        "portal": "super_admin"
      }
      const result = await api.post(endpoints.LOGIN, data); 
      const token = result.data.token;
      localStorage.setItem('token', token); 
      const userData = window.atob(token.split('.')[1])
      localStorage.setItem('user', JSON.stringify(userData));
      
      return {
        isOk: true
      };
    }
    catch (err) {
      console.log(err)
      return {
        isOk: false,
        message: err.response.data.Message
      };
    }
  },

  async logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  async getUser() {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      return {
        isOk: true,
        data: user
      };
    }
    catch {
      return {
        isOk: false
      };
    }
  },

  async resetPassword(email) {
    try {
      // Send request
      console.log(email);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to reset password"
      };
    }
  },

  async changePassword(email, recoveryCode) {
    try {
      // Send request
      console.log(email, recoveryCode);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to change password"
      }
    }
  },

  async createAccount(email, password) {
    try {
      // Send request
      console.log(email, password);

      return {
        isOk: true
      };
    }
    catch {
      return {
        isOk: false,
        message: "Failed to create account"
      };
    }
  }
};
