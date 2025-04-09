document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const notesList = document.getElementById('notes-list');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const newNoteBtn = document.getElementById('new-note-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const searchNotes = document.getElementById('search-notes');
    const themeToggle = document.getElementById('theme-toggle');
    const lastSaved = document.getElementById('last-saved');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const toolButtons = document.querySelectorAll('.tool-btn');
    
    // State
    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;
    let debounceTimer;
    
    // Initialize the app
    function init() {
        loadTheme();
        renderNotesList();
        setupEventListeners();
        
        if (notes.length > 0) {
            openNote(notes[0].id);
        } else {
            createNewNote();
        }
    }
    
    // Set up event listeners
    function setupEventListeners() {
        newNoteBtn.addEventListener('click', createNewNote);
        saveNoteBtn.addEventListener('click', saveNote);
        deleteNoteBtn.addEventListener('click', deleteNote);
        clearAllBtn.addEventListener('click', clearAllNotes);
        searchNotes.addEventListener('input', searchNotesHandler);
        themeToggle.addEventListener('click', toggleTheme);
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
        
        // Rich text editor functionality
        toolButtons.forEach(button => {
            button.addEventListener('click', function() {
                const command = this.getAttribute('data-command');
                if (command === 'createLink') {
                    const url = prompt('Enter the URL:');
                    if (url) document.execCommand(command, false, url);
                } else {
                    document.execCommand(command, false, null);
                }
                noteContent.focus();
            });
        });
        
        // Auto-save on content change with debounce
        noteTitle.addEventListener('input', debounce(saveNote, 1000));
        noteContent.addEventListener('input', debounce(saveNote, 1000));
    }
    
    // Load saved theme preference
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Toggle between light and dark theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    // Update theme toggle icon
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        sidebar.classList.toggle('open');
    }
    
    // Create a new note
    function createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        notes.unshift(newNote);
        currentNoteId = newNote.id;
        
        saveNotesToLocalStorage();
        renderNotesList();
        renderActiveNote();
        
        noteTitle.focus();
    }
    
    // Open a note
    function openNote(noteId) {
        currentNoteId = noteId;
        renderActiveNote();
        highlightActiveNoteInList();
    }
    
    // Save the current note
    function saveNote() {
        if (!currentNoteId) return;
        
        const noteIndex = notes.findIndex(note => note.id === currentNoteId);
        if (noteIndex === -1) return;
        
        notes[noteIndex].title = noteTitle.value || 'Untitled Note';
        notes[noteIndex].content = noteContent.innerHTML;
        notes[noteIndex].updatedAt = new Date().toISOString();
        
        saveNotesToLocalStorage();
        renderNotesList();
        updateLastSavedTime();
    }
    
    // Delete the current note
    function deleteNote() {
        if (!currentNoteId) return;
        
        if (!confirm('Are you sure you want to delete this note?')) return;
        
        notes = notes.filter(note => note.id !== currentNoteId);
        saveNotesToLocalStorage();
        
        if (notes.length > 0) {
            openNote(notes[0].id);
        } else {
            createNewNote();
        }
        
        renderNotesList();
    }
    
    // Clear all notes
    function clearAllNotes() {
        if (notes.length === 0) return;
        
        if (!confirm('Are you sure you want to delete ALL notes? This cannot be undone.')) return;
        
        notes = [];
        saveNotesToLocalStorage();
        createNewNote();
        renderNotesList();
    }
    
    // Search notes
    function searchNotesHandler() {
        const searchTerm = searchNotes.value.toLowerCase();
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
        
        renderNotesList(filteredNotes);
    }
    
    // Save notes to localStorage
    function saveNotesToLocalStorage() {
        localStorage.setItem('notes', JSON.stringify(notes));
    }
    
    // Render the notes list
    function renderNotesList(notesToRender = notes) {
        if (notesToRender.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <h2>No Notes Found</h2>
                    <p>Create your first note by clicking the "New Note" button</p>
                </div>
            `;
            return;
        }
        
        notesList.innerHTML = notesToRender.map(note => `
            <div class="note-item ${note.id === currentNoteId ? 'active' : ''}" data-id="${note.id}">
                <h3>${note.title}</h3>
                <p>${stripHtml(note.content).substring(0, 60)}...</p>
                <div class="note-date">${formatDate(note.updatedAt)}</div>
            </div>
        `).join('');
        
        // Add click event to each note item
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', function() {
                openNote(this.getAttribute('data-id'));
            });
        });
    }
    
    // Render the active note in the editor
    function renderActiveNote() {
        const note = notes.find(note => note.id === currentNoteId);
        if (!note) return;
        
        noteTitle.value = note.title;
        noteContent.innerHTML = note.content;
        updateLastSavedTime(note.updatedAt);
    }
    
    // Highlight the active note in the list
    function highlightActiveNoteInList() {
        document.querySelectorAll('.note-item').forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-id') === currentNoteId);
        });
    }
    
    // Update the last saved time display
    function updateLastSavedTime(timestamp) {
        if (timestamp) {
            lastSaved.textContent = `Last saved: ${formatDateTime(timestamp)}`;
        } else {
            lastSaved.textContent = `Saved just now`;
            setTimeout(() => {
                lastSaved.textContent = `Last saved: ${formatDateTime(new Date().toISOString())}`;
            }, 2000);
        }
    }
    
    // Helper function to strip HTML tags
    function stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
    
    // Helper function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    }
    
    // Helper function to format date and time
    function formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });
    }
    
    // Debounce function to limit how often a function is called
    function debounce(func, delay) {
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
    
    // Initialize the app
    init();
});