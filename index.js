const watermarkTextInput = document.getElementById("watermark-text");
if (watermarkTextInput.value == "") {
  watermarkTextInput.value = localStorage.getItem("watermarkText");
}

watermarkTextInput.addEventListener("blur", function (e) {
  localStorage.setItem("watermarkText", e.target.value);
});

let maxFontSize = (imgWidth, imgHeight, ctx) => {
  shortSide = Math.min(imgWidth, imgHeight);
  let initialSize = 1;
  ctx.font = `${initialSize}px Helvetica`;

  while (ctx.measureText(watermarkTextInput.value).width < shortSide) {
    initialSize++;
    ctx.font = `${initialSize}px Helvetica`;
  }

  return `${initialSize}px Helvetica`;
};

let saveImg = (canvas, filename) => {
  let dlButton = document.createElement("a");
  let dlDiv = document.getElementById("imgs-download");  
  dlButton.download = filename;
  dlButton.text = "Pobierz";
  dlButton.href = URL.createObjectURL(
    dataURItoBlob(canvas.toDataURL(`image/${filename.split(".")[-1]}`, 85))
  );
  dlDiv.appendChild(dlButton);
  dlButton.click();
};

function dataURItoBlob(dataurl) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }  
  return new Blob([u8arr], { type: mime });
}

function addWatermark(droppedImg, filename) {  
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
    ctx.fillText(watermarkTextInput.value, 0, 0);
    ctx.strokeText(watermarkTextInput.value, 0, 0);
    ctx.restore();
    saveImg(canvas, filename);
  };
  img.src = droppedImg;
}

var dropZone = document.getElementById("dropZone");

function handleDrop(e) {
  e.preventDefault();
  dropZone.style.visibility = "hidden";

  let files = e.dataTransfer.files;
  for (let img of files) {
    const reader = new FileReader();
    reader.onload = e => {
      console.log(img);
      addWatermark(e.target.result, img.name);
    };
    reader.readAsDataURL(img);
  }
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
