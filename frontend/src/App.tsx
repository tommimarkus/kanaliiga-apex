import React from 'react';

import { Router } from '@reach/router';

import './App.scss';
import MatchPage from './Match/MatchPage';
import RecentMatchesPage from './RecentMatches/RecentMatchesPage';
import TournamentListPage from './Tournament/TournamentListPage';
import TournamentPage from './Tournament/TournamentPage';

const App: React.FC = () => (
  <Router>
    <RecentMatchesPage path="/" />
    <MatchPage path="match/:id" />
    <TournamentPage path="tournament/:id" />
    <TournamentListPage path="tournament" />
  </Router>
);

export default App;
