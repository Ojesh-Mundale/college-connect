import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';

// Function to generate avatar URL using DiceBear
const generateAvatarUrl = (seed, size = 80) => {
  const avatar = createAvatar(adventurer, {
    seed: seed,
    size: size,
  });
  return avatar.toDataUri();
};

const Avatar = ({ user, size = 80, className = '', showRefresh = false, onRefresh }) => {
  const baseSeed = user?.customAvatarSeed || user?.username || user?.email || user?.name || 'default';
  const [currentSeed, setCurrentSeed] = useState(baseSeed);

  useEffect(() => {
    setCurrentSeed(baseSeed);
  }, [baseSeed]);

  const avatarUrl = generateAvatarUrl(currentSeed, size);

  const handleRefresh = () => {
    const newSeed = `${baseSeed}-${Date.now()}-${Math.random()}`;
    setCurrentSeed(newSeed);
    if (onRefresh) {
      onRefresh(newSeed);
    }
  };

  return (
    <div className="relative inline-block">
      <img
        src={avatarUrl}
        alt={`${user?.name || user?.username || 'User'}'s avatar`}
        className={`rounded-full ${className}`}
        style={{ width: size, height: size }}
      />
      {showRefresh && (
        <button
          onClick={handleRefresh}
          className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors"
          title="Change avatar"
        >
          ↻
        </button>
      )}
    </div>
  );
};

export default Avatar;
