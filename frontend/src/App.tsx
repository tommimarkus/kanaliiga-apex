import React from 'react'
import { Route, Routes } from 'react-router-dom'

import './App.scss'
import NotFoundPage from './Error/NotFoundPage'
import MatchPage from './Match/MatchPage'
import RecentMatchesPage from './RecentMatches/RecentMatchesPage'
import RecentSeasonsPage from './RecentSeasons/RecentSeasonsPage'
import RecentTournamentsPage from './RecentTournaments/RecentTournamentsPage'
import SeasonPage from './Season/SeasonPage'
import TournamentPage from './Tournament/TournamentPage'

const App: React.FC = () => (
  <Routes>
    <Route element={<NotFoundPage />} path="*" />
    <Route element={<MatchPage />} path="match/:id" />
    <Route element={<TournamentPage />} path="tournament/:id" />
    <Route element={<SeasonPage />} path="season/:id" />
    <Route element={<RecentMatchesPage />} path="match" />
    <Route element={<RecentTournamentsPage />} path="tournament" />
    <Route element={<RecentSeasonsPage />} path="season" />
    <Route element={<RecentSeasonsPage />} path="/" />
  </Routes>
)

export default App
