// Display a question/answer bubble with the input text
function showBubble(isQuestion, text) {
  // Establish classes for new elements
  var columnClass, borderClass, borderTipClass, borderTextClass;
  if (isQuestion) {
    columnClass = "col-lg-offset-7 col-md-offset-6 col-sm-offset-5 col-xs-offset-4 col-lg-5 col-md-6 col-sm-7 col-xs-8";
    borderClass = "question-border";
    borderTipClass = "question-border-tip";
    borderTextClass = "question-text";
  }
  else {
    columnClass = "col-lg-5 col-md-6 col-sm-7 col-xs-8";
    borderClass = "answer-border";
    borderTipClass = "answer-border-tip";
    borderTextClass = "answer-text";
  }

  // Create HTML element for displaying question/answer
  var row = document.createElement('div');
  row.setAttribute('class', "row");
  document.getElementById('conversation').appendChild(row);
  var column = document.createElement('div');
  column.setAttribute('class', columnClass);
  row.appendChild(column);
  var bubble = document.createElement('div');
  bubble.setAttribute('class', borderClass);
  column.appendChild(bubble);
  var bubbleTip = document.createElement('div');
  bubbleTip.setAttribute('class', borderTipClass);
  bubble.appendChild(bubbleTip);
  var outputText = document.createElement('p');
  outputText.setAttribute('class', borderTextClass);
  outputText.innerHTML = text;
  bubbleTip.appendChild(outputText);

  // If the first posted question, move the chat bubble tips into place
  if (!questionExists)
  {
    alignBubbleTipElements(true, 90, -8.8, -53);
    alignBubbleTipElements(false, 10, -1.9, 19);
  }
}

function alignBubbleTipElements(isQuestion, tipPercentOffset, dotOffset, barOffset)
{
  var className = (isQuestion) ? "question" : "answer";
  // Get the left position of the bubble tip
  var bubbleFields = document.getElementsByClassName(className + "-border");
  if (bubbleFields.length > 0)
  {
    var bubbleWidth = bubbleFields[0].offsetWidth;

    var styleRules = document.styleSheets[1].cssRules;
    var foundElements = 0;
    var borderTipBeforeIndex, borderTipAfterIndex;
    for (var i=0; i < styleRules.length; i++)
    {
      // Get the left percentage value of the border tip's large curve
      if (styleRules[i].selectorText === ("." + className + "-border::before"))
      {
        if (isQuestion)
          styleRules[i].style.left = ((bubbleWidth * (tipPercentOffset/100)) - 57).toString() + "px";
        else
          styleRules[i].style.left = tipPercentOffset.toString() + "%";
        if (foundElements === 3) break;
        foundElements++;
      }

      // Get the left percentage value of the border tip's small curve
      else if (styleRules[i].selectorText === ("." + className + "-border::after"))
      {
        if (isQuestion)
          styleRules[i].style.left = ((bubbleWidth * (tipPercentOffset/100)) - 27).toString() + "px";
        else
          styleRules[i].style.left = tipPercentOffset.toString() + "%";
        if (foundElements === 3) break;
        foundElements++;
      }

      // Get the index of the border tip dot element
      else if (styleRules[i].selectorText === ("." + className + "-border-tip::before"))
      {
        borderTipBeforeIndex = i;
        if (foundElements === 3) break;
        foundElements++;
      }

      // Get the index of the border tip bar element
      else if (styleRules[i].selectorText === ("." + className + "-border-tip::after"))
      {
        borderTipAfterIndex = i;
        if (foundElements === 3) break;
        foundElements++;
      }
    }

    // Set border tip element positions
    styleRules[borderTipBeforeIndex].style.left = ((bubbleWidth * (tipPercentOffset/100)) + dotOffset).toString() + "px";
    styleRules[borderTipAfterIndex].style.left = ((bubbleWidth * (tipPercentOffset/100)) + barOffset).toString() + "px";
  }
}

// Run the following code every time the window resizes
// This should also adjust for pinch-to-zoom on mobile devices
$(window).resize(function() {

  alignBubbleTipElements(true, 90, -8.8, -53);
  alignBubbleTipElements(false, 10, -1.9, 19);
});

/**
 *  @author Jake Peyser <jepeyser@us.ibm.com>
 *
 * @param {String} _options._id  Unique ID
 * @param {String} _options._rev  Revision Number
 * @param {String} _options.chatStatus  Helped Status
 * @param {String} _options.startTime  Start Time
 * @param {String} _options.rep  Representative Name
 * @param {String} _options.bttnId  bttn ID
 *
 */
function Chat(_options) {
  var options = _options || {};

  this._id = options._id || '';
  this._rev = options._rev || '';
  this.chatStatus = options.chatStatus || '';
  this.startTime = options.startTime || '';
  this.rep = options.rep || '';
  this.bttnId = options.bttnId || '';

  // Build HTTP GET URL
  var url = "/db/save_chat?";
  if (this.chatStatus) url += ("&chatStatus=" + this.chatStatus);
  if (this.startTime) url += ("&startTime=" + this.startTime);
  if (this.bttnId) url += ("&bttnId=" + this.bttnId);

  // Create chat record in DB
  $.ajax( {
    url: url,
    cache : false
  }).done(function(data) {
    if (data.ok === true) {
      console.log("Created chat record successfully");
      data.id = this._id;
      data.rev = this._rev;
    }
    else {
      console.error("Error saving the chat to the DB");
      console.error(data);
    }
  });
}

// Functions used for chat events
//ConstantSocket.prototype.onQuestion = function() {};
