const out = document.getElementById('out');
let textarea = document.getElementsByClassName('data')[0];

document.addEventListener('click', (event) => {
  let method = event.target.name
  if (method === 'GET') {
    fetch("http://localhost:3000/api/pulpits", {
      method: "GET",
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(response => {
        out.innerHTML = JSON.stringify(response)
      })
  }
  else if (method === "POST" || method === "PUT") {
    const body = JSON.parse(textarea.value.trim());

    fetch("http://localhost:3000/api/pulpits", {
      method: method,
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(response => response.text())
      .then(text => out.innerHTML = text)
  }

  else if (method === "DELETE") {
    const key = textarea.value.trim();

    fetch(`http://localhost:3000/api/pulpits/${key}`, {
      method: method,
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.text())
      .then(text => out.innerHTML = text)
  }
})



