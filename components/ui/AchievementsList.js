import React from 'react';
import { AchievementBadge } from './AchievementBadge';
import { ACHIEVEMENT_META } from '@/lib/stellar';

export function AchievementsList({ earnedIds = [], loading = false }) {
  // All possible achievements defined in our metadata
  const allAchievements = Object.keys(ACHIEVEMENT_META).map(id => ({
    id: Number(id),
    ...ACHIEVEMENT_META[id]
  }));

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-zinc-900/30 animate-pulse rounded-2xl border border-zinc-900" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {allAchievements.map((achievement) => (
        <AchievementBadge
          key={achievement.id}
          title={achievement.title}
          description={achievement.desc}
          icon={achievement.icon}
          earned={earnedIds.includes(achievement.id)}
        />
      ))}
    </div>
  );
}
