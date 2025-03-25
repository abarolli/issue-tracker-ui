import apiClient from "./api-client";

class IssueService {
  private apiEndpoint = "/issues";
  private headers = {
    Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
  };

  async getIssue(id: number): Promise<any> {
    return apiClient
      .get(`${this.apiEndpoint}/${id}`, {
        headers: this.headers,
      })
      .then(({ data }) => data);
  }

  async saveIssue(data: any): Promise<any> {
    return apiClient
      .post(
        `${this.apiEndpoint}`,
        { ...data, assignees: [] },
        {
          headers: this.headers,
        }
      )
      .then(({ data }) => data);
  }

  async updateIssue(id: number, data: any): Promise<any> {
    return apiClient
      .patch(`${this.apiEndpoint}/${id}`, data, {
        headers: this.headers,
      })
      .then(({ data }) => data);
  }
}

export default new IssueService();
