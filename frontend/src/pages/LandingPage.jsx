import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Users, Award, ArrowRight, MousePointerClick, Shield, Activity } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden flex flex-col">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                EduTest
                            </span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-200"
                                >
                                    Enter Platform
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero / How it works */}
            <div className="flex-grow pt-32 pb-20 sm:pt-40 sm:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                        How EduTest Works
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-16">
                        A simple, secure, and efficient platform for managing academic assessments.
                    </p>

                    <div className="grid md:grid-cols-3 gap-12 text-left">
                        <Step
                            icon={<Shield className="w-10 h-10 text-indigo-600" />}
                            step="01"
                            title="Administrator Control"
                            description="Admins manage users, create subjects, and upload tests via JSON. Full control over the academic ecosystem."
                        />
                        <Step
                            icon={<MousePointerClick className="w-10 h-10 text-indigo-600" />}
                            step="02"
                            title="Student Access"
                            description="Students log in to view assigned tests. The intuitive interface makes taking exams distractions-free."
                        />
                        <Step
                            icon={<Activity className="w-10 h-10 text-indigo-600" />}
                            step="03"
                            title="Real-time Results"
                            description="Get immediate feedback on answers. Track performance history and improvement over time."
                        />
                    </div>

                    <div className="mt-20">
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-xl shadow-indigo-200 transition-all duration-200"
                        >
                            Go to Login
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
                    <p className="font-medium">Designed & Built by <a href="https://github.com/lgomez15" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold">@lgomez15</a></p>
                </div>
            </footer>
        </div>
    );
};

const Step = ({ icon, step, title, description }) => (
    <div className="relative p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="absolute -top-6 left-6 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
            {icon}
        </div>
        <div className="mt-8">
            <span className="text-xs font-black text-indigo-200 tracking-widest uppercase mb-2 block">Step {step}</span>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-500 leading-relaxed">{description}</p>
        </div>
    </div>
);

export default LandingPage;
