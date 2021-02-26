const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
const remove = document.getElementById("remove");
const download = document.getElementById("download");
const editing = document.getElementById("editing");
const recording = document.getElementById("recording");


start.addEventListener("click", () => {
  start.setAttribute("disabled", true);
  stop.removeAttribute("disabled");

  chrome.tabs.query({currentWindow: true, active: true}, function ([activeTab]){
    chrome.tabs.sendMessage(activeTab.id, {"message": "start"});
  });
});

stop.addEventListener("click", () => {
  stop.setAttribute("disabled", true);
  start.removeAttribute("disabled");

  chrome.tabs.query({currentWindow: true, active: true}, function ([activeTab]){
    chrome.tabs.sendMessage(activeTab.id, {"message": "stop"});
  });
});

remove.addEventListener("click", () => {
  const data = video.src;
  window.URL.revokeObjectURL(data);
  chrome.storage.local.set({video_data: null, isRecording: false});
});

download.addEventListener("click", () => {
    const data = video.src;

    const link = document.createElement('a');
    link.href = data;
    link.download = "video.mp4"

    link.click();

    setTimeout(() => {
      link.remove();
    }, 100);
});

// Get Video
chrome.storage.local.get("video_data", function(items) {
  const { video_data } = items
  handelVideo(video_data);
});

// Get isRecording
chrome.storage.local.get("isRecording", function(items) {
  const { isRecording } = items
  handelRecording(isRecording);
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
    const { video_data , isRecording} = changes

    isRecording !== undefined && handelRecording(isRecording.newValue);
    video_data !== undefined && handelVideo(video_data.newValue);
});

function showRecording(){
  editing.style.display = "none"
  recording.style.display = "block"
}

function showEditing(){
  editing.style.display = "block"
  recording.style.display = "none"
}

function handelVideo(video_data){
  if(video_data != null){
    video.src = video_data;
    showEditing()
  }else{
    showRecording();
    video.src = ""
  }
}

function handelRecording(isRecording){
  if(isRecording){
    start.setAttribute("disabled", true);
    stop.removeAttribute("disabled");
  }else{
    stop.setAttribute("disabled", true);
    start.removeAttribute("disabled");
  }
}