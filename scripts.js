// State management
const state = {
    faculties: [],
    subjects: [],
    rooms: [],
    groups: [],
    timetable: null
  };
  
  // Time slots
  const TIME_SLOTS = [
    '8:35-9:25',
    '9:30-10:20',
    '10:25-11:15',
    '11:20-12:10',
    '12:15-13:05',
    '13:10-14:00',
    '14:05-14:55',
    '15:00-15:50',
    '15:55-16:45'
  ];
  
  const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // UI Elements
  const elements = {
    tabs: document.querySelectorAll('.tab'),
    panels: document.querySelectorAll('.panel'),
    message: document.getElementById('message'),
    facultyList: document.getElementById('facultyList'),
    subjectList: document.getElementById('subjectList'),
    roomList: document.getElementById('roomList'),
    groupList: document.getElementById('groupList'),
    timetable: document.getElementById('timetable'),
    addFacultyBtn: document.getElementById('addFacultyBtn'),
    addSubjectBtn: document.getElementById('addSubjectBtn'),
    addRoomBtn: document.getElementById('addRoomBtn'),
    addGroupBtn: document.getElementById('addGroupBtn'),
    generateBtn: document.getElementById('generateBtn'),
    saveBtn: document.getElementById('saveBtn'),
    printBtn: document.getElementById('printBtn')
  };
  
  // Event Listeners
  elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.dataset.tab));
  });
  
  elements.addFacultyBtn.addEventListener('click', addFaculty);
  elements.addSubjectBtn.addEventListener('click', addSubject);
  elements.addRoomBtn.addEventListener('click', addRoom);
  elements.addGroupBtn.addEventListener('click', addGroup);
  elements.generateBtn.addEventListener('click', generateTimetable);
  elements.saveBtn.addEventListener('click', saveData);
  elements.printBtn.addEventListener('click', () => window.print());
  
  // Load saved data on startup
  loadData();
  
  // UI Functions
  function switchTab(tabName) {
    elements.tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    elements.panels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `${tabName}Panel`);
    });
  }
  
  function showMessage(text, type = 'success') {
    elements.message.textContent = text;
    elements.message.className = `message ${type}`;
    setTimeout(() => {
      elements.message.className = 'message hidden';
    }, 3000);
  }
  
  // Data Management Functions
  function addFaculty() {
    const faculty = {
      id: Date.now().toString(),
      name: '',
      availableSlots: []
    };
    state.faculties.push(faculty);
    renderFacultyList();
  }
  
  function addSubject() {
    const subject = {
      id: Date.now().toString(),
      code: '',
      name: '',
      weeklyHours: 0,
      assignedFaculty: ''
    };
    state.subjects.push(subject);
    renderSubjectList();
  }
  
  function addRoom() {
    const room = {
      id: Date.now().toString(),
      number: '',
      capacity: 0
    };
    state.rooms.push(room);
    renderRoomList();
  }
  
  function addGroup() {
    const group = {
      id: Date.now().toString(),
      name: ''
    };
    state.groups.push(group);
    renderGroupList();
  }
  
  function renderFacultyList() {
    elements.facultyList.innerHTML = state.faculties.map(faculty => `
      <div class="input-row" data-id="${faculty.id}">
        <div class="input-group">
          <label>Faculty Name</label>
          <input type="text" value="${faculty.name}" onchange="updateFaculty('${faculty.id}', 'name', this.value)">
        </div>
        <div class="input-group">
          <label>Available Slots</label>
          <select multiple onchange="updateFacultySlots('${faculty.id}', this)">
            ${TIME_SLOTS.map(slot => `
              <option value="${slot}" ${faculty.availableSlots.includes(slot) ? 'selected' : ''}>
                ${slot}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `).join('');
  }
  
  function renderSubjectList() {
    elements.subjectList.innerHTML = state.subjects.map(subject => `
      <div class="input-row" data-id="${subject.id}">
        <div class="input-group">
          <label>Course Code</label>
          <input type="text" value="${subject.code}" onchange="updateSubject('${subject.id}', 'code', this.value)">
        </div>
        <div class="input-group">
          <label>Subject Name</label>
          <input type="text" value="${subject.name}" onchange="updateSubject('${subject.id}', 'name', this.value)">
        </div>
        <div class="input-group">
          <label>Weekly Hours</label>
          <input type="number" value="${subject.weeklyHours}" onchange="updateSubject('${subject.id}', 'weeklyHours', parseInt(this.value))">
        </div>
        <div class="input-group">
          <label>Assigned Faculty</label>
          <select onchange="updateSubject('${subject.id}', 'assignedFaculty', this.value)">
            <option value="">Select Faculty</option>
            ${state.faculties.map(faculty => `
              <option value="${faculty.id}" ${subject.assignedFaculty === faculty.id ? 'selected' : ''}>
                ${faculty.name}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `).join('');
  }
  
  function renderRoomList() {
    elements.roomList.innerHTML = state.rooms.map(room => `
      <div class="input-row" data-id="${room.id}">
        <div class="input-group">
          <label>Room Number</label>
          <input type="text" value="${room.number}" onchange="updateRoom('${room.id}', 'number', this.value)">
        </div>
        <div class="input-group">
          <label>Capacity</label>
          <input type="number" value="${room.capacity}" onchange="updateRoom('${room.id}', 'capacity', parseInt(this.value))">
        </div>
      </div>
    `).join('');
  }
  
  function renderGroupList() {
    elements.groupList.innerHTML = state.groups.map(group => `
      <div class="input-row" data-id="${group.id}">
        <div class="input-group">
          <label>Group Name</label>
          <input type="text" value="${group.name}" onchange="updateGroup('${group.id}', 'name', this.value)">
        </div>
      </div>
    `).join('');
  }
  
  // Update Functions
  function updateFaculty(id, field, value) {
    const faculty = state.faculties.find(f => f.id === id);
    if (faculty) {
      faculty[field] = value;
    }
  }
  
  function updateFacultySlots(id, selectElement) {
    const faculty = state.faculties.find(f => f.id === id);
    if (faculty) {
      faculty.availableSlots = Array.from(selectElement.selectedOptions).map(option => option.value);
    }
  }
  
  function updateSubject(id, field, value) {
    const subject = state.subjects.find(s => s.id === id);
    if (subject) {
      subject[field] = value;
    }
  }
  
  function updateRoom(id, field, value) {
    const room = state.rooms.find(r => r.id === id);
    if (room) {
      room[field] = value;
    }
  }
  
  function updateGroup(id, field, value) {
    const group = state.groups.find(g => g.id === id);
    if (group) {
      group[field] = value;
    }
  }
  
  // Timetable Generation
  function generateTimetable() {
    try {
      validateInput();
      const timetable = createEmptyTimetable();
      state.timetable = fillTimetable(timetable);
      renderTimetable();
      switchTab('timetable');
      showMessage('Timetable generated successfully!');
    } catch (error) {
      showMessage(error.message, 'error');
    }
  }
  
  function validateInput() {
    if (!state.faculties.length) throw new Error('Please add at least one faculty member');
    if (!state.subjects.length) throw new Error('Please add at least one subject');
    if (!state.rooms.length) throw new Error('Please add at least one room');
    if (!state.groups.length) throw new Error('Please add at least one student group');
  
    // Validate faculty data
    state.faculties.forEach(faculty => {
      if (!faculty.name) throw new Error('All faculty members must have names');
      if (!faculty.availableSlots.length) throw new Error(`Faculty ${faculty.name} has no available slots`);
    });
  
    // Validate subject data
    state.subjects.forEach(subject => {
      if (!subject.code) throw new Error('All subjects must have course codes');
      if (!subject.name) throw new Error('All subjects must have names');
      if (!subject.weeklyHours) throw new Error(`Subject ${subject.code} has no weekly hours`);
      if (!subject.assignedFaculty) throw new Error(`Subject ${subject.code} has no assigned faculty`);
    });
  
    // Validate room data
    state.rooms.forEach(room => {
      if (!room.number) throw new Error('All rooms must have numbers');
      if (!room.capacity) throw new Error(`Room ${room.number} has no capacity`);
    });
  
    // Validate group data
    state.groups.forEach(group => {
      if (!group.name) throw new Error('All groups must have names');
    });
  }
  
  function createEmptyTimetable() {
    return Array(DAYS.length).fill(null).map(() =>
      Array(TIME_SLOTS.length).fill(null)
    );
  }
  
  function fillTimetable(timetable) {
    const assignedHours = new Map(state.subjects.map(s => [s.id, 0]));
    const groupFreePeriods = new Map(state.groups.map(g => [g.id, new Map(DAYS.map(d => [d, 0]))]));
    const facultyFreePeriods = new Map(state.faculties.map(f => [f.id, new Map(DAYS.map(d => [d, 9]))]));
  
    // Helper function to check if a slot is available
    function isSlotAvailable(day, slot, subject, group) {
      if (timetable[day][slot]) return false;
  
      const faculty = state.faculties.find(f => f.id === subject.assignedFaculty);
      if (!faculty.availableSlots.includes(TIME_SLOTS[slot])) return false;
  
      // Check faculty free periods requirement
      if (facultyFreePeriods.get(faculty.id).get(DAYS[day]) <= 4) return false;
  
      // Check group free periods requirement
      if (groupFreePeriods.get(group.id).get(DAYS[day]) >= 7) return false;
  
      return true;
    }
  
    // Try to schedule all subjects for all groups
    for (const group of state.groups) {
      for (const subject of state.subjects) {
        while (assignedHours.get(subject.id) < subject.weeklyHours) {
          let scheduled = false;
  
          // Try each possible slot
          for (let day = 0; day < DAYS.length && !scheduled; day++) {
            for (let slot = 0; slot < TIME_SLOTS.length && !scheduled; slot++) {
              if (isSlotAvailable(day, slot, subject, group)) {
                const faculty = state.faculties.find(f => f.id === subject.assignedFaculty);
                const room = state.rooms[0]; // Simple room assignment for now
  
                timetable[day][slot] = {
                  subject,
                  faculty,
                  room,
                  group
                };
  
                // Update counters
                assignedHours.set(subject.id, assignedHours.get(subject.id) + 1);
                groupFreePeriods.get(group.id).set(DAYS[day], groupFreePeriods.get(group.id).get(DAYS[day]) + 1);
                facultyFreePeriods.get(faculty.id).set(DAYS[day], facultyFreePeriods.get(faculty.id).get(DAYS[day]) - 1);
  
                scheduled = true;
              }
            }
          }
  
          if (!scheduled) {
            throw new Error(`Could not schedule all hours for ${subject.code}. Please check constraints.`);
          }
        }
      }
    }
  
    return timetable;
  }
  
  function renderTimetable() {
    const tbody = elements.timetable.querySelector('tbody');
    tbody.innerHTML = TIME_SLOTS.map((slot, slotIndex) => `
      <tr>
        <td>${slot}</td>
        ${DAYS.map((day, dayIndex) => {
          const entry = state.timetable[dayIndex][slotIndex];
          return entry ? `
            <td>
              <div class="timetable-cell">
                <div class="timetable-cell-subject">${entry.subject.code} - ${entry.subject.name}</div>
                <div class="timetable-cell-faculty">${entry.faculty.name}</div>
                <div class="timetable-cell-room">Room ${entry.room.number} • ${entry.group.name}</div>
              </div>
            </td>
          ` : '<td></td>';
        }).join('')}
      </tr>
    `).join('');
  }
  
  // Storage Functions
  function saveData() {
    try {
      localStorage.setItem('timetableData', JSON.stringify({
        faculties: state.faculties,
        subjects: state.subjects,
        rooms: state.rooms,
        groups: state.groups
      }));
      showMessage('Data saved successfully!');
    } catch (error) {
      showMessage('Failed to save data', 'error');
    }
  }
  
  function loadData() {
    try {
      const data = JSON.parse(localStorage.getItem('timetableData'));
      if (data) {
        state.faculties = data.faculties || [];
        state.subjects = data.subjects || [];
        state.rooms = data.rooms || [];
        state.groups = data.groups || [];
        renderFacultyList();
        renderSubjectList();
        renderRoomList();
        renderGroupList();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }