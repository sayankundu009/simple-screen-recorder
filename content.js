chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       console.log(sender)
       console.log(request.message);
       switch(request.message){
           case "start":{
            startRecording();
            break;
           }
           case "stop":{
            stopRecording();
            break;
           }
       }
    }
);

let recorder, stream;

async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: "screen" }
    });
    recorder = new MediaRecorder(stream);

    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = e => {
        const completeBlob = new Blob(chunks, { type: chunks[0].type });
        const result = URL.createObjectURL(completeBlob);

        chrome.storage.local.set({video_data: result});
    };
    chrome.storage.local.set({isRecording: true});
    recorder.start();
  } catch (error) {
      
  }
}

function stopRecording(){
  chrome.storage.local.set({isRecording: false});
  recorder.stop();
  stream.getVideoTracks()[0].stop();
}

chrome.storage.local.set({video_data: null});
chrome.storage.local.set({isRecording: false});