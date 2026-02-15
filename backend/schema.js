import User from "./models/User.js";
import Task from "./models/Task.js";

export const typeDefs = `

type User {
  id: ID!
  name: String!
  email: String!
  tasks(page: Int!, limit: Int!): TaskPage!
}

type Task {
  id: ID!
  title: String!
  description: String
  completed: Boolean!
  priority: String!
  user: User!
}

type TaskPage {
  tasks: [Task!]!
  totalCount: Int!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  registerUser(name: String!, email: String!): User!
  addTask(title: String!, userId: ID!): Task!
  updateTask(id: ID!, title: String, completed: Boolean): Task!
  deleteTask(id: ID!): Boolean!
  updateUser(id: ID!, name: String, email: String): User!
  deleteUser(id: ID!): Boolean!

}


`;

export const resolvers = {

  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },

Mutation: {
  registerUser: async (_, { name, email }) =>
    await User.create({ name, email }),

  addTask: async (_, { title, userId }) =>
    await Task.create({ title, user: userId }),

  updateTask: async (_, { id, title, completed }) =>
    await Task.findByIdAndUpdate(
      id,
      { title, completed },
      { new: true }
    ),

  deleteTask: async (_, { id }) => {
    await Task.findByIdAndDelete(id);
    return true;
  },

  updateUser: async (_, { id, name, email }) => {
  return await User.findByIdAndUpdate(
    id,
    { name, email },
    { new: true }
  );
},

deleteUser: async (_, { id }) => {
  await Task.deleteMany({ user: id });
  await User.findByIdAndDelete(id);
  return true;
},

},


  User: {
    tasks: async (parent, { page, limit }) => {
      const skip = (page - 1) * limit;

      const tasks = await Task.find({ user: parent.id })
        .skip(skip)
        .limit(limit);

      const totalCount = await Task.countDocuments({
        user: parent.id
      });

      return { tasks, totalCount };
    }
  },

  Task: {
    user: async (parent) =>
      await User.findById(parent.user)
  }
};
