# Bulletin Board API Documentation
The Bulletin Board API allows users to write and read messages, as well as get prompts from a provided list.

## Write a message
**Request Format:** /messages

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Adds entered parameters to the messages.json file only if the password inputted is correct. For this assignment, the password is set to cse154. Returns the whole message file, including previous messages.


**Example Request:** /messages with POST parameters of `title=hello`, `message=This is a test message`, `name=bella`, and `pwd=cse154`

**Example Response:**
``` json
{
  "hello": {
    "message": "This is a test message",
    "name": "Bella"
  }
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If a repeated title is inputted (e.g. one that already exists in the messages file), returns an error with the message: `Title already exists. Pick a different title.`
  - If the password is incorrect, returns an error with the message: `Incorrect password.`
- Possible 500 (server) errors (all plain text):
  - If an error occurs on the server, returns an error with the message: `Oops! Something went wrong on the server.`

## Get all messages
**Request Format:** /messages/update

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Returns the message file with all previously entered bulletin board messages.

**Example Request:** /messages/update

**Example Response:**
```json
{
  "hello": {
    "message": "This is a test message",
    "name": "Bella"
  },
  "test": {
    "message": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id.",
    "name": 
  }
}
```

**Error Handling:**
- Possible 500 (server) errors (all plain text):
  - If an error occurs on the server, returns an error with the message: `Oops! Something went wrong on the server.`

## Generate prompt
**Request Format:** /prompts/:number

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Returns a prompt from a list of journaling prompts. There are a total of 20, one on each line.

**Example Request:** /prompts/2

**Example Response:**
```
What's your favorite color, place, food, book, song, or movie, and why?
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If the number sent is incorrect or something goes wrong with the URL, returns an error with the message: `Prompt could not be found.`