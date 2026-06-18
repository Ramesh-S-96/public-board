import React, { useEffect, useState } from 'react';

const MOCK_API_URL = "https://6a32a7a6c6ca2aee438564fb.mockapi.io/daily_updates";
const CLOUDINARY_CLOUD_NAME = "dcptbmql7"; 
const CLOUDINARY_UPLOAD_PRESET = "dcptbmql7";

function App() {
  const [updates, setUpdates] = useState([]);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Tab Management: 'home' = Latest 5 Posts, 'archive' = All Posts Page
  const [currentPage, setCurrentPage] = useState('home');

  // Fetch Data
  const fetchUpdates = async () => {
    try {
      const res = await fetch(MOCK_API_URL);
      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();
      setUpdates(data.reverse() || []);
    } catch (error) {
      console.error("Error fetching data: ", error.message);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  // Direct Delete Function (No confirmations or passwords)
  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${MOCK_API_URL}/${postId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Delete failed");
      
      // Local state-ai instant-ah update seigirom
      setUpdates(prev => prev.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.message);
      alert("Failed to delete post.");
    }
  };

  // Upload image to Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error("Cloudinary upload failed");
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Cloudinary Error: ", err);
      return null;
    }
  };

  // Insert Data
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !title || !content) {
      alert("Please fill all required fields!");
      return;
    }

    setLoading(true);
    let finalImageUrl = "";

    if (selectedFile) {
      finalImageUrl = await uploadToCloudinary(selectedFile);
    }

    if (!finalImageUrl) {
      finalImageUrl = `https://picsum.photos/600/400?random=${Math.floor(Math.random() * 100)}`;
    }

    try {
      const res = await fetch(MOCK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          title, 
          content, 
          image: finalImageUrl, 
          created_at: new Date().toISOString() 
        })
      });

      if (!res.ok) throw new Error("Insert failed");

      setName('');
      setTitle('');
      setContent('');
      setSelectedFile(null);
      if(document.getElementById('imageUploadInput')) {
        document.getElementById('imageUploadInput').value = '';
      }
      
      fetchUpdates();
      setCurrentPage('home'); // Post panna odane dashboard feed-ukku kootu sellum
    } catch (error) {
      console.error("Error inserting data: ", error.message);
      alert("Failed to post update.");
    } finally {
      setLoading(false);
    }
  };

  // Main board logic-il 5 posts mattum slice panrom
  const displayedPosts = currentPage === 'home' ? updates.slice(0, 5) : updates;

  return (
    <div style={customStyles.pageBackground}>
      {/* HEADER BAR */}
      <header className="py-5 text-center text-white mb-4" style={customStyles.heroSection}>
        <div className="container">
          <span className="badge bg-info text-dark mb-2 px-3 py-2 rounded-pill fw-bold text-uppercase">Hub</span>
          <h1 className="display-4 fw-extrabold mb-2">Modern Insight Share</h1>
          <p className="lead opacity-75">Clean & Modern Information Sharing Dashboard</p>
          
          {/* NAVIGATION TABS */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button 
              className={`btn px-4 py-2 fw-bold rounded-pill shadow-sm transition-all ${currentPage === 'home' ? 'btn-light text-dark' : 'btn-outline-light'}`}
              onClick={() => setCurrentPage('home')}
            >
              🏠 Dashboard (Latest 5)
            </button>
            <button 
              className={`btn px-4 py-2 fw-bold rounded-pill shadow-sm transition-all ${currentPage === 'archive' ? 'btn-light text-dark' : 'btn-outline-light'}`}
              onClick={() => setCurrentPage('archive')}
            >
              📚 View All History ({updates.length})
            </button>
          </div>
        </div>
      </header>

      <div className="container pb-5">
        <div className="row g-4">
          
          {/* LEFT SIDE: WRITE FORM (Only visible in home screen view for perfect look) */}
          {currentPage === 'home' && (
            <div className="col-lg-4">
              <div className="card border-0 shadow-lg sticky-top" style={{ top: '24px', borderRadius: '16px' }}>
                <div className="card-body p-4">
                  <h3 className="h4 fw-bold mb-4 text-dark">✍️ Write an Article</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary small">Author Name *</label>
                      <input type="text" className="form-control form-control-lg border-2" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} style={customStyles.inputField} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary small">Topic / Title *</label>
                      <input type="text" className="form-control form-control-lg border-2" placeholder="Catchy headline" value={title} onChange={(e) => setTitle(e.target.value)} style={customStyles.inputField} />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold text-secondary small">Cover Image Upload</label>
                      <input id="imageUploadInput" type="file" accept="image/*" className="form-control form-control-lg border-2" onChange={(e) => setSelectedFile(e.target.files[0])} style={customStyles.inputField} />
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold text-secondary small">Content / Story *</label>
                      <textarea rows="5" className="form-control border-2" placeholder="Deep dive into your thoughts..." value={content} onChange={(e) => setContent(e.target.value)} style={customStyles.inputField} />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary w-100 btn-lg fw-bold shadow-sm" style={customStyles.submitBtn}>
                      {loading ? 'Uploading & Publishing...' : '🚀 Publish Article'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* RIGHT SIDE: FEED (Spans full width if 'View All History' page is active) */}
          <div className={currentPage === 'home' ? 'col-lg-8' : 'col-12'}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h3 fw-bold text-dark m-0">
                {currentPage === 'home' ? '🔥 Latest 5 Feeds' : '📂 Entire Article Database'}
              </h2>
              <span className="badge bg-dark rounded-pill px-3 py-2 fw-semibold">Showing {displayedPosts.length} Posts</span>
            </div>

            {displayedPosts.length === 0 ? (
              <div className="text-center p-5 bg-white rounded-4 shadow-sm border w-100">
                <h4 className="fw-semibold text-muted m-0">No articles found in this section</h4>
              </div>
            ) : (
              <div className="row g-4">
                {displayedPosts.map((item) => (
                  <div key={item.id} className={currentPage === 'home' ? 'col-md-6 d-flex' : 'col-md-4 d-flex'}>
                    <div className="card border-0 shadow-sm w-100 d-flex flex-column dynamic-card position-relative" style={customStyles.blogCard}>
                      
                      {/* DIRECT DELETE ICON - Zero Popups */}
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="btn btn-danger btn-sm position-absolute rounded-circle shadow-sm d-flex align-items-center justify-content-center" 
                        style={{ top: '12px', right: '12px', zIndex: 10, width: '34px', height: '34px', padding: '0', border: 'none' }}
                        title="Delete Post Instantly"
                      >
                        🗑️
                      </button>

                      <div className="position-relative overflow-hidden" style={{ height: '180px', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-100 h-100 object-fit-cover card-img-top card-image-hover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop'; }}
                        />
                        <span className="position-absolute bottom-0 start-0 m-3 badge bg-light text-dark shadow-sm px-3 py-2 fw-bold">
                          👤 {item.name || 'Guest'}
                        </span>
                      </div>

                      <div className="card-body p-4 d-flex flex-column flex-grow-1">
                        <h4 className="card-title h5 fw-bold text-dark text-line-clamp-2 mb-3">
                          {item.title}
                        </h4>
                        <p className="card-text text-secondary text-line-clamp-4 flex-grow-1 mb-4" style={{ fontSize: '14.5px', whiteSpace: 'pre-wrap' }}>
                          {item.content}
                        </p>
                        <hr className="text-muted opacity-25 my-3" />
                        <div className="d-flex align-items-center justify-content-between text-muted small mt-auto">
                          <span>📅 {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Just now'}</span>
                          <span>⏰ {item.created_at ? new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Quick Redirect Info Footer inside Home Dashboard */}
            {currentPage === 'home' && updates.length > 5 && (
              <div className="text-center mt-5">
                <button className="btn btn-outline-primary border-2 px-4 py-2 fw-bold" onClick={() => setCurrentPage('archive')}>
                  See All Remaining {updates.length - 5} Older Posts ➡️
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      <style>{`
        .dynamic-card { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease; }
        .dynamic-card:hover { transform: translateY(-8px); box-shadow: 0 15px 30px rgba(0, 0, 0, 0.08) !important; }
        .card-image-hover { transition: transform 0.5s ease; }
        .dynamic-card:hover .card-image-hover { transform: scale(1.06); }
        .text-line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .text-line-clamp-4 { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

const customStyles = {
  pageBackground: { backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  heroSection: { background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderBottom: '4px solid #3b82f6' },
  inputField: { borderRadius: '10px', borderColor: '#e2e8f0', fontSize: '15px', backgroundColor: '#f8fafc' },
  submitBtn: { background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', border: 'none', borderRadius: '10px', padding: '12px' },
  blogCard: { borderRadius: '16px', backgroundColor: '#ffffff', border: 'none' }
};

export default App;