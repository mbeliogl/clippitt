import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Eye, Users, DollarSign, Clock, Settings, LogOut, Briefcase, Heart, MessageCircle, Calendar, TrendingUp, AlertCircle, CheckCircle, Pause, ChevronRight, BarChart3, FileText, LayoutDashboard, Bell, X, Info, ExternalLink, Scale, Plug, BookOpen } from 'lucide-react';
import { useAuth } from './AuthContext';

const LeaderBoardPage: React.FC = () => {
    const {isAuthenticated, user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className='min-h-screen bg-gray-50 flex flex-col'>
            <h1> Future Leaderboard Page </h1>
        </div>
    )
};

export default LeaderBoardPage;
