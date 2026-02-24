import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import OnboardingPage from "./pages/OnboardingPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import FriendsPage from "./pages/FriendsPage";
import toast, { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import PageLoader from "./components/pageLoader.jsx";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx";
import useThemeStore from "./store/useThemeStore";
import NotificationToastHandler from "./components/NotificationToastHandler.jsx";
const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  console.log(isAuthenticated);
  const isOnboarded = authUser?.isOnboarded;
  console.log("onboaring", isOnboarded);

  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;
  return (
    <>
      <div data-theme={theme}>
        <NotificationToastHandler />
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "login" : "onboarding"} />
              )
            }
          />
          {/* <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "onboarding"} />} /> */}
          {/* <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} /> */}
          {/* <Route path="/signup" element={!isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded ? "/" : "onboarding"} />} /> */}
          {/* <Route path="/onboarding" element={isAuthenticated ? (!isOnboarded ? (<OnboardingPage />) : ( <Navigate to="/" />)) : (<Navigate to="/login" />)} /> */}
          <Route
            path="/onboarding"
            element={
              isAuthenticated ? (
                !isOnboarded ? (
                  <OnboardingPage />
                ) : (
                  <Navigate to="/" />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <NotificationsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "login" : "onboarding"} />
              )
            }
          />
          <Route
            path="/friends"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <FriendsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "login" : "onboarding"} />
              )
            }
          />

          <Route
            path="/call/:id"
            element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/chat/:id"
            element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
          />
        </Routes>
        <Toaster richColors />
      </div>
    </>
  );
};

export default App;
