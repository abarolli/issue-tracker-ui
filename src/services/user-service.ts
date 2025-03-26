import apiClient from "./api-client";

class UserService {
  private apiEndpoint = "/users";
  private headers = {
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
  };

  async getUser(id: number): Promise<any> {
    return apiClient
      .get(`${this.apiEndpoint}/${id}`, {
        headers: this.headers,
      })
      .then(({ data }) => data);
  }

  async getUsers(): Promise<any> {
    return apiClient
      .get(`${this.apiEndpoint}`, {
        headers: this.headers,
      })
      .then(({ data }) => data);
  }
}

export default UserService;
