let currentUserType = null;

// Helper to sync data to backend
async function syncPatientData(patientObj) {
  try {
    const res = await fetch('/api/patient/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patientObj)
    });
    const data = await res.json();
    if (data.success) {
      console.log('Data synced to backend');
      localStorage.setItem("currentPatient", JSON.stringify(data.user)); // Update local storage with fresh data
    } else {
      console.error('Sync failed:', data.error);
    }
  } catch (err) {
    console.error('Sync error:', err);
  }
}

// ---------- USER TYPE SELECTION ----------
function selectUserType(type) {
  currentUserType = type;
  userSelection.classList.add("hidden");
  auth.classList.remove("hidden");

  if (type === "patient") {
    patientRegister.classList.remove("hidden");
  } else {
    doctorRegister.classList.remove("hidden");
  }
}

function switchToPatientLogin() {
  patientRegister.classList.add("hidden");
  patientLogin.classList.remove("hidden");

  // Clear register form
  pname.value = "";
  page.value = "";
  pphone.value = "";
  paddress.value = "";
  puser.value = "";
  ppass.value = "";
}

function switchToDoctorLogin() {
  doctorRegister.classList.add("hidden");
  doctorLogin.classList.remove("hidden");

  // Clear register form
  dname.value = "";
  dphone.value = "";
  did.value = "";
  dpass.value = "";
}

function backToSelection() {
  // Hide all auth forms
  patientRegister.classList.add("hidden");
  doctorRegister.classList.add("hidden");
  patientLogin.classList.add("hidden");
  doctorLogin.classList.add("hidden");

  // Show user selection
  auth.classList.add("hidden");
  userSelection.classList.remove("hidden");
  currentUserType = null;

  // Clear inputs
  pname.value = "";
  page.value = "";
  pphone.value = "";
  paddress.value = "";
  puser.value = "";
  ppass.value = "";
  dname.value = "";
  dphone.value = "";
  did.value = "";
  dpass.value = "";
  lpuser.value = "";
  lppass.value = "";
  ldid.value = "";
  ldpass.value = "";
}

// ---------- REGISTER ----------
async function registerPatient() {
  // Validation
  if (!pname.value.trim() || !page.value.trim() || !pphone.value.trim() || !paddress.value.trim() || !puser.value.trim() || !ppass.value) {
    alert("All fields are required");
    return;
  }

  const payload = {
    name: pname.value.trim(),
    age: page.value,
    phone: pphone.value.trim(),
    address: paddress.value.trim(),
    username: puser.value.trim(),
    password: ppass.value
  };

  try {
    const res = await fetch('/api/auth/register/patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      alert("Patient Registered Successfully!");
      // Clear inputs
      pname.value = ""; page.value = ""; pphone.value = "";
      paddress.value = ""; puser.value = ""; ppass.value = "";

      // Show login form
      patientRegister.classList.add("hidden");
      patientLogin.classList.remove("hidden");
    } else {
      alert("Registration Failed: " + data.error);
    }
  } catch (err) {
    alert("Error connecting to server");
    console.error(err);
  }
}

async function registerDoctor() {
  if (!dname.value.trim() || !dphone.value.trim() || !did.value.trim() || !dpass.value) {
    alert("All fields are required");
    return;
  }

  const payload = {
    name: dname.value.trim(),
    phone: dphone.value.trim(),
    doctorId: did.value.trim(),
    password: dpass.value
  };

  try {
    const res = await fetch('/api/auth/register/doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      alert("Doctor Registered Successfully!");
      // Clear inputs
      dname.value = ""; dphone.value = ""; did.value = ""; dpass.value = "";

      // Show login form
      doctorRegister.classList.add("hidden");
      doctorLogin.classList.remove("hidden");
    } else {
      alert("Registration Failed: " + data.error);
    }
  } catch (err) {
    alert("Error connecting to server");
    console.error(err);
  }
}

// ---------- LOGIN ----------
async function loginPatient() {
  if (!lpuser.value.trim() || !lppass.value) {
    alert("Username and password required");
    return;
  }

  try {
    const res = await fetch('/api/auth/login/patient', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: lpuser.value.trim(),
        password: lppass.value
      })
    });
    const data = await res.json();

    if (data.success) {
      // Store user info in localStorage for session management
      localStorage.setItem("currentPatient", JSON.stringify(data.user));

      lpuser.value = "";
      lppass.value = "";
      patientLogin.classList.add("hidden");
      showPatient();
    } else {
      alert("Login Failed: " + data.error);
    }
  } catch (err) {
    alert("Error connecting to server");
    console.error(err);
  }
}

