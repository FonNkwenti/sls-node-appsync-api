"use-strict";

const AWS = require("aws-sdk");

AWS.config.update({ region: "us-west-1" });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const { v4: uuidv4 } = require("uuid");

const TableName = process.env.TABLE_NAME;

module.exports.handler = async (event) => {
  // const id = event.arguments.id

  const id = uuidv4();

  const name = event.arguments.name;
  const description = event.arguments.description;
  const timeStamp = new Date().toISOString();

  const params = {
    Item: {
      id,
      name,
      description,
      createAt: timeStamp,
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName,
  };
  let response = {};
  try {
    let results = await dynamodb.putItem(params).promise();
    response.statusCode = 200;
    response.body = JSON.stringify({
      message: "todo created successfully",
      results,
    });
  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.body = JSON.stringify({
      message: "Failed to created todo",
      errorMsg: error.message,
    });
  }

  return response;
};
