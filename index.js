'use strict';

module.exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current time is ${new Date().toTimeString()} in ${process.env.NODE_ENV}.`,
    }),
  };

  callback(null, response);
};