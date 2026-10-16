import NavBar from "./navbar/NavBar";

const Header = () => {
  const SpacerStyle = {
    paddingBottom: "72px",
  };

  return (
    <>
      <section className="fixed-top">
        <NavBar />
      </section>

      <section style={SpacerStyle} />
    </>
  );
};

export default Header;