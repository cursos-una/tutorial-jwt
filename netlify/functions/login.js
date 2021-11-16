"use strict"

const headers = require('./headersCORS');
const jwt = require("jsonwebtoken");

exports.handler = async (event, context) => {

  if (event.httpMethod == "OPTIONS") {
    return {statusCode: 200,headers,body: "OK"};
  }

  try {
		
		const { email, password } = event.body;

    if (!(email && password)) {
      return { statusCode: 400, headers, body:"All input is required");
    }

    let user = {'_id':1,'password':'','token':''};
    user.password = await bcrypt.hash('12345', 10);

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
     );

      user.token = token;
      return { statusCode: 200, headers, body: user};
    }
		return { statusCode: 400, headers, body: 'Invalid Credentials' };
  } catch (error) {
    console.log(error);
    return { statusCode: 422, headers, body: JSON.stringify(error) };
  }
};