import React, { useEffect, useMemo, useState } from "react";
import "./index.css";



const CLASSES = [
"All",
"1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"
];
const SECTIONS = ["All", "A", "B", "C", "D"];
const STORAGE_KEY = "sms_students_v1";


const INITIAL_STUDENTS = [
{ id: 1, name: "Rahul Sharma", roll: 101, class: "10th", section: "A", email: "rahul@email.com", phone: "9876543210", marks: 450 },
{ id: 2, name: "Rajat Verma", roll: 102, class: "10th", section: "B", email: "rajat@gmail.com", phone: "9876543211", marks: 378 },
{ id: 3, name: "Anjali Singh", roll: 103, class: "9th", section: "A", email: "anjali@gmail.com", phone: "9876543212", marks: 412 },
{ id: 4, name: "Pooja Patel", roll: 104, class: "8th", section: "C", email: "pooja@gmail.com", phone: "9876543213", marks: 295 },
{ id: 5, name: "Amit Kumar", roll: 105, class: "12th", section: "A", email: "amitkumar@gmail.com", phone: "9876543214", marks: 245 },
{ id: 6, name: "Rahat Khan", roll: 106, class: "10th", section: "A", email: "rahat@gmail.com", phone: "9876543215", marks: 429 },
{ id: 7, name: "Sana Mir", roll: 107, class: "11th", section: "D", email: "sana@gmail.com", phone: "9876543216", marks: 389 },
{ id: 8, name: "Vikram Desai", roll: 108, class: "7th", section: "B", email: "vikram@gmail.com", phone: "9876543217", marks: 360 },
{ id: 9, name: "Meera Rao", roll: 109, class: "6th", section: "C", email: "meera@gmail.com", phone: "9876543218", marks: 315 },
{ id: 10, name: "Zoya Khan", roll: 110, class: "5th", section: "A", email: "zoya@gmail.com", phone: "9876543219", marks: 480 },
{ id: 11, name: "Kabir Singh", roll: 111, class: "10th", section: "A", email: "kabir@gmail.com", phone: "9876543220", marks: 198 },
];

function calcPercentage(marks) {
return Number(((marks / 500) * 100).toFixed(2));
}
function calcGrade(percentage) {
if (percentage >= 90) return "A+";
if (percentage >= 80) return "A";
if (percentage >= 70) return "B";
if (percentage >= 60) return "C";
if (percentage >= 50) return "D";
return "F";
}
function validateEmail(email) {

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone) {
return /^\d{10}$/.test(phone);
}

