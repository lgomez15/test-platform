import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { CheckCircle, AlertCircle, PlayCircle, Clock, Trophy } from 'lucide-react';

const StudentDashboard = () => {
    const [tests, setTests] = useState([]);
    const [activeTest, setActiveTest] = useState(null);
    const [results, setResults] = useState([]);
    const [view, setView] = useState('list'); // list, config, taking, result
    const [testConfig, setTestConfig] = useState({ count: 'all' }); // all, half, quarter

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        axios.get('/student/tests').then(res => setTests(res.data));
        axios.get('/student/results').then(res => setResults(res.data));
    };

    const startTestFlow = (test) => {
        setActiveTest(test);
        setView('config');
    };

    const handleConfigConfirm = (config) => {
        setTestConfig(config);
        setView('taking');
    };

    const handleTestComplete = () => {
        setView('list');
        setActiveTest(null);
        loadData();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Student Portal</h1>
                <div className="text-sm bg-white px-3 py-1 rounded-full shadow-sm text-gray-500 border">
                    Academic Year 2025
                </div>
            </div>

            {view === 'list' && (
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Available Tests */}
                    <div className="md:col-span-2 space-y-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <PlayCircle className="mr-2 text-indigo-600" /> Available Tests
                        </h2>

                        <div className="grid gap-4">
                            {tests.length === 0 ? (
                                <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-500">
                                    No tests assigned to you yet.
                                </div>
                            ) : (
                                tests.map(test => {
                                    const completed = results.some(r => r.TestId === test.id);
                                    return (
                                        <div key={test.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm card-hover flex justify-between items-center group">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">{test.subjectName}</span>
                                                    {completed && <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center"><CheckCircle size={10} className="mr-1" /> Completed</span>}
                                                </div>
                                                <h3 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors">{test.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1 flex items-center">
                                                    <Clock size={14} className="mr-1" /> {completed ? 'Retake anytime' : '20 mins approx'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => startTestFlow(test)}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${completed
                                                    ? 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
                                            >
                                                {completed ? 'Retake Test' : 'Start Test'}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Recent Results */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                <Trophy className="mr-2 text-yellow-500 fill-current" /> History
                            </h2>
                            {results.length === 0 ? <p className="text-gray-500 text-center py-4">No results yet.</p> : (
                                <div className="space-y-4">
                                    {results.map(r => (
                                        <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-medium text-gray-800 line-clamp-1 flex-1 mr-2">{r.Test?.title}</span>
                                                <span className="text-xs text-gray-400 whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                                                <div className={`h-2.5 rounded-full ${r.score >= 80 ? 'bg-green-500' : r.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${r.score}%` }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-gray-500">Score</span>
                                                <span className={`font-bold ${r.score >= 50 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {r.score.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            {
                view === 'config' && activeTest && (
                    <TestConfig test={activeTest} onConfirm={handleConfigConfirm} onCancel={() => setView('list')} />
                )
            }

            {
                view === 'taking' && activeTest && (
                    <TestTaker test={activeTest} config={testConfig} onComplete={handleTestComplete} onCancel={() => setView('list')} />
                )
            }
        </div >
    );
};

const TestConfig = ({ test, onConfirm, onCancel }) => {
    const [count, setCount] = useState('all');

    return (
        <div className="max-w-xl mx-auto min-h-[500px] flex items-center">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Configure Test</h2>
                <p className="text-gray-500 mb-8">Customize your examination experience for <span className="font-semibold text-indigo-600">{test.title}</span>.</p>

                <div className="space-y-4 mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                    <div className="grid grid-cols-3 gap-4">
                        <button
                            onClick={() => setCount('all')}
                            className={`p-4 rounded-xl border-2 transition-all ${count === 'all' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className="block text-lg font-bold">All</span>
                            <span className="text-xs text-gray-500">100%</span>
                        </button>
                        <button
                            onClick={() => setCount('half')}
                            className={`p-4 rounded-xl border-2 transition-all ${count === 'half' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className="block text-lg font-bold">Half</span>
                            <span className="text-xs text-gray-500">50%</span>
                        </button>
                        <button
                            onClick={() => setCount('quarter')}
                            className={`p-4 rounded-xl border-2 transition-all ${count === 'quarter' ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <span className="block text-lg font-bold">Little</span>
                            <span className="text-xs text-gray-500">25%</span>
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={onCancel} className="flex-1 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => onConfirm({ count })} className="flex-1 btn-primary py-3">
                        Start Exam
                    </button>
                </div>
            </div>
        </div>
    );
};

const TestTaker = ({ test, config, onComplete, onCancel }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const qArray = useState(() => {
        let questions = test.questions || [];
        questions = Array.isArray(questions) ? questions : questions.questions || [];

        // Shuffle
        const shuffled = [...questions].sort(() => 0.5 - Math.random());

        // Slice based on config
        if (config.count === 'half') return shuffled.slice(0, Math.ceil(shuffled.length / 2));
        if (config.count === 'quarter') return shuffled.slice(0, Math.ceil(shuffled.length / 4));
        return shuffled;
    })[0];

    const handleSelect = (qIndex, option) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const handleSubmit = async () => {
        let correctCount = 0;

        qArray.forEach((q, idx) => {
            if (answers[idx] === q.respuestaCorrecta) correctCount++;
        });

        const finalScore = qArray.length > 0 ? (correctCount / qArray.length) * 100 : 0;
        setScore(finalScore);
        setSubmitted(true);

        try {
            await axios.post('/student/submit', {
                testId: test.id,
                score: finalScore,
                answers: JSON.stringify(answers)
            });
        } catch (error) {
            console.error("Failed to submit results", error);
        }
    };

    if (submitted) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-lg w-full border border-gray-100 animate-scale-in">
                    <div className="mb-6 flex justify-center">
                        <div className="bg-green-100 p-6 rounded-full">
                            <CheckCircle size={64} className="text-green-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold mb-2 text-gray-800">Test Completed!</h2>
                    <p className="text-gray-500 mb-8">You have successfully submitted your answers.</p>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                        <span className="block text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Your Score</span>
                        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                            {score.toFixed(0)}%
                        </div>
                    </div>

                    <button
                        onClick={onComplete}
                        className="w-full btn-primary py-3 text-lg"
                    >
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-primary px-8 py-6 text-white flex justify-between items-center">
                    <div>
                        <span className="text-indigo-200 text-sm font-bold uppercase tracking-wider">Examination</span>
                        <h2 className="text-2xl font-bold">{test.title}</h2>
                    </div>
                    <button onClick={onCancel} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                        Cancel
                    </button>
                </div>

                <div className="p-8 space-y-10">
                    {qArray.map((q, idx) => (
                        <div key={idx} className="space-y-4">
                            <div className="flex">
                                <span className="bg-gray-100 text-gray-600 font-bold w-8 h-8 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                    {idx + 1}
                                </span>
                                <p className="font-semibold text-xl text-gray-800 pt-0.5">{q.pregunta}</p>
                            </div>
                            <div className="grid gap-3 ml-12">
                                {q.opciones.map((opt, oIdx) => {
                                    const isAnswered = !!answers[idx];
                                    const isSelected = answers[idx] === opt;
                                    const isCorrect = opt === q.respuestaCorrecta;

                                    let containerClass = "block p-4 rounded-xl border-2 transition-all ";
                                    if (!isAnswered) {
                                        containerClass += "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50 cursor-pointer";
                                    } else {
                                        if (isCorrect) {
                                            containerClass += "bg-green-50 border-green-500 shadow-sm";
                                        } else if (isSelected) {
                                            containerClass += "bg-red-50 border-red-500 shadow-sm";
                                        } else {
                                            containerClass += "bg-gray-50 border-gray-100 opacity-60 grayscale";
                                        }
                                    }

                                    return (
                                        <label key={oIdx} className={containerClass}>
                                            <div className="flex items-center">
                                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${!isAnswered
                                                    ? (isSelected ? 'border-indigo-600' : 'border-gray-300')
                                                    : (isCorrect ? 'border-green-600 bg-green-600' : (isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300'))
                                                    }`}>
                                                    {!isAnswered && isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>}
                                                    {isAnswered && (isCorrect || isSelected) && <CheckCircle size={12} className="text-white" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name={`q-${idx}`}
                                                    value={opt}
                                                    className="hidden"
                                                    onChange={() => !isAnswered && handleSelect(idx, opt)}
                                                    checked={isSelected}
                                                    disabled={isAnswered}
                                                />
                                                <span className={`font-medium ${!isAnswered
                                                    ? (isSelected ? 'text-indigo-900' : 'text-gray-700')
                                                    : (isCorrect ? 'text-green-900' : (isSelected ? 'text-red-900' : 'text-gray-500'))
                                                    }`}>
                                                    {opt}
                                                    {isAnswered && isCorrect && <span className="ml-2 text-xs font-bold text-green-600 uppercase tracking-wider">(Correct)</span>}
                                                    {isAnswered && isSelected && !isCorrect && <span className="ml-2 text-xs font-bold text-red-600 uppercase tracking-wider">(Incorrect)</span>}
                                                </span>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length < qArray.length}
                        className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit Final Answers
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
