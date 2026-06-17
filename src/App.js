import React, { useEffect, useState } from 'react';



// 1. MockAPI Endpoint Connect (Supabase Thevaiyillai)

// TODO: Ungaloda actual MockAPI URL-ai keezhe paste pannunga

const MOCK_API_URL = "https://6a32a7a6c6ca2aee438564fb.mockapi.io/daily_updates";



function App() {

const [updates, setUpdates] = useState([]);

const [name, setName] = useState('');

const [title, setTitle] = useState('');

const [content, setContent] = useState('');

const [loading, setLoading] = useState(false);



// 2. Fetch Data (Get all updates from MockAPI)

const fetchUpdates = async () => {

try {

const res = await fetch(MOCK_API_URL);

if (!res.ok) throw new Error("Fetch failed");

const data = await res.json();


// Live updates fresh-ah top-la varrathukaaga reverse panrom

setUpdates(data.reverse() || []);

} catch (error) {

console.error("Error fetching data: ", error.message);

}

};



useEffect(() => {

fetchUpdates();

}, []);



// 3. Insert Data (Post new update to MockAPI)

const handleSubmit = async (e) => {

e.preventDefault();

if (!name || !title || !content) {

alert("Please fill all fields (Name, Title, and Content)!");

return;

}



setLoading(true);

try {

const res = await fetch(MOCK_API_URL, {

method: 'POST',

headers: { 'Content-Type': 'application/json' },

body: JSON.stringify({ name, title, content, created_at: new Date().toISOString() })

});



if (!res.ok) throw new Error("Insert failed");



// Form fields clear panrom

setName('');

setTitle('');

setContent('');


// List-ai refresh panrom

fetchUpdates();

alert("🎉 Your Update Posted Successfully!");

} catch (error) {

console.error("Error inserting data: ", error.message);

alert("Failed to post update.");

} finally {

setLoading(false);

}

};



return (

<div style={styles.container}>

<header style={styles.header}>

<h1>👥 Public Updates & Share Board (MockAPI)</h1>

<p>Anyone with this link can share their daily updates instantly!</p>

</header>



<div style={styles.mainLayout}>

{/* LEFT SIDE: FORM */}

<div style={styles.card}>

<h2 style={styles.sectionTitle}>✍️ Share Your Update</h2>

<form onSubmit={handleSubmit} style={styles.form}>

<div style={styles.formGroup}>

<label style={styles.label}>Your Name</label>

<input

type="text"

placeholder="Enter your name"

value={name}

onChange={(e) => setName(e.target.value)}

style={styles.input}

/>

</div>



<div style={styles.formGroup}>

<label style={styles.label}>Topic / Title</label>

<input

type="text"

placeholder="e.g., Bug Fix / New Feature"

value={title}

onChange={(e) => setTitle(e.target.value)}

style={styles.input}

/>

</div>


<div style={styles.formGroup}>

<label style={styles.label}>Content / Details</label>

<textarea

rows="5"

placeholder="Write your daily work or status updates here..."

value={content}

onChange={(e) => setContent(e.target.value)}

style={styles.textarea}

/>

</div>



<button type="submit" disabled={loading} style={styles.button}>

{loading ? 'Publishing...' : '🚀 Post to Public Board'}

</button>

</form>

</div>



{/* RIGHT SIDE: FEED */}

<div style={styles.card}>

<h2 style={styles.sectionTitle}>🕒 Live Timeline ({updates.length})</h2>

<div style={styles.feedContainer}>

{updates.length === 0 ? (

<p style={styles.noData}>No posts yet. Be the first to share an update!</p>

) : (

updates.map((item) => (

<div key={item.id} style={styles.updateCard}>

<div style={styles.authorBadge}>👤 Posted by: <strong>{item.name || 'Anonymous'}</strong></div>

<h3 style={styles.updateTitle}>{item.title}</h3>

<p style={styles.updateContent}>{item.content}</p>

<div style={styles.updateMeta}>

📅 {new Date(item.created_at).toLocaleDateString()} | ⏰ {new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}

</div>

</div>

))

)}

</div>

</div>

</div>

</div>

);

}



// Styles configuration remains the same

const styles = {

container: { maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' },

header: { textAlign: 'center', marginBottom: '40px', color: '#0f172a' },

mainLayout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' },

card: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },

sectionTitle: { marginTop: 0, marginBottom: '20px', color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },

form: { display: 'flex', flexDirection: 'column', gap: '15px' },

formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },

label: { fontWeight: '600', color: '#475569', fontSize: '14px' },

input: { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px', width: '100%', boxSizing: 'border-box' },

textarea: { padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px', resize: 'vertical', width: '100%', boxSizing: 'border-box' },

button: { backgroundColor: '#0284c7', color: 'white', padding: '12px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },

feedContainer: { maxHeight: '70vh', overflowY: 'auto' },

noData: { color: '#64748b', textAlign: 'center', fontStyle: 'italic' },

updateCard: { backgroundColor: '#f8fafc', borderLeft: '5px solid #0284c7', padding: '15px', borderRadius: '6px', marginBottom: '15px' },

authorBadge: { fontSize: '13px', color: '#0369a1', backgroundColor: '#e0f2fe', display: 'inline-block', padding: '3px 8px', borderRadius: '4px', marginBottom: '8px' },

updateTitle: { margin: '0 0 6px 0', color: '#1e293b' },

updateContent: { margin: '0 0 10px 0', color: '#334155', lineHeight: '1.5', whiteSpace: 'pre-wrap' },

updateMeta: { fontSize: '12px', color: '#94a3b8', fontWeight: '500' }

};



export default App;