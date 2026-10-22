import "./MainPage.css";
import Forums from "./Forums.jsx";
import { useApiResource } from "../hooks/useApiResource.js";
import { getForums } from "../Services/forumService.js";

const MainPage = () => {
  const { data: forums, loading, error } = useApiResource(
    getForums,
    undefined,
    []
  );

  if (loading) return <p>Cargando foros...</p>;
  if (error) return <p>Error: {error}</p>;

  return <Forums forumsProp={forums} />;
};

export default MainPage;
