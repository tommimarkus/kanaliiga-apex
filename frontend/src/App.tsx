import React from 'react';

import { Router } from '@reach/router';

import './App.scss';
import NotFoundPage from './Error/NotFoundPage';
import MatchPage from './Match/MatchPage';
import RecentMatchesPage from './RecentMatches/RecentMatchesPage';
import RecentSeasonsPage from './RecentSeasons/RecentSeasonsPage';
import RecentTournamentsPage from './RecentTournaments/RecentTournamentsPage';
import TournamentPage from './Tournament/TournamentPage';

const App: React.FC = () => (
  <Router>
    <NotFoundPage default />
    <MatchPage path="match/:id" />
    <TournamentPage path="tournament/:id" />
    {/* <SeasonPage path="season/:id" /> */}
    <RecentMatchesPage path="match" />
    <RecentTournamentsPage path="tournament" />
    <RecentSeasonsPage path="season" />
    <RecentSeasonsPage path="/" />
  </Router>
);

export default App;