export default function App() {
const [students, setStudents] = useState([]);
const [query, setQuery] = useState("");
const [filterClass, setFilterClass] = useState("All");
const [filterSection, setFilterSection] = useState("All");
const [sortOption, setSortOption] = useState("");
const [form, setForm] = useState({
id: null,
name: "",
roll: "",
class: "1st",
section: "A",
email: "",
phone: "",
marks: "",
});
const [errors, setErrors] = useState({});
const [isEditing, setIsEditing] = useState(false);
const [message, setMessage] = useState("");


useEffect(() => {
const raw = localStorage.getItem(STORAGE_KEY);
if (raw) {
try {
const parsed = JSON.parse(raw);
setStudents(parsed);
} catch {
setStudents(INITIAL_STUDENTS);
}
} else {
setStudents(INITIAL_STUDENTS);
}
}, []);


useEffect(() => {
localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}, [students]);

useEffect(() => {
if (!message) return;
const t = setTimeout(() => setMessage(""), 3000);
return () => clearTimeout(t);
}, [message]);

// validation
function validate(formData) {
const e = {};
if (!formData.name || formData.name.trim().length < 3) {
e.name = "Name must be at least 3 characters";
}
if (!formData.roll || !/^\d+$/.test(String(formData.roll))) {
e.roll = "Roll number must be a number";
} else {
const rollNum = Number(formData.roll);
const exists = students.some(s => s.roll === rollNum && s.id !== formData.id);
if (exists) e.roll = "Roll number already exists";
}
if (!formData.email || !validateEmail(formData.email)) {
e.email = "Enter valid email";
}
if (!formData.phone || !isValidPhone(String(formData.phone))) {
e.phone = "Phone must be exactly 10 digits";
}
if (formData.marks === "" || isNaN(Number(formData.marks))) {
e.marks = "Marks must be a number between 0 and 500";
} else {
const m = Number(formData.marks);
if (m < 0 || m > 500) e.marks = "Marks must be between 0 and 500";
}
if (!formData.class) e.class = "Select class";
if (!formData.section) e.section = "Select section";
return e;
}

function resetForm() {
setForm({ id: null, name: "", roll: "", class: "1st", section: "A", email: "", phone: "", marks: "" });
setErrors({});
setIsEditing(false);
}

function handleChange(e) {
const { name, value } = e.target;
setForm(prev => ({ ...prev, [name]: value }));
}

function handleSubmit(e) {
e.preventDefault();
const validation = validate(form);
if (Object.keys(validation).length) {
setErrors(validation);
return;
}
const rollNum = Number(form.roll);
const marksNum = Number(form.marks);
const percentage = calcPercentage(marksNum);
const grade = calcGrade(percentage);

if (isEditing) {
setStudents(prev => prev.map(s => s.id === form.id ? { ...s, name: form.name.trim(), roll: rollNum, class: form.class, section: form.section, email: form.email.trim(), phone: form.phone.trim(), marks: marksNum } : s));
setMessage("Student updated successfully");
} else {
const newStudent = {
id: Date.now(),
name: form.name.trim(),
roll: rollNum,
class: form.class,
section: form.section,
email: form.email.trim(),
phone: form.phone.trim(),
marks: marksNum
};
setStudents(prev => [newStudent, ...prev]);
setMessage("Student added successfully");
}
resetForm();
}

function handleEdit(student) {
setForm({ ...student });
setIsEditing(true);
setErrors({});
window.scrollTo({ top: 0, behavior: "smooth" });
}

function handleDelete(student) {
const confirmed = window.confirm(`Are you sure you want to delete ${student.name}?`);
if (!confirmed) return;
setStudents(prev => prev.filter(s => s.id !== student.id));
setMessage("Student deleted");
}

// search + filter combination
const filtered = useMemo(() => {
let arr = [...students];
if (query.trim()) {
const q = query.trim().toLowerCase();
arr = arr.filter(s => s.name.toLowerCase().includes(q));
}
if (filterClass !== "All") arr = arr.filter(s => s.class === filterClass);
if (filterSection !== "All") arr = arr.filter(s => s.section === filterSection);

// compute derived fields (percentage, grade) for sorting/display
arr = arr.map(s => ({ ...s, percentage: calcPercentage(s.marks), grade: calcGrade(calcPercentage(s.marks)) }));

// sorting
switch (sortOption) {
case "name_asc": arr.sort((a,b)=> a.name.localeCompare(b.name)); break;
case "name_desc": arr.sort((a,b)=> b.name.localeCompare(a.name)); break;
case "roll_asc": arr.sort((a,b)=> a.roll - b.roll); break;
case "roll_desc": arr.sort((a,b)=> b.roll - a.roll); break;
case "perc_desc": arr.sort((a,b)=> b.percentage - a.percentage); break;
case "perc_asc": arr.sort((a,b)=> a.percentage - b.percentage); break;
default: break;
}

return arr;
}, [students, query, filterClass, filterSection, sortOption]);

// statistics
const stats = useMemo(() => {
if (!students.length) return { total: 0, avg: 0, top: null, low: null };
const withPerc = students.map(s => ({ ...s, percentage: calcPercentage(s.marks) }));
const total = students.length;
const avg = Number((withPerc.reduce((acc, s) => acc + s.percentage, 0) / total).toFixed(2));
const top = withPerc.reduce((a,b) => (b.percentage > a.percentage ? b : a), withPerc[0]);
const low = withPerc.reduce((a,b) => (b.percentage < a.percentage ? b : a), withPerc[0]);
return { total, avg, top, low };
}, [students]);

return (
<div className="container">
<h1>Student Management System</h1>

{/* Message */}
{message && <div className="message">{message}</div>}

{/* Form */}
<div className="card form-card">
<h2>{isEditing ? "Edit Student" : "Add New Student"}</h2>
<form onSubmit={handleSubmit} className="form-grid" noValidate>
<div className="form-group">
<label>Name</label>
<input name="name" value={form.name} onChange={handleChange} />
{errors.name && <small className="err">{errors.name}</small>}
</div>

<div className="form-group">
<label>Roll Number</label>
<input name="roll" value={form.roll} onChange={handleChange} />
{errors.roll && <small className="err">{errors.roll}</small>}
</div>

<div className="form-group">
<label>Class</label>
<select name="class" value={form.class} onChange={handleChange}>
{CLASSES.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
</select>
{errors.class && <small className="err">{errors.class}</small>}
</div>

<div className="form-group">
<label>Section</label>
<select name="section" value={form.section} onChange={handleChange}>
{SECTIONS.slice(1).map(s => <option key={s} value={s}>{s}</option>)}
</select>
{errors.section && <small className="err">{errors.section}</small>}
</div>

<div className="form-group">
<label>Email</label>
<input name="email" value={form.email} onChange={handleChange} />
{errors.email && <small className="err">{errors.email}</small>}
</div>

<div className="form-group">
<label>Phone</label>
<input name="phone" value={form.phone} onChange={handleChange} />
{errors.phone && <small className="err">{errors.phone}</small>}
</div>

<div className="form-group">
<label>Marks (out of 500)</label>
<input name="marks" value={form.marks} onChange={handleChange} />
{errors.marks && <small className="err">{errors.marks}</small>}
</div>

<div className="form-actions">
<button type="submit" className="btn primary">{isEditing ? "Update Student" : "Add Student"}</button>
<button type="button" className="btn" onClick={resetForm}>Clear</button>
</div>
</form>
</div>

{/* Stats */}
<div className="stats-row">
<div className="stat-card">
<div className="stat-title">Total Students</div>
<div className="stat-value">{stats.total}</div>
</div>
<div className="stat-card">
<div className="stat-title">Average %</div>
<div className="stat-value">{stats.avg}%</div>
</div>
<div className="stat-card">
<div className="stat-title">Top Scorer</div>
<div className="stat-value">{stats.top ? `${stats.top.name} (${stats.top.percentage}%)` : "-"}</div>
</div>
<div className="stat-card">
<div className="stat-title">Lowest Scorer</div>
<div className="stat-value">{stats.low ? `${stats.low.name} (${stats.low.percentage}%)` : "-"}</div>
</div>
</div>

{/* Controls: Search / Filters / Sort */}
<div className="controls">
<input className="search" placeholder="Search by name..." value={query} onChange={e => setQuery(e.target.value)} />
<select value={filterClass} onChange={e => setFilterClass(e.target.value)}>
{CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
</select>
<select value={filterSection} onChange={e => setFilterSection(e.target.value)}>
{SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
</select>
<select value={sortOption} onChange={e => setSortOption(e.target.value)}>
<option value="">Sort (None)</option>
<option value="name_asc">Name (A → Z)</option>
<option value="name_desc">Name (Z → A)</option>
<option value="roll_asc">Roll (Low → High)</option>
<option value="roll_desc">Roll (High → Low)</option>
<option value="perc_desc">Percentage (High → Low)</option>
<option value="perc_asc">Percentage (Low → High)</option>
</select>
</div>

{/* Student List - Table for wide screens, cards for mobile */}
<div className="card list-card">
<h2>Students ({filtered.length})</h2>

{/* Table */}
<div className="table-responsive">
<table className="students-table">
<thead>
<tr>
<th>Name</th>
<th>Roll</th>
<th>Class</th>
<th>Section</th>
<th>Email</th>
<th>Phone</th>
<th>Marks</th>
<th>%</th>
<th>Grade</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{filtered.map(s => (
<tr key={s.id}>
<td>{s.name}</td>
<td>{s.roll}</td>
<td>{s.class}</td>
<td>{s.section}</td>
<td>{s.email}</td>
<td>{s.phone}</td>
<td>{s.marks}/500</td>
<td>{calcPercentage(s.marks)}%</td>
<td>{calcGrade(calcPercentage(s.marks))}</td>
<td>
<button className="btn small" onClick={() => handleEdit(s)}>Edit</button>
<button className="btn small danger" onClick={() => handleDelete(s)}>Delete</button>
</td>
</tr>
))}
{filtered.length === 0 && <tr><td colSpan="10" style={{textAlign:"center"}}>No students found</td></tr>}
</tbody>
</table>
</div>

{/* Card view (for mobile) */}
<div className="cards-grid">
{filtered.map(s => (
<div className="student-card" key={s.id}>
<div className="sc-row"><strong>{s.name}</strong> <span>Roll: {s.roll}</span></div>
<div>Class: {s.class} | Section: {s.section}</div>
<div>Email: {s.email}</div>
<div>Phone: {s.phone}</div>
<div>Marks: {s.marks}/500</div>
<div>%: {calcPercentage(s.marks)} | Grade: {calcGrade(calcPercentage(s.marks))}</div>
<div className="card-actions">
<button className="btn small" onClick={() => handleEdit(s)}>Edit</button>
<button className="btn small danger" onClick={() => handleDelete(s)}>Delete</button>
</div>
</div>
))}
</div>

</div>

<footer style={{marginTop: 24, textAlign:"center", color:"#666"}}>Built with Throne 8 — Student Management System</footer>
</div>
);
}