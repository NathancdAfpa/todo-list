document.addEventListener('DOMContentLoaded', function () {
  const tfield = document.querySelector('.tfield');
  tfield.value = "Nom de l'élément";
  tfield.classList.add("gray-text");
  tfield.addEventListener('focus', handleFocus);
});

function handleFocus(event) {
  const tfield = event.target;
  if (tfield.value === "Nom de l'élément") {
    tfield.value = "";
    tfield.classList.remove("gray-text");
  }
}

function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
  console.log(event.target.id);
}

function handleDragEnter(event) {
  event.preventDefault();
  event.currentTarget.classList.add('highlight');
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
}

function handleDragLeave(event) {
  event.currentTarget.classList.remove('highlight');
}

function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData('text/plain');
  const draggedElement = document.getElementById(data);
  const currentColumn = event.currentTarget;

  // Move the dragged element to the drop target
  currentColumn.appendChild(draggedElement);
  currentColumn.classList.remove('highlight');

  // Update the position and store the note
  const noteId = draggedElement.id;
  const newPosition = currentColumn.parentNode.classList[0];
  updateNotePosition(noteId, newPosition);
}

function updateNotePosition(noteId, newPosition) {
  let storedNotes = localStorage.getItem('notes');
  let notes = storedNotes ? JSON.parse(storedNotes) : [];

  // Find the note with the matching id
  const note = notes.find(note => note.id === parseInt(noteId));
  if (note) {
    note.position = newPosition;
    localStorage.setItem('notes', JSON.stringify(notes));
  }
}


function initializeDragAndDrop(dragSource, dropTarget) {
  dragSource.addEventListener('dragstart', handleDragStart);
  dropTarget.addEventListener('dragenter', handleDragEnter);
  dropTarget.addEventListener('dragover', handleDragOver);
  dropTarget.addEventListener('dragleave', handleDragLeave);
  dropTarget.addEventListener('drop', handleDrop);
}

function dragstart_handler(event) {
  event.dataTransfer.setData("text/plain", event.target.id);
  event.dataTransfer.dropEffect = "copy";
}

function dragover_handler(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function drop_handler(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  event.target.appendChild(document.getElementById(data));
}

let i = 1;
let j = 1;


document.addEventListener('DOMContentLoaded', function () {
  const tfield = document.querySelector('.tfield');
  const textarea = document.querySelector('.area');
  const crayonButton = document.querySelector('.crayon-button');
  const attenteContainer = document.querySelector('.attente-container ul');
  const enCoursContainer = document.querySelector('.en-cours-container ul');
  const termineContainer = document.querySelector('.termine-container ul');
  const crossButton = document.querySelector('.cross-button');

  crayonButton.addEventListener('click', function () {
    const title = tfield.value.trim();
    const content = textarea.value;

    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
      existingErrorMessage.remove();
    }

    tfield.classList.remove('error-field');
    textarea.classList.remove('error-field');

    if (title === '') {
      const errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = 'Please fill in the title field.';
      tfield.classList.add('error-field');
      tfield.parentNode.insertBefore(errorMessage, tfield.nextSibling);
      return;
    }

    if (content === '') {
      const errorMessage = document.createElement('p');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = 'Please fill in the content field.';
      textarea.classList.add('error-field');
      textarea.parentNode.insertBefore(errorMessage, textarea.nextSibling);
      return;
    }

    let storedNotes = localStorage.getItem('notes');
    let notes = storedNotes ? JSON.parse(storedNotes) : [];

    


    const newNote = {
      id: Date.now(),
      titre: title,
      contenu: content,
      position: 'attente-container'
    };

    const li = createNoteElement(newNote);
attenteContainer.appendChild(li);

console.log(newNote);

notes.push(newNote);
localStorage.setItem('notes', JSON.stringify(notes));

tfield.value = '';
textarea.value = '';
});

function createNoteElement(note) {
  const li = document.createElement('li');
  li.setAttribute('id', note.id);
  li.draggable = true;
  li.addEventListener('dragstart', handleDragStart);
  const h2 = document.createElement('h2');
  h2.innerText = note.titre;
  h2.contentEditable = true;

  const p = document.createElement('p');
  p.innerText = note.contenu;
  p.contentEditable = true;

  const img = document.createElement('img');
  img.src = 'Ressources/remove.png';
  img.setAttribute('alt', 'nature');
  img.setAttribute('height', 25);
  img.setAttribute('width', 25);
  img.setAttribute('align', 'right');

  img.addEventListener('click', function () {
    const li = this.parentNode;
    const noteId = li.id;

    li.remove();
    removeNoteFromStorage(noteId);
  });

  h2.addEventListener('input', function () {
    note.titre = h2.innerText;
    updateNoteInStorage(note);
  });

  p.addEventListener('input', function () {
    note.contenu = p.innerText;
    updateNoteInStorage(note);
  });

  li.appendChild(h2);
  li.appendChild(p);
  li.appendChild(img);

  return li;
}

function updateNoteInStorage(note) {
  let storedNotes = localStorage.getItem('notes');
  let notes = storedNotes ? JSON.parse(storedNotes) : [];

  // Find the note with the matching id
  const index = notes.findIndex(n => n.id === note.id);
  if (index !== -1) {
    notes[index] = note;
    localStorage.setItem('notes', JSON.stringify(notes));
  }


    function removeNoteFromStorage(noteId) {
      let storedNotes = localStorage.getItem('notes');
      let notes = storedNotes ? JSON.parse(storedNotes) : [];

      notes = notes.filter(note => note.id !== parseInt(noteId));
      localStorage.setItem('notes', JSON.stringify(notes));
    }

    li.appendChild(h2);
    li.appendChild(p);
    li.appendChild(img);

    return li;
  }

 function loadNotes() {
  let storedNotes = localStorage.getItem('notes');
  let notes = storedNotes ? JSON.parse(storedNotes) : [];

  notes.forEach(note => {
    const li = createNoteElement(note);
    if (note.position === 'attente-container') {
      attenteContainer.appendChild(li);
    } else if (note.position === 'en-cours-container') {
      enCoursContainer.appendChild(li);
    } else if (note.position === 'termine-container') {
      termineContainer.appendChild(li);
    }
  });
}

loadNotes();


  initializeDragAndDrop(attenteContainer, termineContainer);
  initializeDragAndDrop(termineContainer, attenteContainer);
  initializeDragAndDrop(termineContainer, enCoursContainer);
});


// TODO : stocker par colonne
// TODO : stocker les contenus modifiés