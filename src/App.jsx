import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HighLights from "./components/HighLIghts";

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
