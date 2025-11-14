async function sendMessage() {
  const chatId = document.getElementById('chatId').value;
  const message = document.getElementById('message').value;
  const responseDiv = document.getElementById('response');

  const res = await fetch('/api/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, message })
  });

  const data = await res.json();
  responseDiv.textContent = JSON.stringify(data);
}
