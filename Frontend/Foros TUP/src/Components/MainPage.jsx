import Forums from "../forums/Forums";
import { useFetchFromAPI } from "../../services/fetch/UseFetchFromAPI";

const MainPage = () => {
  const { data: forums, loading, error } = useFetchFromAPI("/forums", []);

  if (loading) return <p>Cargando foros...</p>;
  if (error) return <p>Error: {error}</p>;

  return <Forums forumsProp={forums} />;
};

export default MainPage;
