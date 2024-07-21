import Image from "next/image";
import Todo from "./components/todo";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Todo />
    </main>
  );
}