async function loginDoctor() {
  if (!ldid.value.trim() || !ldpass.value) {
    alert("Doctor ID and password required");
    return;
  }

  try {
    const res = await fetch('/api/auth/login/doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId: ldid.value.trim(),
        password: ldpass.value
      })
    });
    const data = await res.json();

    if (data.success) {
      localStorage.setItem("currentDoctor", JSON.stringify(data.user));

      ldid.value = "";
      ldpass.value = "";
      doctorLogin.classList.add("hidden");
      showDoctor();
    } else {
      alert("Login Failed: " + data.error);
    }
  } catch (err) {
    alert("Error connecting to server");
    console.error(err);
  }
}

// ---------- DASHBOARD SWITCH ----------
function showPatient() {
  auth.classList.add("hidden");
  userSelection.classList.add("hidden");
  patientDash.classList.remove("hidden");

  let p = JSON.parse(localStorage.getItem("currentPatient"));
  if (!p) return logout();

  patientTitle.innerText = "Welcome " + p.name;
  document.getElementById('patientUser').innerText = p.username;
  document.getElementById('welcomeText').innerText = 'Welcome, ' + p.name;
  streakText.innerText = "Streak: " + p.streak;

  // Update family button visibility
  if (p.family && p.family.length > 0) {
    document.getElementById("showFamilyBtn").classList.remove("hidden");
  } else {
    document.getElementById("showFamilyBtn").classList.add("hidden");
  }
  // populate profile panel
  updateProfileInfo();
  // render appointments list
  renderAppointments();
}

// Render appointments in the appointments card
function renderAppointments() {
  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;

  const container = document.getElementById('appointmentsList');
  container.innerHTML = '';
  const list = p.appointments || [];
  if (list.length === 0) {
    container.innerHTML = '<p class="muted">No appointments yet</p>';
    return;
  }
  list.forEach((a, idx) => {
    const el = document.createElement('div');
    el.className = 'appointment-item';
    el.innerHTML = `<div><strong>${a.docName}</strong><div class="meta">${a.hospital} • ${a.date} • ${a.time}</div></div>
      <div style="display:flex;gap:8px"><button onclick="toggleReminder(${idx})">${a.reminder ? 'Unremind' : 'Remind'}</button><button onclick="cancelAppointment(${idx})" style="background:#eee;color:#111">Cancel</button></div>`;
    container.appendChild(el);
  });
}

function toggleReminder(index) {
  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;

  p.appointments = p.appointments || [];
  p.appointments[index].reminder = !p.appointments[index].reminder;

  syncPatientData(p);
  renderAppointments();
}

function cancelAppointment(index) {
  if (!confirm('Cancel this appointment?')) return;

  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;

  p.appointments.splice(index, 1);
  syncPatientData(p);
  renderAppointments();
}

function showDoctor() {
  auth.classList.add("hidden");
  userSelection.classList.add("hidden");
  doctorDash.classList.remove("hidden");

  let d = JSON.parse(localStorage.getItem("currentDoctor"));
  if (!d) return logout();

  doctorTitle.innerText = "Dr. " + d.name;
  updateProfileInfo();
}

function logout() {
  // Hide dashboards
  patientDash.classList.add("hidden");
  doctorDash.classList.add("hidden");

  // Show user selection
  userSelection.classList.remove("hidden");

  // Clear localStorage
  localStorage.removeItem("currentPatient");
  localStorage.removeItem("currentDoctor");
  currentUserType = null;
  // reset profile toggle and info
  try { document.getElementById('profileToggle').checked = false; } catch (e) { }
  document.getElementById('profileName').innerText = '-';
  document.getElementById('profileEmail').innerText = '-';
  document.getElementById('profilePhone').innerText = '-';
}

