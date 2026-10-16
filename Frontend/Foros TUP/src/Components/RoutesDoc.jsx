import { BrowserRouter, Route, Routes } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "../../styles/toast.css";
import Protected from "../protected/Protected";
import PublicOnly from "../protected/PublicOnly";

import MainPage from "../main_page/MainPage";
import LogIn from "../login/LogIn";
import Register from "../register/Register";
import NotFound from "../notFound/NotFound";
import Layout from "../layout/Layout"
import ForumListPage from "../ForumListPage/ForumListPage";
import ForumPage from "../forumPage/ForumPage";
import PostPage from "../postPage/PostPage";

import NewForum from "../newForum/NewForum";
import NewPost from "../newPost/NewPost";

import Bans from "../bans/Bans";
import NewBans from "../bans/NewBans";
import Users from "../usersList/UserList";
import UserEdit from "../users/UserEdit";
import ProtectedOnlyAdmin from "../protected/ProtectedOnlyAdmin";
import ProtectedOnlySysAdmin from "../protected/ProtectedOnlySysAdmin";

const RoutesDoc = () => {
  return (
    <BrowserRouter>
      

      <Routes>
        {/* Rutas públicas */}
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/home" element={<MainPage />} />

          <Route element={<PublicOnly />}>
            <Route path="/login" element={<LogIn />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route path="/foros" element={<ForumListPage />} />
          <Route path="/forum/:forumId" element={<ForumPage />} />
          <Route path="/post/:postId" element={<PostPage />} />

          {/* Rutas protegidas: solo usuarios logueados pueden entrar */}
          <Route element={<Protected />}>
            <Route path="/user/edit" element={<UserEdit />} />
            <Route path="/forums/:forumId/posts/new" element={<NewPost />} />
            
            {/* Rutas de Admin: solo ADMIN y SYSADMIN pueden acceder. */}
            <Route element={<ProtectedOnlyAdmin />}>
              <Route path="/bans" element={<Bans />} />
              <Route path="/newban" element={<NewBans />} />
              <Route path="/users" element={<Users />} />
              <Route path="/newforum" element={<NewForum />} />
            </Route>
        </Route>
        </Route>
        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>


     
    </BrowserRouter>
  );
};

export default RoutesDoc;
