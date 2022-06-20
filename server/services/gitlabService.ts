import { git_token, api_urls } from '../config/config.json'
import axios from 'axios';

export class GitlabService {

  /**
   * Gets URL for Git Repo
   * @param GitlabId GitLab project id
   */
  public async getGitUrl(GitlabId: string): Promise<string> {
    return await axios
    .get(`${api_urls.gitlab}/projects/${GitlabId}/`,
      {headers: { 'Authorization': `Bearer ${git_token}`}})
    .then(res => {
      return res.data['http_url_to_repo'];
    })
    .catch((error: any) => {
      throw error;
    })
  }

  /**
   * Creates a new access token
   * @param GitlabId GitLab project id
   */
   public async getAccessToken(GitlabId: string): Promise<string> {
    return await axios
    .post(`${api_urls.gitlab}/projects/${GitlabId}/access_tokens`, {
        'name': 'auto_access_token',
        'scopes': ['write_repository'],
        'expires_at': null,
        'access_level': 40
      },
      {headers: { 'Authorization': `Bearer ${git_token}`}})
    .then(res => {
      return res.data['token'];
    })
    .catch((error: any) => {
      throw error;
    })
  }

}
