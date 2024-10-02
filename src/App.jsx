import Navbar from "/src/components/Navbar";
import Hero from "/src/components/Hero";
import HighLights from "/src/components/HighLights";
import Model from "/src/components/Model";

const App = () => {
  return (
    <main className="bg-black">
      <Navbar/>
      <Hero/>
      <HighLights/>
      <Model/>
    </main>
  );
};

export default App;
