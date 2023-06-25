import Nav from "../components/nav";
import Footer from "../components/footer";

export default function Home() {
  return (
    <div id="page_home">
      <Nav />
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <Footer />
    </div>
  );
}
