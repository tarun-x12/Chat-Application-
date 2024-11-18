import React, { Component } from "react";
import Background from "../../assets/login2.png";
import Victory from "../../assets/victory.svg";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import apiClient from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/lib/constants";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      tab: "login", // For managing active tab (login/signup)
    };

    this.navigate = useNavigate();
    this.store = useAppStore();
  }

  validateLogin = () => {
    const { email, password } = this.state;
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  validateSignup = () => {
    const { email, password, confirmPassword } = this.state;
    if (!email.length) {
      toast.error("Email is required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password should be same.");
      return false;
    }
    return true;
  };

  handleLogin = async () => {
    try {
      if (this.validateLogin()) {
        const { email, password } = this.state;
        const response = await apiClient.post(
          LOGIN_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.data.user.id) {
          this.store.setUserInfo(response.data.user);
          if (response.data.user.profileSetup) this.navigate("/chat");
          else this.navigate("/profile");
        } else {
          console.log("error");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleSignup = async () => {
    try {
      if (this.validateSignup()) {
        const { email, password } = this.state;
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true }
        );
        if (response.status === 201) {
          this.store.setUserInfo(response.data.user);
          this.navigate("/profile");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password, confirmPassword, tab } = this.state;

    return (
      <div className="h-[100vh] w-[100vw] flex items-center justify-center">
        <div className="h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
          <div className="flex flex-col gap-10 items-center justify-center">
            <div className="flex items-center justify-center flex-col">
              <div className="flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold">Welcome</h1>
                <img src={Victory} className="h-[100px]" alt="Victory Icon" />
              </div>
              <p className="font-medium text-center">
                Fill in the details to get started with the best chat app!
              </p>
            </div>
            <div className="flex items-center justify-center w-full">
              <Tabs
                value={tab}
                onValueChange={(value) => this.setState({ tab: value })}
                className="w-3/4"
              >
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                    value="login"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                    value="signup"
                  >
                    Signup
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="flex flex-col gap-5 mt-10">
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                  <Button
                    className="rounded-full p-6"
                    onClick={this.handleLogin}
                  >
                    Login
                  </Button>
                </TabsContent>
                <TabsContent value="signup" className="flex flex-col gap-5">
                  <Input
                    placeholder="Email"
                    type="email"
                    name="email"
                    className="rounded-full p-6"
                    value={email}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    name="password"
                    className="rounded-full p-6"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                  <Input
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    className="rounded-full p-6"
                    value={confirmPassword}
                    onChange={this.handleInputChange}
                  />
                  <Button
                    className="rounded-full p-6"
                    onClick={this.handleSignup}
                  >
                    Signup
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="hidden xl:flex justify-center items-center">
            <img src={Background} className="h-[700px]" alt="Background" />
          </div>
        </div>
      </div>
    );
  }
}

export default Auth;
