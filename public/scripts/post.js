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
        console.error('Error accessing camera:', error);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Failed to access the camera. Please check your camera settings.';
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
    console.log('Captured photo:', photoDataUrl);
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
        errorContainer.textContent = 'Invalid file format. Please upload an image file.';
    }
});

function showPhoto(photoDataUrl) {
    cameraImageContainer.style.display = 'none';
    photoElement.src = photoDataUrl;
    photoContainer.style.display = 'block';
    retakeButton.style.display = 'inline-block';
    formContainer.style.display = 'block';
    snapButtonContainer.style.display = 'none';
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
            recordedChunks = [];
            mediaRecorder.addEventListener('dataavailable', function (e) {
                recordedChunks.push(e.data);
            });
        })
        .catch(function (error) {
            console.error('Error accessing microphone:', error);
            const errorMessage = document.createElement('p');
            errorMessage.textContent =
                'Failed to access the microphone. Please check your microphone settings.';
            errorMessage.style.color = 'red';
            formContainer.appendChild(errorMessage);
        });
});

stopButton.addEventListener('click', function () {
    event.preventDefault();
    mediaRecorder.stop();
    recordButton.disabled = false;
    playButton.disabled = false;
    stopButton.disabled = true;
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

resetButton.addEventListener('click', function () {
    event.preventDefault();
    recordButton.disabled = false;
    playButton.disabled = true;
    stopButton.disabled = true;
    document.getElementById('anglerForm').reset();
});