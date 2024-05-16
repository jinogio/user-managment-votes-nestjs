export default () => ({
  // port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.MONGO_URL,
  },
  auth: {
    secret: process.env.KEY,
  },

  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
});
// abc
