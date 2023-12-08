const videoElement = document.getElementById('videoElement');
const snapButton = document.getElementById('snapButton');
const uploadInput = document.getElementById('uploadInput');
const photoContainer = document.getElementById('photoContainer');
const photoElement = document.getElementById('photoElement');
const retakeButton = document.getElementById('retakeButton');
const errorContainer = document.getElementById('errorContainer');
const cameraImageContainer = document.getElementById('cameraImageContainer');
const formContainer = document.getElementById('formContainer');
const recordButton = document.getElementById('recordButton');
const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');
const resetButton = document.getElementById('resetButton');
const saveButton = document.getElementById('saveButton');
const messageText = document.getElementById('messageText');

const imageInput = document.getElementById('image');
const audioInput = document.getElementById('voiceMessage');

let mediaRecorder;
let recordedChunks = [];

navigator.mediaDevices.getUserMedia({
    video: true
})
    .then(function (stream) {
        videoElement.srcObject = stream;
        videoElement.play();
    })
    .catch(function (error) {
        console.log('Error accessing camera:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Vaš preglednik ne podržava kameru.';
        errorMessage.style.color = 'red';
        cameraContainer.appendChild(errorMessage);
    });

snapButton.addEventListener('click', function () {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg');
    //console.log('Captured photo:', photoDataUrl);
    showPhoto(photoDataUrl);
});

uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const photoDataUrl = e.target.result;
            showPhoto(photoDataUrl);
        };
        reader.readAsDataURL(file);
        errorContainer.textContent = '';
    } else {
        uploadInput.value = '';
        errorContainer.textContent = 'Nevaljani format slike. Molimo učitajte datoteku u formatu slike.';
    }
});

function showPhoto(photoDataUrl) {
    cameraImageContainer.style.display = 'none';
    photoElement.src = photoDataUrl;
    photoContainer.style.display = 'block';
    retakeButton.style.display = 'inline-block';
    formContainer.style.display = 'block';
    snapButtonContainer.style.display = 'none';

    imageInput.value = photoDataUrl;
}

retakeButton.addEventListener('click', function () {
    window.location.href = "post.html";
});

recordButton.addEventListener('click', function () {
    event.preventDefault();
    navigator.mediaDevices.getUserMedia({
        audio: true
    })
        .then(function (stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();
            recordButton.disabled = true;
            playButton.disabled = true;
            stopButton.disabled = false;
            saveButton.disabled = true;
            recordedChunks = [];
            mediaRecorder.addEventListener('dataavailable', function (e) {
                recordedChunks.push(e.data);
            });
        })
        .catch(function (error) {
            console.log('Error accessing microphone:', error);
            messageText.textContent = 'Vaš preglednik ne podržava mikrofon ili niste dodijelili dozvolu za njega.';                
        });
});

stopButton.addEventListener('click', function () {
    event.preventDefault();
    mediaRecorder.stop();
    recordButton.disabled = false;
    playButton.disabled = false;
    stopButton.disabled = true;
    saveButton.disabled = false;
});

playButton.addEventListener('click', function () {
    event.preventDefault();
    const blob = new Blob(recordedChunks, {
        type: 'audio/webm'
    });
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    audio.play();
});

saveButton.addEventListener('click', function () {
    saveButton.disabled = true;
    const blob = new Blob(recordedChunks, {
        type: 'audio/webm'
    });
    //console.log(blob);
    //console.log(JSON.stringify(blob));
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        const base64data = reader.result;
        //console.log(base64data);
        audioInput.value = base64data;
        //const newA = new Audio(base64data);
        //console.log(audioInput.value);
        //newA.play();
    };
    if (saveButton.disabled && !playButton.disabled) {
        messageText.textContent = 'Spremljena poruka';
    } else {
        messageText.textContent = 'Nema spremljene poruke';
    }
});

resetButton.addEventListener('click', function () {
    event.preventDefault();
    recordButton.disabled = false;
    playButton.disabled = true;
    stopButton.disabled = true;
    document.getElementById('anglerForm').reset();
    audioInput.value = '';
    messageText.textContent = 'Nema spremljene poruke';
});
