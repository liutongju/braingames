'use strict';

var video_options = [{version: 1, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_1.mp4"},
                     {version: 2, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_2.mp4"},
                     {version: 3, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_3.mp4"},
                     {version: 4, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_4.mp4"},]

var index = Math.floor(Math.random() * video_options.length);
var index2 = Math.floor(Math.random() * video_options.length);

// not optimal, but to ensure we have two different test varients
while (index2 == index) {
  index2 = Math.floor(Math.random() * video_options.length);
}

// question asked at the end of both trials comparing the two
var likable_question = {
  type: 'survey-multi-choice',
  questions: ['which animation did you prefer? - or other comparison question'],
  options: [['the first', 'the second']],
  required: [true],
  horizontal: true
};

var speed_question = {
  type: 'survey-multi-choice',
  questions: ['The wait for the tab to load was: '],
  options: [['1- Extremely slow', '2 - Slow', '3 - Somewhat slow', '4 - Neither slow nor fast', '5 - Somewhat fast', '6 - Fast', '7 - Extremely fast']],
  required: [true],
  horizontal: true
};

var username = {
  type: 'survey-text',
  questions: [`<p>Please enter your usertesting.com username.</p><p> We are only collecting this information to know that you have completed the study here.</p>`],
};

var video_options = [
  // one control version
  {data: {version: 5, video_url: "https://mozilla.github.io/braingames/videos/tab-load/loading_5_current.mp4"}, timeline: [{}, speed_question] },
  // two of the test versions
  {data: video_options[index], timeline: [{}, speed_question] },
  {data: video_options[index2], timeline: [{}, speed_question] },
];

var test_block = {
  timeline: video_options,
  type: 'html',
  url: "{{ gamestatic('html/startup.html') }}",
  cont_btn: 'end-trial',
  randomize_order: true,
};

var timeline = [];
timeline.push(test_block);
timeline.push(likable_question);
timeline.push(username);

var csrf = "{% csrf_token %}";
var end_message = `<div id="thank-you">Thanks for completing the survey! <br> Please advance to the next task on the usertesting.com interface.<div>`;

/* start the experiment */
jsPsych.init({
  timeline: timeline,
  on_finish: function() {
    jsPsych.endExperiment(end_message);
    $.ajax({
      type: 'post',
      cache: false,
      url: 'datacollector/',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
          'X-CSRFToken': '{{ csrf }}'
      },
      data: jsPsych.data.dataAsJSON(),
      success: function(output) { console.log(output); }
    });
  }
});