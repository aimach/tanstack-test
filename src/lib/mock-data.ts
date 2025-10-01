// Données simulées pour les tests
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: "admin" | "user" | "moderator";
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  createdAt: string;
}

// Données simulées
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Martin",
    email: "alice@example.com",
    age: 28,
    role: "admin",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    name: "Bob Dupont",
    email: "bob@example.com",
    age: 35,
    role: "user",
    createdAt: "2024-02-20T14:15:00Z",
  },
  {
    id: 3,
    name: "Claire Bernard",
    email: "claire@example.com",
    age: 42,
    role: "moderator",
    createdAt: "2024-03-10T09:45:00Z",
  },
];

export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Introduction à TanStack Query",
    content:
      "TanStack Query est une librairie puissante pour la gestion des données...",
    authorId: 1,
    published: true,
    createdAt: "2024-01-20T11:00:00Z",
  },
  {
    id: 2,
    title: "Formulaires avec TanStack Form",
    content:
      "TanStack Form offre une approche performante pour gérer les formulaires...",
    authorId: 2,
    published: false,
    createdAt: "2024-02-25T16:30:00Z",
  },
  {
    id: 3,
    title: "Validation avec Zod",
    content: "Zod permet de valider facilement les données avec TypeScript...",
    authorId: 1,
    published: true,
    createdAt: "2024-03-15T13:20:00Z",
  },
];

// Fonctions simulées pour les appels API
export const userApi = {
  getUsers: async (): Promise<User[]> => {
    // Simulation d'un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return mockUsers;
  },

  getUser: async (id: number): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockUsers.find((user) => user.id === id) || null;
  },

  createUser: async (
    userData: Omit<User, "id" | "createdAt">
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const newUser: User = {
      ...userData,
      id: Math.max(...mockUsers.map((u) => u.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return mockUsers[userIndex];
  },

  deleteUser: async (id: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      throw new Error("Utilisateur non trouvé");
    }
    mockUsers.splice(userIndex, 1);
  },
};

export const postApi = {
  getPosts: async (): Promise<Post[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    return mockPosts;
  },

  getPost: async (id: number): Promise<Post | null> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockPosts.find((post) => post.id === id) || null;
  },

  createPost: async (
    postData: Omit<Post, "id" | "createdAt">
  ): Promise<Post> => {
    await new Promise((resolve) => setTimeout(resolve, 900));
    const newPost: Post = {
      ...postData,
      id: Math.max(...mockPosts.map((p) => p.id)) + 1,
      createdAt: new Date().toISOString(),
    };
    mockPosts.push(newPost);
    return newPost;
  },
};
