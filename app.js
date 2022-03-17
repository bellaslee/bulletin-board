/**
 * Bella Lee
 * 2/25/2022
 * Section AH Shriya Kurpad
 *
 * Returns and writes to bulletin board messages file. Returns journal prompts.
 */

'use strict';

const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs').promises;

const INVALID = 400;
const SERVER = 500;
const OOPS = 'Oops! Something went wrong on the server.';
const PORT_NUMBER = 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

/**
 * Writes to the message file if the password is correct and the title has not already been used.
 * Returns messages as JSON Object.
 */
app.post('/messages', async function(req, res) {
  let title = req.body.title;
  let message = req.body.message;
  let name = req.body.name;

  if (req.body.pwd === 'cse154') {
    try {
      let messages = await readMessageFile();
      let keys = Object.keys(messages);

      if (keys.includes(title)) {
        res.type('text').status(INVALID)
          .send('Title already exists. Pick a different title.');
      } else {
        messages[title] = {
          'message': message,
          'name': name
        };
        await fs.writeFile('messages.json', JSON.stringify(messages));
        res.type('json').send(messages);
      }
    } catch (error) {
      res.type('text').status(SERVER)
        .send(OOPS);
    }
  } else {
    res.type('text').status(INVALID)
      .send('Incorrect password.');
  }
});

// Returns messages as JSON object.
app.get('/messages/update', async function(req, res) {
  try {
    let messages = await readMessageFile();
    res.type('json');
    res.send(messages);
  } catch (error) {
    res.type('text');
    res.status(SERVER).send(OOPS);
  }
});

// Returns a prompt from the prompts file at the index that is input.
app.get('/prompts/:number', async function(req, res) {
  res.type('text');
  try {
    let prompts = await getPrompts();
    res.send(prompts[req.params.number]);
  } catch (error) {
    res.status(INVALID).send('Prompt could not be found.');
  }
});

/**
 * Reads the messages file.
 * @returns {JSONObject} messages - if successfully read file.
 * @returns {Error} if file reading fails.
 */
async function readMessageFile() {
  try {
    let messages = await fs.readFile('messages.json', 'utf8');
    messages = JSON.parse(messages);
    return messages;
  } catch (error) {
    return error;
  }
}

/**
 * Reads the prompt file and puts each prompt into an array.
 * @returns {Array} promptArray - if successfully read file.
 * @returns {Error} if file reading fails.
 */
async function getPrompts() {
  try {
    let prompts = await fs.readFile('prompts.txt', 'utf8');
    let promptArray = prompts.split('\n');
    return promptArray;
  } catch (error) {
    return error;
  }
}

app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUMBER;
app.listen(PORT);