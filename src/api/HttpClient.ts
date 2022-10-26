export class HttpClient {
  static baseUrl = process.env.BASE_URL || 'http://localhost:3001';

  static async signIn(data: { username: string; password: string }) {
    const parameters = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    try {
      let token;
      let message;
      let username;
      let userId;
      await fetch(`${HttpClient.baseUrl}/sign-in`, parameters)
        .then((response) => response.json())
        .then((res) => {
          token = res.token;
          userId = res.userId;
          username = res.username;
          message = res.message;
        });
      return { token, userId, username, message };
    } catch (err) {
      return { token: null, username: null, userId: null, message: err };
    }
  }

  static async signUp(data: {
    username: string;
    email: string;
    password: string;
  }) {
    const parameters = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    try {
      let token;
      let message;
      let username;
      let userId;
      await fetch(`${HttpClient.baseUrl}/sign-up`, parameters)
        .then((response) => response.json())
        .then((res) => {
          token = res.token;
          userId = res.userId;
          username = res.username;
          message = res.message;
        });
      return { token, userId, username, message };
    } catch (err) {
      return { token: null, username: null, userId: null, message: err };
    }
  }

  static async getUsers(): Promise<{ message: string; users?: UserDTO[] }> {
    return await fetch(`${HttpClient.baseUrl}/users`)
      .then((response) => response.json())
      .then((res) => res);
  }

  static async createChat(data: {
    chatName: string;
    chatUsers: (string | null | undefined)[];
  }) {
    const parameters = {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };
    return await fetch(`${HttpClient.baseUrl}/create-chat`, parameters)
      .then((response) => response.json())
      .then((res) => res);
  }

  static async getChats(userId: string) {
    return await fetch(`${HttpClient.baseUrl}/chats?userId=${userId}`)
      .then((response) => response.json())
      .then((res) => res);
  }

  static async deleteChat(chatName: string) {
    const parameters = {
      method: 'DELETE',
      body: JSON.stringify({ chatName }),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    };

    return await fetch(`${HttpClient.baseUrl}/delete-chat`, parameters)
      .then((response) => response.json())
      .then((res) => res);
  }
}

export type UserDTO = {
  username: string;
  userId: string;
};
