import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CreatePoll } from './components/CreatePoll';
import { EditPoll } from './components/EditPoll';
import { AdminLogin } from './components/AdminLogin';
import { DeleteConfirmation } from './components/DeleteConfirmation';
import { UserWhitelistManager } from './components/UserWhiteListManager';
import { PollResultsExport } from './components/PollResultsExport';
import { UserEmailPrompt } from './components/UserEmailPrompt';
import { PollList } from './components/PollList';
import type { Poll, CreatePollData, EditPollData } from './types/poll';
import type { User, AdminCredentials } from './types/auth';
import { createPoll, updatePoll } from './utils/pollUtils';
import { getCurrentUser, setCurrentUser, logout, authenticateAdmin, getUserId, getWhitelistedUsers, isUserWhitelisted } from './utils/authUtils';

function App() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [showCreatePoll, setShowCreatePoll] = useState(false);
  const [editingPollId, setEditingPollId] = useState<string | null>(null);
  const [deletingPollId, setDeletingPollId] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const [showExportResults, setShowExportResults] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState<string | null>(null);
  const [currentUser, setCurrentUserState] = useState<User>(getCurrentUser());
  const [loginError, setLoginError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  // Load polls from localStorage on component mount
  useEffect(() => {
    const savedPolls = localStorage.getItem('polls');
    if (savedPolls) {
      try {
        const parsedPolls = JSON.parse(savedPolls).map((poll: any) => ({
          ...poll,
          createdAt: new Date(poll.createdAt),
          lastEditedAt: poll.lastEditedAt ? new Date(poll.lastEditedAt) : undefined,
          editHistory: poll.editHistory || [],
          status: poll.status || 'active' // Default to active for existing polls
        }));
        setPolls(parsedPolls);
      } catch (error) {
        console.error('Error loading polls:', error);
      }
    }
  }, []);

  // Save polls to localStorage whenever polls change
  useEffect(() => {
    localStorage.setItem('polls', JSON.stringify(polls));
  }, [polls]);

  const handleAdminLogin = (credentials: AdminCredentials) => {
    if (authenticateAdmin(credentials)) {
      const adminUser: User = {
        id: getUserId(),
        role: 'admin',
        username: credentials.username
      };
      setCurrentUser(adminUser);
      setCurrentUserState(adminUser);
      setShowAdminLogin(false);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    logout();
    const regularUser = getCurrentUser();
    setCurrentUserState(regularUser);
    setShowCreatePoll(false);
    setEditingPollId(null);
    setDeletingPollId(null);
  };

  const handleCreatePollClick = () => {
    if (currentUser.role === 'admin') {
      setShowCreatePoll(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleCreatePoll = (data: CreatePollData) => {
    if (currentUser.role !== 'admin') {
      console.error('Only admins can create polls');
      return;
    }
    
    const allowedUsers = data.isRestricted ? getWhitelistedUsers().map(user => user.email) : undefined;
    const newPoll = createPoll(data, allowedUsers);
    setPolls(prevPolls => [newPoll, ...prevPolls]);
    setShowCreatePoll(false);
  };

  const handleEditPoll = (pollId: string) => {
    setEditingPollId(pollId);
  };

  const handleUpdatePoll = (pollId: string, data: EditPollData) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return updatePoll(poll, data, currentUser.id);
        }
        return poll;
      })
    );
    setEditingPollId(null);
  };

  const handleDeletePoll = (pollId: string) => {
    setDeletingPollId(pollId);
  };

  const handleStatusChange = (pollId: string, status: 'active' | 'on-hold' | 'closed') => {
    setPolls(prevPolls => 
      prevPolls.map(poll => 
        poll.id === pollId 
          ? { ...poll, status }
          : poll
      )
    );
  };

  const confirmDeletePoll = () => {
    if (deletingPollId) {
      setPolls(prevPolls => prevPolls.filter(poll => poll.id !== deletingPollId));
      setDeletingPollId(null);
    }
  };

  const handleVote = (pollId: string, optionId: string) => {
    const poll = polls.find(p => p.id === pollId);
    if (!poll) return;

    // Don't allow voting if poll is not active
    if (poll.status !== 'active') {
      return;
    }

    // Check if poll is restricted and user needs verification
    if (poll.isRestricted && !currentUser.email) {
      setShowEmailPrompt(pollId);
      return;
    }

    const userId = currentUser.id;

    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId && !poll.votedUsers.includes(userId)) {
          const updatedOptions = poll.options.map(option => 
            option.id === optionId 
              ? { ...option, votes: option.votes + 1 }
              : option
          );
          
          return {
            ...poll,
            options: updatedOptions,
            totalVotes: poll.totalVotes + 1,
            votedUsers: [...poll.votedUsers, userId]
          };
        }
        return poll;
      })
    );
  };

  const handleEmailVerification = (email: string, name: string) => {
    if (!isUserWhitelisted(email)) {
      setEmailError('Your email is not authorized to vote in this poll. Please contact the administrator.');
      return;
    }

    // Update current user with verified email
    const updatedUser = { ...currentUser, email, name };
    setCurrentUser(updatedUser);
    setCurrentUserState(updatedUser);
    setShowEmailPrompt(null);
    setEmailError('');

    // Now proceed with the vote
    if (showEmailPrompt) {
      // The vote will be handled by the next click since user is now verified
    }
  };

  const totalVotes = polls.reduce((sum, poll) => sum + poll.totalVotes, 0);
  const editingPoll = editingPollId ? polls.find(poll => poll.id === editingPollId) : null;
  const deletingPoll = deletingPollId ? polls.find(poll => poll.id === deletingPollId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header 
        onCreatePoll={handleCreatePollClick}
        onAdminLogin={() => setShowAdminLogin(true)}
        onLogout={handleLogout}
        onManageUsers={() => setShowUserManager(true)}
        onExportResults={() => setShowExportResults(true)}
        totalPolls={polls.length}
        totalVotes={totalVotes}
        currentUser={currentUser}
      />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAdminLogin && (
          <AdminLogin
            onLogin={handleAdminLogin}
            onCancel={() => {
              setShowAdminLogin(false);
              setLoginError('');
            }}
            error={loginError}
          />
        )}

        {showUserManager && (
          <UserWhitelistManager
            onClose={() => setShowUserManager(false)}
          />
        )}

        {showExportResults && (
          <PollResultsExport
            polls={polls}
            onClose={() => setShowExportResults(false)}
          />
        )}

        {showEmailPrompt && (
          <UserEmailPrompt
            onSubmit={handleEmailVerification}
            onCancel={() => {
              setShowEmailPrompt(null);
              setEmailError('');
            }}
            error={emailError}
          />
        )}
        {deletingPoll && (
          <DeleteConfirmation
            poll={deletingPoll}
            onConfirm={confirmDeletePoll}
            onCancel={() => setDeletingPollId(null)}
          />
        )}
        
        {showCreatePoll && currentUser.role === 'admin' ? (
          <CreatePoll
            onCreatePoll={handleCreatePoll}
            onCancel={() => setShowCreatePoll(false)}
          />
        ) : editingPoll && currentUser.role === 'admin' ? (
          <EditPoll
            poll={editingPoll}
            onUpdatePoll={handleUpdatePoll}
            onCancel={() => setEditingPollId(null)}
          />
        ) : (
          <PollList
            polls={polls}
            onVote={handleVote}
            onEdit={currentUser.role === 'admin' ? handleEditPoll : undefined}
            onDelete={currentUser.role === 'admin' ? handleDeletePoll : undefined}
            onStatusChange={currentUser.role === 'admin' ? handleStatusChange : undefined}
            currentUser={currentUser}
          />
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Built with React, TypeScript, and Tailwind CSS • Admin-controlled polling system
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;