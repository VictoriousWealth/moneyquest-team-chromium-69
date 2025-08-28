import React from 'react';
import Card from '../../../components/ui/Card';
import UIBadge from '../../../components/ui/Badge';

const StudentDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="h1 mb-2">Welcome back, Alex! 🎮</h1>
          <p className="text-subtext">Ready to continue your financial adventure?</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Profile Card */}
          <Card className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="h3 mb-1">Alex Johnson</h3>
                <p className="text-subtext">Level 12 Explorer</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-subtext">Experience</span>
                <span className="font-medium">2,450 XP</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-subtext">2,450 / 3,000 XP</span>
                <span className="text-primary">+550 to next level</span>
              </div>
            </div>
          </Card>

          {/* Progress Summary */}
          <Card className="p-6">
            <h3 className="h3 mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Episodes Completed</span>
                <UIBadge variant="mint">8/12</UIBadge>
              </div>
              <div className="flex justify-between items-center">
                <span>Coins Earned</span>
                <span className="font-medium text-blue-500">1,250 💰</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Achievements</span>
                <UIBadge variant="blue">5 Unlocked</UIBadge>
              </div>
              <div className="flex justify-between items-center">
                <span>Current Streak</span>
                <span className="font-medium text-mint-400">7 days 🔥</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="h3 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
                Continue Playing 🎮
              </button>
              <button className="w-full p-3 bg-muted text-text rounded-lg hover:bg-opacity-80 transition-all">
                View Journal 📖
              </button>
              <button className="w-full p-3 bg-muted text-text rounded-lg hover:bg-opacity-80 transition-all">
                Ask Mentor 💬
              </button>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="h3 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Episode 8: Smart Shopping</p>
                  <p className="text-sm text-subtext">Completed 2 hours ago</p>
                </div>
                <UIBadge variant="mint">Pass</UIBadge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Achievement Unlocked: Budget Master</p>
                  <p className="text-sm text-subtext">Yesterday</p>
                </div>
                <span className="text-2xl">🏆</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">Episode 7: Investment Basics</p>
                  <p className="text-sm text-subtext">2 days ago</p>
                </div>
                <UIBadge variant="mint">Pass</UIBadge>
              </div>
            </div>
          </Card>

          {/* Weekly Challenge */}
          <Card className="p-6">
            <h3 className="h3 mb-4">Weekly Challenge</h3>
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="font-medium mb-2">Track Your Spending</p>
              <p className="text-sm text-subtext mb-4">Log 5 purchases this week</p>
              <div className="w-full bg-muted rounded-full h-2 mb-2">
                <div className="bg-primary h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              <p className="text-sm text-subtext">3/5 completed</p>
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;