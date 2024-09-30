import Navbar from "/src/components/Navbar";
import Hero from "/src/components/Hero";
import HighLights from "/src/components/HighLights";

const App = () => {
  return (
    <main className="bg-black">
      <Navbar/>
      <Hero/>
      <HighLights/>
    </main>
  );
};

export default App;
