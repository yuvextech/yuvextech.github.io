import React, { useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { TeamMember } from '../types';

export const AdminTeamHub: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useCMS();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const handleOpenNew = () => {
    setEditingMember({
      id: `team_${Date.now()}`,
      name: '',
      role: '',
      bio: '',
      image: `https://i.pravatar.cc/300?u=team_${Date.now()}`,
      skills: ['TypeScript', 'Cloud Architecture'],
      socialLinks: {
        twitter: '',
        linkedin: '',
        github: ''
      },
      displayOrder: teamMembers.length + 1,
      isPublished: true
    });
    setIsNew(true);
    setSkillInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    if (isNew) {
      await addTeamMember(editingMember);
    } else {
      await updateTeamMember(editingMember.id, editingMember);
    }
    setEditingMember(null);
    setIsNew(false);
  };

  const handleAddSkill = () => {
    if (!skillInput.trim() || !editingMember) return;
    const current = editingMember.skills || [];
    if (!current.includes(skillInput.trim())) {
      setEditingMember({ ...editingMember, skills: [...current, skillInput.trim()] });
    }
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    if (!editingMember) return;
    setEditingMember({
      ...editingMember,
      skills: (editingMember.skills || []).filter(s => s !== skill)
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gray-900 border border-gray-800 shadow-sm">
        <div>
          <span className="text-xs uppercase font-mono font-bold text-blue-400">
            Database Entity: team_members
          </span>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Engineering &amp; Leadership Team</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-mono font-bold">
              {teamMembers.length} Members
            </span>
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Stored in cloud database and displayed dynamically on the About Us page.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 active:scale-95 cursor-pointer shrink-0"
        >
          <span>➕</span>
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Editing Form Modal */}
      {editingMember && (
        <div className="p-8 rounded-3xl bg-gray-900 border border-gray-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <h4 className="text-lg font-bold text-white">
              {isNew ? 'Create New Team Member Profile' : `Edit: ${editingMember.name}`}
            </h4>
            <button
              onClick={() => { setEditingMember(null); setIsNew(false); }}
              className="text-gray-400 hover:text-white text-xs px-2 py-1"
            >
              ✕ Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="e.g. Julian Vance"
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Engineering Role / Title *</label>
                <input
                  type="text"
                  required
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="e.g. Founder & Head of Engineering"
                  className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Headshot Image URL *</label>
              <input
                type="url"
                required
                value={editingMember.image}
                onChange={(e) => setEditingMember({ ...editingMember, image: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Biography *</label>
              <textarea
                required
                rows={3}
                value={editingMember.bio}
                onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                placeholder="Ex-FAANG architect with a passion for high-performance distributed systems..."
                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Skills Tags */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">Technical Skills &amp; Focus</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                  placeholder="Add skill (e.g. Kubernetes, React 19)"
                  className="flex-1 px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(editingMember.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-300 border border-blue-500/20"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  value={editingMember.socialLinks?.linkedin || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    socialLinks: { ...editingMember.socialLinks, linkedin: e.target.value }
                  })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">GitHub URL</label>
                <input
                  type="url"
                  value={editingMember.socialLinks?.github || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    socialLinks: { ...editingMember.socialLinks, github: e.target.value }
                  })}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-gray-400 mb-1">Twitter / X URL</label>
                <input
                  type="url"
                  value={editingMember.socialLinks?.twitter || ''}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    socialLinks: { ...editingMember.socialLinks, twitter: e.target.value }
                  })}
                  placeholder="https://twitter.com/..."
                  className="w-full px-3 py-1.5 bg-gray-950 border border-gray-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingMember.isPublished !== false}
                  onChange={(e) => setEditingMember({ ...editingMember, isPublished: e.target.checked })}
                  className="rounded border-gray-700 bg-gray-950 text-blue-600 focus:ring-0"
                />
                <span>Published on Website</span>
              </label>

              <div className="flex items-center gap-2 text-xs text-gray-300">
                <span>Display Order:</span>
                <input
                  type="number"
                  min={1}
                  value={editingMember.displayOrder || 1}
                  onChange={(e) => setEditingMember({ ...editingMember, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-16 px-2 py-1 bg-gray-950 border border-gray-800 rounded-lg text-white font-mono text-xs text-center"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => { setEditingMember(null); setIsNew(false); }}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-bold text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30"
              >
                Save to Cloud Database
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="p-5 rounded-3xl bg-gray-900 border border-gray-800 shadow-sm flex flex-col justify-between group hover:border-gray-700 transition-all"
          >
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-950">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!member.isPublished && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/80 text-black text-[10px] font-bold">
                    Draft / Hidden
                  </span>
                )}
              </div>

              <div className="mb-2">
                <h4 className="text-base font-bold text-white leading-tight">
                  {member.name}
                </h4>
                <p className="text-xs text-blue-400 font-mono font-bold mt-0.5">
                  {member.role}
                </p>
              </div>

              <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-3">
                {member.bio}
              </p>

              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                  {member.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-300 border border-white/5">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-800/80">
              <span className="text-[10px] font-mono text-gray-500">
                Rank #{member.displayOrder || 1}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setEditingMember(member); setIsNew(false); }}
                  className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-950/60 transition-colors text-xs"
                  title="Edit member"
                >
                  ✏️
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Remove ${member.name} from team database?`)) {
                      deleteTeamMember(member.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/60 transition-colors text-xs"
                  title="Delete member"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTeamHub;
