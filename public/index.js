/**
 * Bella Lee
 * 2/25/2022
 * Section AH Shriya Kurpad
 *
 * Adds functionality to index.html. When the page loads, it will be populated
 * with messages from the file if there are any. When the user submits the form,
 * the API will be called and the page will update with the user-inputted message
 * added. Generates a random prompt if the user clicks the button to generate a prompt.
 */

'use strict';
(function() {
  window.addEventListener('load', init);

  const MESSAGES_URL = 'messages';
  const PROMPT_URL = 'prompts';
  const FIVE_SECONDS = 5000;
  const PROMPT_COUNT = 20;

  /**
   * Initializes page by loading posts and adds interactivity to the buttons on the page.
   */
  function init() {
    loadMessages();
    id('prompt-btn').addEventListener('click', getPrompt);
    id('input-form').addEventListener('submit', function(e) {
      e.preventDefault();
      submitMessage();
    });
  }

  /**
   * Loads messages
   */
  function loadMessages() {
    let url = MESSAGES_URL + '/update';
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.json())
      .then(updatePage)
      .catch(handleError);
  }

  /**
   * Submits user-inputted message.
   */
  function submitMessage() {
    let data = new FormData(id('input-form'));
    fetch(MESSAGES_URL, {method: 'POST', body: data})
      .then(statusCheck)
      .then(resp => resp.json())
      .then(updatePage)
      .catch(handleError);
  }

  /**
   * Updates the page.
   * @param {text} messages - response from API.
   */
  function updatePage(messages) {
    updatePrompt('');

    let titles = Object.keys(messages);
    let postContainer = id('posts');
    postContainer.innerHTML = '';

    if (titles[0] !== 'undefined') {
      for (let i = 0; i < titles.length; i++) {
        let post = gen('article');
        let title = titles[i];
        let message = messages[title]['message'];
        let name = messages[title]['name'];

        let nameContainer = gen('p');
        let titleContainer = gen('h2');
        titleContainer.textContent = title;
        post.appendChild(titleContainer);

        let messageContainer = gen('p');
        messageContainer.textContent = message;
        post.appendChild(messageContainer);

        nameContainer.textContent = '—from ';
        if (name) {
          nameContainer.textContent += name;
        } else {
          nameContainer.textContent += 'anonymous';
        }
        post.appendChild(nameContainer);

        postContainer.appendChild(post);
      }
    }
  }

  /**
   * Gets a prompt from the API.
   */
  function getPrompt() {
    let randomNumber = Math.floor(Math.random() * PROMPT_COUNT);
    let url = PROMPT_URL + '/' + randomNumber;
    fetch(url)
      .then(statusCheck)
      .then(resp => resp.text())
      .then(updatePrompt)
      .catch(handleError);
  }

  /**
   * Displays the prompt on the page.
   * @param {String} prompt - the prompt returned by the API.
   */
  function updatePrompt(prompt) {
    let promptContainer = id('prompt');
    if (prompt !== '') {
      promptContainer.classList.remove('hidden');
    } else {
      promptContainer.classList.add('hidden');
    }
    promptContainer.textContent = prompt;
  }

  /**
   * Handles errors.
   * @param {Error} error - the error that occurred.
   */
  function handleError(error) {
    let errorMessage = id('error-msg');
    errorMessage.classList.remove('hidden');
    errorMessage.textContent = error;
    setTimeout(function() {
      errorMessage.classList.add('hidden');
      errorMessage.textContent = '';
    }, FIVE_SECONDS);
  }

  /**
   * Checks if the response is valid.
   * @param {JSONObject} res - response to fetch call.
   * @returns {JSONObject} res - the same response that was passed in.
   * @throws - will throw an error if the response is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns an empty DOM node with the specified type.
   * @param {string} tagName - HTML tag.
   * @returns {object} - empty DOM object of specified type.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }
})();
