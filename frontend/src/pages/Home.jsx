import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-12">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to College Connect
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your AI-powered educational companion for asking questions and getting intelligent answers
        </p>
        <Link
          to="/ask"
          className="bg-pink-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-pink-700 transition duration-300"
        >
          Ask Your First Question
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-pink-600">Ask Questions</h3>
          <p className="text-gray-600">
            Get instant answers to your educational questions with AI-powered insights
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-pink-600">Community</h3>
          <p className="text-gray-600">
            Join a vibrant community of learners and educators
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-3 text-pink-600">Track Progress</h3>
          <p className="text-gray-600">
            Monitor your learning journey and achievements
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
