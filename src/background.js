chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
       switch(request.message){
           case "getStreamID":{
            getStreamID(sender, sendResponse);
            break;
           }
           case "blobData": {
            const ajax = new XMLHttpRequest();
            ajax.open('GET', request.objecUrl);
            ajax.responseType = "blob";
            ajax.send();
            ajax.onload= () => {
                const newURL = URL.createObjectURL(ajax.response);
                chrome.storage.local.set({video_data: newURL});
                window.URL.revokeObjectURL(request.objecUrl);
            } 
            break;
          }
       }

       return true;
    }
);

function getStreamID(sender, sendResponse){
    chrome.desktopCapture.chooseDesktopMedia(['screen','window'], sender.tab, function (streamid) {
        setTimeout(() => {
            sendResponse({type: "streamID", streamID: streamid})
        }, 1)
    });
}