// ---------- MEDICINE ----------
function takeMed(time) {
  let p = JSON.parse(localStorage.getItem("currentPatient"));

  let today = new Date().toLocaleDateString();

  // Check if medicine was already taken today
  let alreadyTakenToday = p.history.some(h => h.date === today);

  // Only increment streak once per day
  if (!alreadyTakenToday) {
    p.streak++;
    p.lastStreakDate = today;
  }

  // Add history entry
  p.history.push({
    date: today,
    time: time,
    timestamp: new Date().getTime()
  });

  syncPatientData(p);
  showPatient();
  alert("Medicine tracked - " + time);
}

// ---------- STREAK CALENDAR ----------
function showStreakCalendar() {
  let calendarDiv = document.getElementById("streakCalendar");

  if (calendarDiv.classList.contains("hidden")) {
    calendarDiv.classList.remove("hidden");
    generateCalendar();
  } else {
    calendarDiv.classList.add("hidden");
  }
}

function generateCalendar() {
  let p = JSON.parse(localStorage.getItem("currentPatient"));

  let streakDates = p.history.map(h => h.date);
  let today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth();

  let firstDay = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();

  let calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  // Add day headers
  let dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayHeaders.forEach(day => {
    let header = document.createElement("div");
    header.style.fontWeight = "bold";
    header.innerText = day;
    header.style.textAlign = "center";
    calendar.appendChild(header);
  });

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    let emptyCell = document.createElement("div");
    calendar.appendChild(emptyCell);
  }

  // Add days of month
  for (let day = 1; day <= daysInMonth; day++) {
    let dateStr = new Date(year, month, day).toLocaleDateString();
    let dayCell = document.createElement("div");
    dayCell.className = "calendar-day";
    dayCell.innerText = day;

    if (streakDates.includes(dateStr)) {
      dayCell.classList.add("active");
      dayCell.title = "Medicine taken";
    } else {
      dayCell.classList.add("inactive");
    }

    calendar.appendChild(dayCell);
  }
}

// ---------- FAMILY ----------
function addFamily() {
  if (!familyInput.value.trim()) {
    alert("Family member name is required");
    return;
  }
  if (!familyPhone.value.trim()) {
    alert("Contact number is required");
    return;
  }
  if (!/^\d{10}$/.test(familyPhone.value.trim())) {
    alert("Contact number must be 10 digits");
    return;
  }

  let p = JSON.parse(localStorage.getItem("currentPatient"));
  p.family.push({
    name: familyInput.value.trim(),
    phone: familyPhone.value.trim()
  });

  syncPatientData(p);
  alert("Family member added");
  familyInput.value = "";
  familyPhone.value = "";

  // Show the show details button
  document.getElementById("showFamilyBtn").classList.remove("hidden");
}

function showFamilyDetails() {
  let familyDetails = document.getElementById("familyDetails");

  if (familyDetails.classList.contains("hidden")) {
    familyDetails.classList.remove("hidden");
    displayFamilyList();
  } else {
    familyDetails.classList.add("hidden");
  }
}

function displayFamilyList() {
  let p = JSON.parse(localStorage.getItem("currentPatient"));
  let familyList = document.getElementById("familyList");

  familyList.innerHTML = "";
  p.family.forEach((member, index) => {
    let li = document.createElement("li");
    li.innerHTML = (index + 1) + ". <strong>" + member.name + "</strong><br>Phone: " + member.phone;
    familyList.appendChild(li);
  });
}

// ---------- BOOK DOCTOR ----------
// Mock database of doctors in hospitals, each with a specialty
const hospitalDoctors = {
  "Apollo": [
    { id: "DOC001", name: "Dr. Rajesh Kumar", specialty: "General Physician" },
    { id: "DOC002", name: "Dr. Priya Singh", specialty: "Skin & Hair" },
    { id: "DOC003", name: "Dr. Amit Patel", specialty: "Dental Care" }
  ],
  "Max": [
    { id: "DOC004", name: "Dr. Neha Gupta", specialty: "Women's Health" },
    { id: "DOC005", name: "Dr. Vikram Sharma", specialty: "Bones and Joints" }
  ],
  "Fortis": [
    { id: "DOC006", name: "Dr. Anjali Verma", specialty: "Child Specialist" },
    { id: "DOC007", name: "Dr. Suresh Reddy", specialty: "ENT" },
    { id: "DOC008", name: "Dr. Meera Iyer", specialty: "Mental Wellness" }
  ]
};

