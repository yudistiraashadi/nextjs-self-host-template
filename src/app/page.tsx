import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
};

export default async function Home() {
  return (
    <section className="container mx-auto py-12">
      <h2 className="text-2xl font-semibold">Home</h2>
    </section>
  );
}
