module.exports = {
  Query: {
    allLinks: async (root, data, { mongo: {Links} }) => {
      return await Links.find({}).toArray();
    }
  },
  Mutation: {
    //create User mutation
    createUser: async (root, data, { mongo: {Users} }) => {
      //convert given parameters into format users 
      //for the 'User' type. grabbing email and password from authProviders
      const newUser = {
        name: data.name,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      };
      const response =await Users.insert(newUser);
      return Object.assign({ id: response.insertedIds[0]}, newUser);
    },

      //sign in user mutation
    signinUser : async (root, data, { mongo: {Users} }) => {
      const user = await Users.findOne({ email: data.email.email });
      if (data.email.password === user.password) {
        return { token: `token-${user.email}`, user};
      }
    },

    createLink: async (root, data, { mongo: {Links}, user }) => {
      const newLink = Object.assign({postedById: user && user._id}, data)
      const response = await Links.insert(newLink);
      return Object.assign({ id: response.insertedIds[0]}, newLink);
    },
  },

  User: {
    id: root => root.id || root._id
  },

  Link: {
    id: root => root._id || root.id,

    postedBy: async ({postedById}, data, {mongo: {Users}}) => {
      return await Users.findOne({_id: postedById});
    }
  },
};