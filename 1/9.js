let x = document.getElementsByTagName('input')[0];
let y = document.getElementsByTagName('input')[1];
let result = document.getElementById('result');
document.addEventListener('click', () => {
  if (event.target.value === 'SUM') {
    result.innerHTML = Number(x.value) + Number(y.value);
  }
  if (event.target.value === 'SUB') {
    result.innerHTML = Number(x.value) - Number(y.value);
  }
  if (event.target.value === 'CONC') {
    result.innerHTML = x.value + y.value;
  }
});
