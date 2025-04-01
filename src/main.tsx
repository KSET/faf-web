import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Route, Switch, useLocation } from "wouter";
import App from "./pages/App.tsx";
import Posts from "./pages/Posts.tsx";
import Galleries from "./pages/Galleries.tsx";
import Post from "./pages/Post.tsx";
import Gallery from "./pages/Gallery.tsx";
import { Helmet } from "react-helmet";
import Timeslot from "./pages/Timeslot.tsx";

const ScrollToTop = () => {
  const [pathname] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Helmet>
      <title>Festival amaterskog filma</title>
      <meta
        name="description"
        content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
      />

      <meta property="og:type" content="website" />
      <meta property="og:title" content="Festival amaterskog filma - FAF" />
      <meta
        property="og:description"
        content="FAF ilitiga Festival Amaterskog Filma, festival je u organizaciji studenata volontera koji svoju ljubav prema filmu žele dijeliti s drugim filmskim entuzijastima."
      />
      <meta
        property="og:image"
        content="https://scontent-sof1-1.xx.fbcdn.net/v/t39.30808-6/441950774_122098346168329220_6558152393466858500_n.png?_nc_cat=104&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeFGhjifbL_mNz8YPMlRtsXEH5nDs9ZZQsYfmcOz1llCxj71QLD_gsj40diKsblhKdJ6GlZfzT-kdbdL_-DqN_1s&_nc_ohc=5Zzn-qWlDucQ7kNvgFEm3cX&_nc_ht=scontent-sof1-1.xx&oh=00_AYAd7wb72AoYe8FsUvxVacRFaEv8yCl9TMbxWqZM6Z6ypg&oe=6663E62C"
      />
    </Helmet>
    <ScrollToTop />
    <Switch>
      <Route path="/" component={App} />

      <Route path="/posts" component={Posts} />

      <Route path="/post/:slug" component={Post} />

      <Route path="/timeslot/:slug" component={Timeslot} />

      <Route path="/galerije" component={Galleries} />

      <Route path="/galerija/:slug" component={Gallery} />

      <Route path="/prijave">
        {() => {
          window.location.href = import.meta.env.VITE_APPLICATION_FORM_URL;
          return null;
        }}
      </Route>

      {/* Redirects for old routes */}
      <Route path="/galleries">
        {() => {
          window.location.replace("/galerije");
          return null;
        }}
      </Route>

      <Route>Oopsie, ova stranica nije pronadena.</Route>
    </Switch>
  </React.StrictMode>
);
