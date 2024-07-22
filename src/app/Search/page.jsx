import dynamic from "next/dynamic";

// Importa el componente de cliente dinámicamente
const SearchClient = dynamic(() => import("./SearchClient"), { ssr: false });

const Search = () => {
  return <SearchClient />;
};

export default Search;
