preload_video = function(path) {
	var req = new XMLHttpRequest();
	req.open('GET', path, true);
	req.responseType = 'blob';

	req.onload = function() {
	   // Onload is triggered even on 404
	   // so we need to check the status code
	   if (this.status === 200) {
	      var videoBlob = this.response;
	      var vid = URL.createObjectURL(videoBlob); // IE10+
	      // Video is now downloaded
	      // and we can set it as source on the video element
	      console.log("video "+path+" loaded at URL "+vid);
	   }
	};
	req.onerror = function() {
	   console.error(req.statusText);
	};
	req.send();
};

var filenames = [
	"{{ gamestatic('vid/C_1_lag2.mp4') }}", "{{ gamestatic('vid/C_1_lag1.mp4') }}", "{{ gamestatic('vid/C_1_same.mp4') }}", "{{ gamestatic('vid/C_1_lead1.mp4') }}", "{{ gamestatic('vid/C_1_lead2.mp4') }}",
	"{{ gamestatic('vid/C_2_lag2.mp4') }}", "{{ gamestatic('vid/C_2_lag1.mp4') }}", "{{ gamestatic('vid/C_2_same.mp4') }}", "{{ gamestatic('vid/C_2_lead1.mp4') }}", "{{ gamestatic('vid/C_2_lead2.mp4') }}",
	"{{ gamestatic('vid/C_3_lag2.mp4') }}", "{{ gamestatic('vid/C_3_lag1.mp4') }}", "{{ gamestatic('vid/C_3_same.mp4') }}", "{{ gamestatic('vid/C_3_lead1.mp4') }}", "{{ gamestatic('vid/C_3_lead2.mp4') }}",
	"{{ gamestatic('vid/C_4_lag2.mp4') }}", "{{ gamestatic('vid/C_4_lag1.mp4') }}", "{{ gamestatic('vid/C_4_same.mp4') }}", "{{ gamestatic('vid/C_4_lead1.mp4') }}", "{{ gamestatic('vid/C_4_lead2.mp4') }}",
	"{{ gamestatic('vid/C_5_lag2.mp4') }}", "{{ gamestatic('vid/C_5_lag1.mp4') }}", "{{ gamestatic('vid/C_5_same.mp4') }}", "{{ gamestatic('vid/C_5_lead1.mp4') }}", "{{ gamestatic('vid/C_5_lead2.mp4') }}",
	"{{ gamestatic('vid/F_1_lag2.mp4') }}", "{{ gamestatic('vid/F_1_lag1.mp4') }}", "{{ gamestatic('vid/F_1_same.mp4') }}", "{{ gamestatic('vid/F_1_lead1.mp4') }}", "{{ gamestatic('vid/F_1_lead2.mp4') }}",
	"{{ gamestatic('vid/F_2_lag2.mp4') }}", "{{ gamestatic('vid/F_2_lag1.mp4') }}", "{{ gamestatic('vid/F_2_same.mp4') }}", "{{ gamestatic('vid/F_2_lead1.mp4') }}", "{{ gamestatic('vid/F_2_lead2.mp4') }}",
	"{{ gamestatic('vid/F_3_lag2.mp4') }}", "{{ gamestatic('vid/F_3_lag1.mp4') }}", "{{ gamestatic('vid/F_3_same.mp4') }}", "{{ gamestatic('vid/F_3_lead1.mp4') }}", "{{ gamestatic('vid/F_3_lead2.mp4') }}",
	"{{ gamestatic('vid/F_4_lag2.mp4') }}", "{{ gamestatic('vid/F_4_lag1.mp4') }}", "{{ gamestatic('vid/F_4_same.mp4') }}", "{{ gamestatic('vid/F_4_lead1.mp4') }}", "{{ gamestatic('vid/F_4_lead2.mp4') }}",
	"{{ gamestatic('vid/F_5_lag2.mp4') }}", "{{ gamestatic('vid/F_5_lag1.mp4') }}", "{{ gamestatic('vid/F_5_same.mp4') }}", "{{ gamestatic('vid/F_5_lead1.mp4') }}", "{{ gamestatic('vid/F_5_lead2.mp4') }}"
];

for(i = 0; i < filenames.length; i += 1){
	preload_video(filenames[i]);
};