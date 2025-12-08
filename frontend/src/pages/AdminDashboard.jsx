import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { UserPlus, Upload, FileText, ClipboardList, Plus, Trash2, Check, ExternalLink } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('users');

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
                <div className="text-sm bg-white px-3 py-1 rounded-full shadow-sm text-gray-500 border">
                    {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white/50 backdrop-blur-sm p-1.5 rounded-xl flex space-x-1 border border-gray-200/50 shadow-sm overflow-x-auto">
                <TabButton name="users" label="User Management" icon={<UserPlus size={18} />} active={activeTab === 'users'} onClick={setActiveTab} />
                <TabButton name="subjects" label="Subjects" icon={<ClipboardList size={18} />} active={activeTab === 'subjects'} onClick={setActiveTab} />
                <TabButton name="tests" label="Upload Tests" icon={<Upload size={18} />} active={activeTab === 'tests'} onClick={setActiveTab} />
                <TabButton name="results" label="Results" icon={<FileText size={18} />} active={activeTab === 'results'} onClick={setActiveTab} />
            </div>

            {/* Content */}
            <div className="glass-panel rounded-2xl p-8 min-h-[500px]">
                {activeTab === 'users' && <UserManagement />}
                {activeTab === 'subjects' && <SubjectManagement />}
                {activeTab === 'tests' && <TestUpload />}
                {activeTab === 'results' && <ResultsView />}
            </div>
        </div>
    );
};

