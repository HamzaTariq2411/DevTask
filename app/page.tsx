import Navbar from "@/components/layout/Navbar";
import HomePage from "@/components/pages/Home";


export default function Home() {
  return (
    <>
      <Navbar/>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-8 mt-16">
      <HomePage/>
      </div>
    </>
  );
}