// Available specialties to show with simple icons (using emoji placeholders)
const specialties = [
  { key: 'General Physician', label: 'General Physician', icon: '🩺' },
  { key: 'Skin & Hair', label: 'Skin & Hair', icon: '💇‍♀️' },
  { key: "Women's Health", label: "Women's Health", icon: '🤰' },
  { key: 'Dental Care', label: 'Dental Care', icon: '🦷' },
  { key: 'Child Specialist', label: 'Child Specialist', icon: '🧒' },
  { key: 'ENT', label: 'Ear, Nose & Throat', icon: '👂' },
  { key: 'Mental Wellness', label: 'Mental Wellness', icon: '🧠' },
  { key: 'Bones and Joints', label: 'Bones & Joints', icon: '🦴' }
];

function showHospitalSpecialties() {
  let hospital = document.getElementById("hospitalSelect").value;

  if (!hospital) {
    alert("Please select a hospital");
    return;
  }

  // Show specialties grid
  document.getElementById('specialties').classList.remove('hidden');
  const grid = document.getElementById('specialtyGrid');
  grid.innerHTML = '';

  specialties.forEach(s => {
    const card = document.createElement('div');
    card.className = 'specialty-card';
    card.innerHTML = `
      <div class="specialty-icon">${s.icon}</div>
      <div class="specialty-label">${s.label}</div>
    `;
    card.onclick = () => displayDoctorsBySpecialty(hospital, s.key);
    grid.appendChild(card);
  });

  // Also hide previous doctorsList
  document.getElementById('doctorsList').classList.add('hidden');
}

function displayDoctorsBySpecialty(hospital, specialty) {
  const doctors = hospitalDoctors[hospital] || [];
  const matched = doctors.filter(d => d.specialty === specialty);
  const others = doctors.filter(d => d.specialty !== specialty);

  const container = document.getElementById('doctorsContainer');
  container.innerHTML = '';
  document.getElementById('doctorsTitle').innerText = `${specialty} - Available Doctors`;

  // Show matched doctors first
  if (matched.length === 0) {
    const p = document.createElement('p');
    p.innerText = 'No doctors found for this specialty in the selected hospital.';
    container.appendChild(p);
  }

  matched.forEach(doctor => {
    let doctorDiv = document.createElement('div');
    doctorDiv.className = 'doctor-item';
    doctorDiv.innerHTML = `
      <div>
        <strong>${doctor.name}</strong><br>
        ID: ${doctor.id}<br>
        <small>${doctor.specialty}</small>
      </div>
      <button onclick="bookSelectedDoctor('${doctor.id}', '${doctor.name}', '${hospital}')">Book</button>
    `;
    container.appendChild(doctorDiv);
  });

  // Then list others under "Other Specialists" (these will be treated as general medicine entries)
  if (others.length > 0) {
    const heading = document.createElement('h5');
    heading.innerText = 'Other Specialists';
    heading.style.marginTop = '12px';
    container.appendChild(heading);

    others.forEach(doctor => {
      let doctorDiv = document.createElement('div');
      doctorDiv.className = 'doctor-item';
      doctorDiv.innerHTML = `
        <div>
          <strong>${doctor.name}</strong><br>
          ID: ${doctor.id}<br>
          <small>General Medicine</small>
        </div>
        <button onclick="bookSelectedDoctor('${doctor.id}', '${doctor.name}', '${hospital}')">Book</button>
      `;
      container.appendChild(doctorDiv);
    });
  }

  document.getElementById('doctorsList').classList.remove('hidden');
}

// legacy function kept for backward compatibility (not used currently)
function displayDoctorsForHospital(hospital) {
  displayDoctorsBySpecialty(hospital, 'General Physician');
}

function bookSelectedDoctor(docID, docName, hospital) {
  openAppointmentInline(docID, docName, hospital);
}

