import { Router, Route } from "wouter";
import Navigation from "./Nav.jsx";
import Apps from "./pages/apps.jsx";
import Marketplace from "./pages/marketplace.jsx";
import WebsitesDetails from "./pages/websitesDetails.jsx";
import Login from "./login.jsx";
import Signup from "./signup.jsx";
import Cookies from "js-cookie"
import CreateApp from "./pages/createApp.jsx";

export default function App() {
  if (!Cookies.get('token')){
    if(window.location.href.includes("signup")){
      return <Signup/>
    }
    return <Login />
  }

  return (
    <Router>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Navigation />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Route path="/websites">
          <Apps
            title="Apps"
          />
        </Route>
        <Route path="/marketplace">
          <Marketplace
            title="Marketplace"
          />
        </Route>
        <Route path="/create-app">
          <CreateApp
            title="Create App"
          />
        </Route>
        <Route path="/create-app/:id">
          <CreateApp
            title="Create App"
          />
        </Route>
        <Route path="/websites/:id">
          <WebsitesDetails
            title="Files"
          />
        </Route>
      </main>
    </Router>
  );
}