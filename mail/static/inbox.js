document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //track if there is a submission of the compose form.
  document.querySelector('#compose-form').addEventListener('submit', create_sent);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch('/emails/' + mailbox)
  .then(response => response.json())
  .then(emails => {
    
    emails.forEach(email => {
      var div = document.createElement('div');
      if(email['read']) {
        div.className = "read_email"
      } else {
        div.className = "unread_email"
      }
      div.innerHTML = `
        <ul class = "list-group">
          <li class="list-group-item"><span class="sender"> <b>${email['sender']}</b> </span>
          <span class="subject"> ${email['subject']} </span>
          <span class="timestamp"> ${email['timestamp']} </span> </li>
        </ul>  
        `;
      div.addEventListener('click', () => get_email(email['id']))
      document.querySelector('#emails-view').append(div);
    })

    if (!email['read']) {
      fetch('/emails/' + id, {
        method: 'PUT',
        body: JSON.stringify({read:true})
      })
      .then(alert('works'))
    }
  })
}

function create_sent(event) {
  event.preventDefault()

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value
    })
  })
  .then(result => load_mailbox('sent'));
}

function get_email(id) {
 fetch('/emails/' + id)
 .then(response => response.json())
 .then(email => {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email').style.display = 'block';
  const email_view = document.querySelector('#email');
  email_view.innerHTML = `
    <ul class="list-group">
      <li class="list-group-item"> <b>From:</b> <span>${email['sender']}</span></li>
      <li class="list-group-item"> <b>To: </b><span>${email['recipients']}</span></li>
      <li class="list-group-item"> <b>Subject:</b> <span>${email['subject']}</span</li>
      <li class="list-group-item"> <b>Time:</b> <span>${email['timestamp']}</span></li>
    </ul>
    <p class="m-2">${email['body']}</p>
        `;
 })
 fetch('/emails/' + email['id'], {
  method : 'PUT',
  body: JSON.stringify({ archived : !email['archived'] })
 })
 .then(response => load_mailbox('inbox'))
} 
