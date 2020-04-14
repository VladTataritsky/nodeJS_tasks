console.log('lll')
const out = document.getElementById('out');
let textarea = document.getElementsByClassName('data')[0];
document.addEventListener('click', (event) => {
  let method = event.target.name;
  if(method) {
    if (method === "GET") {
      console.log('get')
      fetch("http://localhost:3000/api/pulpits", {
        method: "GET",
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(res => res.json())
        .then(data =>
          out.innerHTML = JSON.stringify(data));
    }
  }
});

