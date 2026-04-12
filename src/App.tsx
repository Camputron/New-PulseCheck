import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Page } from "./pages"
import AppBar from "./components/appbar/AppBar"

/** Routes where the global AppBar is hidden (these pages render their own header) */
const isSessionRoute = (pathname: string) =>
  /^\/poll\/session\/[^/]+(\/host|\/participate)?$/.test(pathname)

export default function App() {
  const { pathname } = useLocation()

  return (
    <React.Fragment>
      {!isSessionRoute(pathname) && <AppBar />}
      <Routes>
        <Route path='/' element={<Page.Splash />} />
        <Route path='/debug' element={<Page.Debug />} />
        <Route path='/login' element={<Page.Login />} />
        <Route path='/register' element={<Page.Register />} />
        <Route path='/get-started' element={<Page.GetStarted />} />
        <Route path='/privacy-policy' element={<Page.PrivacyPolicy />} />
        <Route path='/terms-of-service' element={<Page.TermsOfService />} />
        <Route path='/contributors' element={<Page.Contributors />} />
        <Route path='/dashboard' element={<Page.Dashboard />} />
        {/* poll session routes */}
        <Route path='/poll/join' element={<Page.PollJoin />} />
        <Route path='/poll/session/:id/host' element={<Page.PollHost />} />
        <Route path='/poll/session/:id' element={<Page.PollSession />} />
        <Route
          path='/poll/session/:id/participate'
          element={<Page.PollParticipate />}
        />
        {/* poll routes */}
        <Route path='/poll/:id/edit' element={<Page.PollEditor />} />
        <Route
          path='/poll/submission/:id/results'
          element={<Page.SubmissionResults />}
        />
        <Route
          path='/poll/session/:id/results'
          element={<Page.SessionResults />}
        />
        <Route path='/poll/history/' element={<Page.PollHistory />} />
        {/* <Route path='/poll/:id/overview' element={<Page.PollView />} /> */}
        <Route path='/settings' element={<Page.Settings />} />
        <Route path='*' element={<Page.NotFound />} />
      </Routes>
    </React.Fragment>
  )
}