// Inline appointment flow (embedded in index.html)
function openAppointmentInline(docID, docName, hospital) {
  // show appointment section
  document.getElementById('appointmentSection').classList.remove('hidden');
  // hide doctors list to focus
  document.getElementById('doctorsList').classList.add('hidden');

  document.getElementById('appointDoctor').innerText = docName + ' (' + docID + ')';
  document.getElementById('appointHospital').innerText = hospital;
  document.getElementById('appointHeading').innerText = 'Book Appointment - ' + docName;

  // generate next 7 days
  const datesRow = document.getElementById('appointDates');
  datesRow.innerHTML = '';
  const dateEls = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const label = d.toLocaleDateString();
    const el = document.createElement('div');
    el.className = 'date-item';
    el.innerText = label;
    el.dataset.date = label;
    el.onclick = () => selectAppDate(el);
    datesRow.appendChild(el);
    dateEls.push(el);
  }

  // times
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:30 PM'];
  const slotsContainer = document.getElementById('appointTimes');
  slotsContainer.innerHTML = '';
  timeSlots.forEach(t => {
    const s = document.createElement('div');
    s.className = 'slot';
    s.innerText = t;
    s.onclick = () => {
      document.querySelectorAll('#appointTimes .slot').forEach(x => x.classList.remove('selected'));
      s.classList.add('selected');
    };
    slotsContainer.appendChild(s);
  });

  // select first date by default
  if (dateEls.length) selectAppDate(dateEls[0]);

  // wire confirm and cancel
  document.getElementById('confirmAppointment').onclick = function () {
    const selectedDateEl = document.querySelector('#appointDates .date-item.selected');
    const selectedTimeEl = document.querySelector('#appointTimes .slot.selected');
    if (!selectedDateEl || !selectedTimeEl) { alert('Please select date and time'); return; }

    const selectedDate = selectedDateEl.dataset.date;
    const selectedTime = selectedTimeEl.innerText;

    const current = localStorage.getItem('currentPatient');
    if (!current) { alert('Please login as patient to book'); return; }

    // Parse the object directly
    const p = JSON.parse(current);
    if (!p.appointments) p.appointments = [];
    p.appointments.push({ docID, docName, hospital, date: selectedDate, time: selectedTime, bookedAt: new Date().toISOString() });

    // Sync to backend
    syncPatientData(p);

    alert('Appointment booked with ' + docName + ' on ' + selectedDate + ' at ' + selectedTime);

    // hide appointment section and show patient dashboard
    document.getElementById('appointmentSection').classList.add('hidden');
    showPatient();
    renderAppointments();
  };

  document.getElementById('cancelAppointment').onclick = function () {
    document.getElementById('appointmentSection').classList.add('hidden');
    // return to doctors list if hospital still selected, else show patient dash
    if (document.getElementById('hospitalSelect').value) {
      document.getElementById('doctorsList').classList.remove('hidden');
    } else {
      showPatient();
    }
  };

  function selectAppDate(el) {
    document.querySelectorAll('#appointDates .date-item').forEach(x => x.classList.remove('selected'));
    el.classList.add('selected');
  }
}

// Visits rendering: each visit has consult/details and results
function renderVisits() {
  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;

  const container = document.getElementById('visitsList'); container.innerHTML = '';
  const visits = p.visits || [];
  if (!visits.length) { container.innerHTML = '<p class="muted">No visits recorded</p>'; return; }
  visits.forEach((v, idx) => {
    const el = document.createElement('div'); el.className = 'visit-item';
    el.innerHTML = `<div><strong>${v.hospital}</strong><div class="meta">${v.date} • ${v.doctorName} (${v.doctorID})</div></div>
      <div style="display:flex;gap:8px"><button onclick="showConsult(${idx})">Consult</button><button onclick="showResults(${idx})">Results & Records</button></div>`;
    container.appendChild(el);
  });
}

// Render medical records into the Records card (uses visits array)
function renderRecords() {
  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;

  const container = document.getElementById('recordsList'); container.innerHTML = '';
  const visits = p.visits || [];
  if (!visits.length) { container.innerHTML = '<p class="muted">No records available</p>'; return; }
  visits.forEach((v, idx) => {
    const el = document.createElement('div'); el.className = 'visit-item';
    el.style.marginBottom = '8px';
    el.innerHTML = `<div><strong>${v.hospital}</strong><div class="meta">${v.date} • ${v.doctorName || v.docName} </div></div>
      <div style="display:flex;gap:8px"><button onclick="showConsult(${idx})">Consult</button><button onclick="showResults(${idx})">Results</button></div>`;
    container.appendChild(el);
  });
}

function showConsult(index) {
  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;
  const v = p.visits[index];
  alert(`Consult Details:\nHospital: ${v.hospital}\nLocation: ${v.location || 'N/A'}\nDoctor: ${v.doctorName}\nID: ${v.doctorID}`);
}

