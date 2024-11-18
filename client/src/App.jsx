// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Profile from "@/pages/profile";
import Chat from "@/pages/chat";
import Auth from "@/pages/auth";
import apiClient from "@/lib/api-client";
import { GET_USERINFO_ROUTE } from "@/lib/constants";
import { useAppStore } from "@/store";
import PrivateRoute from "./PrivateRoute";
import AuthRoute from "./AuthRoute";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    const { userInfo, setUserInfo } = useAppStore.getState();
    if (!userInfo) {
      try {
        const response = await apiClient.get(GET_USERINFO_ROUTE, {
          withCredentials: true,
        });
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        this.setState({ loading: false });
      }
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;

    if (loading) {
      return <div>Loading...</div>; // Show a loading indicator while fetching user data
    }

    return (
      <Router>
        <Routes>
          <Route
            path="/auth"
            element={
              <AuthRoute>
                <Auth />
              </AuthRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </Router>
    );
  }
}

export default App;
