let maxFontSize = (imgWidth, imgHeight, ctx) => {
  shortSide = Math.min(imgWidth, imgHeight);
  let initialSize = 1;
  ctx.font = `${initialSize}px Helvetica`;

  while (ctx.measureText("znak_wodny").width < shortSide) {
    initialSize++;
    ctx.font = `${initialSize}px Helvetica`;
  }

  return `${initialSize}px Helvetica`;
};

let saveImg = canvas => {
  downloadLink = document.getElementById("download-img");
  downloadLink.href = URL.createObjectURL(dataURItoBlob(canvas.toDataURL("image/jpeg, 85")));
  downloadLink.click();
};

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  var byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI
    .split(",")[0]
    .split(":")[1]
    .split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  var arrayBuffer = new ArrayBuffer(byteString.length);
  var _ia = new Uint8Array(arrayBuffer);
  for (var i = 0; i < byteString.length; i++) {
    _ia[i] = byteString.charCodeAt(i);
  }

  var dataView = new DataView(arrayBuffer);
  var blob = new Blob([dataView], { type: mimeString });
  return blob;
}

function addWatermark(droppedImg) {
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.width = 480;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.onload = function() {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    ctx.font = maxFontSize(canvas.width, canvas.height, ctx);
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(Math.PI / 4);
    ctx.textAlign = "center";
    ctx.fillText("znak_wodny", 0, 0);
    ctx.strokeText("znak_wodny", 0, 0);
    ctx.restore();
    saveImg(canvas);
  };
  img.src = droppedImg;
}

var dropZone = document.getElementById("dropZone");

function handleDrop(e) {
  e.preventDefault();
  dropZone.style.visibility = "hidden";

  let file = e.dataTransfer.files[0];

  let reader = new FileReader();

  reader.onload = e => {
    addWatermark(e.target.result);
  };

  reader.readAsDataURL(file);
}

function allowDrag(e) {
  if (true) {
    // Test that the item being dragged is a valid one
    e.dataTransfer.dropEffect = "copy";
    e.preventDefault();
  }
}

window.addEventListener("dragenter", function(e) {
  dropZone.style.visibility = "visible";
});

dropZone.addEventListener("dragenter", allowDrag);
dropZone.addEventListener("dragover", allowDrag);

dropZone.addEventListener("dragleave", function(e) {
  dropZone.style.visibility = "hidden";
});

dropZone.addEventListener("drop", handleDrop);
