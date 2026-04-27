export interface GitHubUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
}

export default class GitHubStore {
  /**
   * Fetches GitHub user data for a list of usernames.
   * @param usernames An array of GitHub usernames to fetch data for.
   * @returns A promise that resolves to an array of GitHubUser objects.
   */
  public async getUsers(usernames: string[]): Promise<GitHubUser[]> {
    return Promise.all(
      usernames.map(async (username) => {
        const res = await fetch(`https://api.github.com/users/${username}`)
        if (!res.ok) {
          return {
            login: username,
            name: null,
            avatar_url: "",
            html_url: `https://github.com/${username}`,
          } as GitHubUser
        }
        return (await res.json()) as GitHubUser
      }),
    )
  }
}
