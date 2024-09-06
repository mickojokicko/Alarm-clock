const btnSet = document.querySelector('.btnSet');
const btnQuit = document.querySelector('.btnQuit');

const parentElement = document.querySelector('.alarmList');
const allData = JSON.parse(localStorage.getItem('allDataList') || '[]');
const currentDayUi = document.getElementById('currentDay');
const alarmTime = document.getElementById('alarmTime');
const alarmTimeSet = document.getElementById('alarmTimeSet');
// audio
const selectedAudioElement = document.getElementById('alarmSong');
// checkbox days
const selectDays = document.getElementById('alarmInputs');

const daysArr = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function currDay() {
  let currentDayIndex = new Date().getDay();
  let currentDay = daysArr[currentDayIndex];
  return currentDay;
}
currDay();

// ___________________________________________________

function displayAlarmTime() {
  const date = new Date();
  const minutes = correctTwoSymbols(date.getMinutes());
  const hours = correctTwoSymbols(date.getHours());

  const markup = `
  <h1>${hours} : ${minutes} <br/> <span id="currentDay">${currDay()}</span></h1>
  `;
  alarmTime.innerHTML = '';
  alarmTime.insertAdjacentHTML('afterbegin', markup);
  return `${hours}:${minutes}`;
}

function correctTwoSymbols(unit) {
  return ('0' + unit).length > 2 ? unit : '0' + unit;
}

// ------------------------------------------------------------
function alarmDataLength(data) {
  if (data.length > 4) data.shift();
}
// 1)
const takeData = function () {
  const selectedDays = daysFromCheckbox();
  const data = {
    currentDay: selectedDays,
    time: alarmTimeSet.value,
    song: selectedAudioElement.value,
  };

  if (data.time && data.currentDay.length > 0) {
    alarmDataLength(allData);
    allData.push(data);
    localStorage.setItem('allDataList', JSON.stringify(allData));
  } else {
    alert('Please Insert your Date  & Time');
  }
};
// 2)
const updateAlarmListUi = function () {
  parentElement.innerHTML = '';
  allData.map(item => {
    let html = '';
    html += displayData(item);
  });
};
updateAlarmListUi();

// 3)
function displayData(alarmData) {
  const markup = `
  <li id="alarmClockData">
  <span id="data"><span id="data"> <span id="dataTata"> Alarm Time:</span>  ${alarmData.time}</span> <br /><span id="data"> <span id="dataTata"> Days:</span>  ${alarmData.currentDay}</span><br />
  <span id="data"><span id="data"><span id="dataTata"> Alarm melody:</span>  ${alarmData.song}</span>
  </li>
  `;
  parentElement.insertAdjacentHTML('beforeend', markup);
}

setInterval(displayAlarmTime, 1000);

function daysFromCheckbox() {
  let checkboxes = document.querySelectorAll('input[name="days"]:checked');
  let values = [];
  checkboxes.forEach(checkbox => {
    values.push(checkbox.value);
  });
  return values;
}

// _____currentDAy__________

function getDayForExecution(data) {
  const currentDay = currDay();
  const currentTime = displayAlarmTime();

  data.forEach(mov => {
    if (mov.currentDay.includes(currentDay)) {
      if (mov.time === currentTime) {
        const modal = document.querySelector('.wakeUp');
        modal.style.display = 'flex';
        setTimeout(() => {
          modal.style.display = 'none';
        }, 5000);
      }
    }
  });
}

setInterval(() => {
  getDayForExecution(allData);
}, 10000);

function alarmSongPlay() {
  const selectedValue = selectedAudioElement.value;

  document.querySelectorAll('audio').forEach(audio => audio.pause());

  const selectedAudio = document.getElementById(selectedValue);

  if (selectedAudio) {
    selectedAudio.play();
  }
}
function clearFields() {
  alarmTimeSet.value = '';

  const checkboxes = document.querySelectorAll('input[name="days"]');

  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
}

// _________________________________________________//

btnSet.addEventListener('click', function () {
  takeData();
  updateAlarmListUi();
  clearFields();
});
btnQuit.addEventListener('click', alarmSongPlay);
