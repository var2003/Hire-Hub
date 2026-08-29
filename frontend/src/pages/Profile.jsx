import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Toast from '../components/Toast';
import { User, Mail, MapPin, Save, FileText, Plus, Trash2, Building, Globe, CheckCircle2 } from 'lucide-react';

const Profile = () => {
  const { user, updateUserProfile, isApplicant, isRecruiter } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: user?.skills ? user.skills.join(', ') : '',
    resumeUrl: user?.resumeUrl || '',
    companyName: user?.companyName || '',
    companyWebsite: user?.companyWebsite || '',
    experience: user?.experience || [],
    education: user?.education || []
  });

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        headline: user.headline || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills ? user.skills.join(', ') : '',
        resumeUrl: user.resumeUrl || '',
        companyName: user.companyName || '',
        companyWebsite: user.companyWebsite || '',
        experience: user.experience || [],
        education: user.education || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', duration: '', description: '' }]
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, experience: updated }));
  };

  const handleRemoveExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updated = [...formData.education];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, education: updated }));
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await updateUserProfile(formData);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div className="glass-card fade-in" style={{ padding: '2.5rem' }}>
        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
              User <span className="gradient-text">Profile & Portfolio</span>
            </h1>
            <p style={{ color: 'var(--text-muted)' }}>Keep your professional credentials and experience up to date.</p>
          </div>
          <span className={`badge ${isRecruiter ? 'badge-amber' : 'badge-emerald'}`} style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
            {user?.role?.toUpperCase()}
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* General Information */}
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            General Information
          </h3>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label><User size={14} style={{ display: 'inline', marginRight: '4px' }} /> Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label><Mail size={14} style={{ display: 'inline', marginRight: '4px' }} /> Email Address (read-only)</label>
              <input
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label>Professional Headline</label>
              <input
                type="text"
                name="headline"
                className="form-input"
                placeholder="e.g. Senior Frontend Developer"
                value={formData.headline}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} /> Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Austin, TX"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio / Overview</label>
            <textarea
              name="bio"
              className="form-textarea"
              rows="3"
              placeholder="Brief summary of your professional background, passions, and expertise..."
              value={formData.bio}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Applicant Specific Sections */}
          {isApplicant && (
            <>
              <div className="form-group">
                <label>Skills & Technologies (comma separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="form-input"
                  placeholder="e.g. React, Node.js, Express, MongoDB, Tailwind CSS, JavaScript"
                  value={formData.skills}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label><FileText size={14} style={{ display: 'inline', marginRight: '4px' }} /> Resume Link / Portfolio URL</label>
                <input
                  type="url"
                  name="resumeUrl"
                  className="form-input"
                  placeholder="e.g. https://drive.google.com/your-resume or https://github.com/resume.pdf"
                  value={formData.resumeUrl}
                  onChange={handleChange}
                />
              </div>

              {/* Work Experience Repeater */}
              <div style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Work Experience</h3>
                  <button type="button" onClick={handleAddExperience} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add Position
                  </button>
                </div>

                {formData.experience.map((exp, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => handleRemoveExperience(idx)} className="btn btn-danger btn-sm" title="Remove">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Job Title"
                        value={exp.title}
                        onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                      />
                    </div>
                    <input
                      type="text"
                      className="form-input"
                      style={{ marginTop: '0.75rem' }}
                      placeholder="Duration (e.g. 2022 - Present)"
                      value={exp.duration}
                      onChange={(e) => handleExperienceChange(idx, 'duration', e.target.value)}
                    />
                  </div>
                ))}
              </div>

              {/* Education Repeater */}
              <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Education</h3>
                  <button type="button" onClick={handleAddEducation} className="btn btn-secondary btn-sm">
                    <Plus size={14} /> Add Degree
                  </button>
                </div>

                {formData.education.map((edu, idx) => (
                  <div key={idx} style={{ background: 'rgba(0,0,0,0.25)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => handleRemoveEducation(idx)} className="btn btn-danger btn-sm" title="Remove">
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <div className="grid-2" style={{ gap: '0.75rem' }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Degree / Certificate"
                        value={edu.degree}
                        onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                      />
                      <input
                        type="text"
                        className="form-input"
                        placeholder="University / School"
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(idx, 'institution', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recruiter Specific Section */}
          {isRecruiter && (
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label><Building size={14} style={{ display: 'inline', marginRight: '4px' }} /> Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  className="form-input"
                  value={formData.companyName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label><Globe size={14} style={{ display: 'inline', marginRight: '4px' }} /> Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  className="form-input"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              <Save size={18} />
              <span>{submitting ? 'Saving Profile...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Profile;