function showResults(index) {
  const p = JSON.parse(localStorage.getItem('currentPatient'));
  if (!p) return;
  const v = p.visits[index];
  const r = v.results || { lab: 'N/A', date: 'N/A', by: 'N/A', glucose: '-', hemoglobin: '-', others: '-' };
  alert(`Results & Records:\nLab: ${r.lab}\nDate: ${r.date}\nPrepared by: ${r.by}\nGlucose: ${r.glucose}\nHemoglobin: ${r.hemoglobin}\nOthers: ${r.others}`);
}

// ---------- EMERGENCY ----------
// Mock ambulance data
const emergencyHospitals = {
  "Apollo Hospital": {
    ambulance: "9876543210",
    address: "Sector 51, Gurgaon"
  },
  "Max Healthcare": {
    ambulance: "9876543211",
    address: "Saket, New Delhi"
  },
  "Fortis Hospital": {
    ambulance: "9876543212",
    address: "Okhla, New Delhi"
  }
};

function handleEmergency() {
  let confirmed = confirm("Are you sure you want to activate EMERGENCY?\n\nThis will alert nearby hospitals and inform your family members.");

  if (!confirmed) {
    return;
  }

  let p = JSON.parse(localStorage.getItem("currentPatient"));

  // Pick a random hospital
  let hospitalNames = Object.keys(emergencyHospitals);
  let hospital = hospitalNames[Math.floor(Math.random() * hospitalNames.length)];
  let hospitalData = emergencyHospitals[hospital];

  // Create alert message
  let message = "🚨 EMERGENCY ACTIVATED\n\n";
  message += "Hospital: " + hospital + "\n";
  message += "Address: " + hospitalData.address + "\n";
  message += "Ambulance Number: " + hospitalData.ambulance + "\n\n";
  message += "✓ Ambulance dispatched to your location\n";
  message += "✓ Family members informed\n\n";
  message += "Family Members Informed:\n";

  if (p.family && p.family.length > 0) {
    p.family.forEach(member => {
      message += "• " + member.name + " (" + member.phone + ")\n";
    });
  } else {
    message += "• No family members added\n";
  }

  alert(message);
}

// Populate profile panel with current user details
function updateProfileInfo() {
  const cp = JSON.parse(localStorage.getItem('currentPatient'));
  const cd = JSON.parse(localStorage.getItem('currentDoctor'));

  if (cp) {
    document.getElementById('profileName').innerText = cp.name || '-';
    document.getElementById('profileEmail').innerText = (cp.username ? cp.username + '@example.com' : '-');
    document.getElementById('profilePhone').innerText = cp.phone || '-';
    return;
  }
  if (cd) {
    document.getElementById('profileName').innerText = (cd.name ? 'Dr. ' + cd.name : '-');
    document.getElementById('profileEmail').innerText = (cd.doctorId ? cd.doctorId + '@hospital.com' : '-');
    document.getElementById('profilePhone').innerText = cd.phone || '-';
    return;
  }
  document.getElementById('profileName').innerText = '-';
  document.getElementById('profileEmail').innerText = '-';
  document.getElementById('profilePhone').innerText = '-';
}
// AI agent removed

function searchPatient() {
  if (!searchUser.value.trim()) {
    alert("Patient username is required");
    return;
  }

  let u = searchUser.value.trim();
  let p = JSON.parse(localStorage.getItem("patient_" + u));

  if (!p) {
    alert("Patient not found");
    return;
  }

  patientResult.innerHTML =
    "<strong>Patient Found</strong><br>" +
    "Name: " + p.name +
    "<br>Age: " + p.age +
    "<br>Streak: " + p.streak +
    "<br>History: " + (p.history.length > 0 ? p.history.join(", ") : "No history");
}

// Initialize UI on page load based on auth state
document.addEventListener('DOMContentLoaded', function () {
  // If a patient is logged in, show patient dashboard
  if (localStorage.getItem('currentPatient')) {
    try { showPatient(); } catch (e) { /* safe fallback */ }
    return;
  }

  // If a doctor is logged in, show doctor dashboard
  if (localStorage.getItem('currentDoctor')) {
    try { showDoctor(); } catch (e) { /* safe fallback */ }
    return;
  }

  // otherwise leave default selection view
  // ensure profile panel cleared
  updateProfileInfo();
});