const TabButton = ({ name, label, icon, active, onClick }) => (
    <button
        onClick={() => onClick(name)}
        className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap ${active
                ? 'bg-white text-indigo-600 shadow-md ring-1 ring-gray-100'
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'student' });
    const [message, setMessage] = useState('');

    useEffect(() => { loadUsers(); }, []);

    const loadUsers = async () => {
        try { const res = await axios.get('/admin/users'); setUsers(res.data); }
        catch (err) { console.error(err); }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/users', newUser);
            setMessage('User created!');
            setTimeout(() => setMessage(''), 3000);
            setNewUser({ username: '', password: '', role: 'student' });
            loadUsers();
        } catch (err) { setMessage('Error creating user'); }
    };

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center">
                        <UserPlus size={20} className="mr-2" /> Create User
                    </h3>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <input type="text" placeholder="Username" className="input-field" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} required />
                        <input type="password" placeholder="Password" className="input-field" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                        <div className="relative">
                            <select className="input-field appearance-none" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="student">Student Account</option>
                                <option value="admin">Administrator</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                        <button type="submit" className="w-full btn-primary flex justify-center items-center">
                            <Plus size={18} className="mr-2" /> Create User
                        </button>
                    </form>
                    {message && <div className="bg-green-100 text-green-700 text-sm p-3 rounded-lg mt-4 flex items-center"><Check size={16} className="mr-2" /> {message}</div>}
                </div>
            </div>

            <div className="lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Existing Users ({users.length})</h3>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {users.map((u, i) => (
                                    <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.username}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="flex items-center text-green-600"><div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> Active</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [users, setUsers] = useState([]);
    const [newSubject, setNewSubject] = useState('');
    const [assignData, setAssignData] = useState({ userId: '', subjectId: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => { loadSubjects(); loadUsers(); }, []);

    const loadSubjects = async () => { try { const res = await axios.get('/admin/subjects'); setSubjects(res.data); } catch (err) { } };
    const loadUsers = async () => { try { const res = await axios.get('/admin/users'); setUsers(res.data); } catch (err) { } };

    const handleCreate = async (e) => {
        e.preventDefault();
        try { await axios.post('/admin/subjects', { name: newSubject }); setNewSubject(''); loadSubjects(); } catch (err) { console.error(err); }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/admin/assign-subject', assignData);
            setMsg('Subject assigned successfully');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { setMsg('Error assigning'); }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-10">
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Subject</h3>
                    <form onSubmit={handleCreate} className="flex gap-3">
                        <input type="text" placeholder="Subject Name (e.g. Math 101)" className="input-field flex-grow" value={newSubject} onChange={e => setNewSubject(e.target.value)} required />
                        <button className="btn-primary whitespace-nowrap">
                            <Plus size={18} />
                        </button>
                    </form>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">All Subjects</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {subjects.map(s => (
                            <div key={s.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors">
                                <span className="font-medium text-gray-700">{s.name}</span>
                                <ExternalLink size={16} className="text-gray-300 group-hover:text-indigo-400 transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 h-full">
                    <h3 className="text-lg font-bold text-indigo-900 mb-4">Assign Subject to Student</h3>
                    <p className="text-gray-600 text-sm mb-6">Select a student and a subject to verify access.</p>
                    <form onSubmit={handleAssign} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Student</label>
                            <select className="input-field" value={assignData.userId} onChange={e => setAssignData({ ...assignData, userId: e.target.value })} required>
                                <option value="">Select Student...</option>
                                {users.filter(u => u.role === 'student').map(u => <option key={u.id} value={u.id}>{u.username}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Subject</label>
                            <select className="input-field" value={assignData.subjectId} onChange={e => setAssignData({ ...assignData, subjectId: e.target.value })} required>
                                <option value="">Select Subject...</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <button className="w-full btn-primary bg-indigo-700 hover:bg-indigo-800 mt-4">
                            Assign Access
                        </button>
                    </form>
                    {msg && <div className="bg-green-100 text-green-700 text-sm p-3 rounded-lg mt-4 flex items-center"><Check size={16} className="mr-2" /> {msg}</div>}
                </div>
            </div>
        </div>
    );
};

const TestUpload = () => {
    const [subjects, setSubjects] = useState([]);
    const [jsonInput, setJsonInput] = useState('');
    const [title, setTitle] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [msg, setMsg] = useState('');

    useEffect(() => {
        axios.get('/admin/subjects').then(res => setSubjects(res.data));
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        try {
            const questions = JSON.parse(jsonInput);
            await axios.post('/admin/tests', {
                title,
                subjectId,
                questions: questions.questions || questions
            });
            setMsg('Test uploaded successfully');
            setTimeout(() => setMsg(''), 3000);
            setJsonInput(''); setTitle(''); setSubjectId('');
        } catch (err) {
            setMsg('Error: Invalid JSON or Server Error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Upload New Test</h3>
                <button className="text-indigo-600 text-sm hover:underline">Download Template</button>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Test Title</label>
                        <input type="text" placeholder="e.g. Midterm Exam" className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <select className="input-field" value={subjectId} onChange={e => setSubjectId(e.target.value)} required>
                            <option value="">Select Subject...</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Questions JSON</label>
                    <div className="relative">
                        <textarea
                            className="w-full border border-gray-200 rounded-lg h-64 p-4 font-mono text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                            placeholder={'{\n  "questions": [\n    {\n      "pregunta": "What is...?",\n      "opciones": ["A", "B"],\n      "respuestaCorrecta": "A"\n    }\n  ]\n}'}
                            value={jsonInput}
                            onChange={e => setJsonInput(e.target.value)}
                            required
                        />
                        <div className="absolute top-4 right-4 text-xs text-gray-400 bg-white border px-2 py-1 rounded">JSON Format</div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="btn-primary px-8">
                        Upload Test
                    </button>
                </div>

            </form>
            {msg && <div className={`mt-4 p-4 rounded-lg ${msg.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{msg}</div>}
        </div>
    );
};

const ResultsView = () => {
    const [results, setResults] = useState([]);
    useEffect(() => { axios.get('/admin/results').then(res => setResults(res.data)) }, []);

    return (
        <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">Student Performance</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Test</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {results.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{r.User?.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600">{r.Test?.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${r.score >= 80 ? 'bg-green-100 text-green-700' : r.score >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                        {r.score.toFixed(1)}%
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {results.length === 0 && <div className="p-8 text-center text-gray-500">No results found yet.</div>}
            </div>
        </div>
    );
};

export default AdminDashboard;
