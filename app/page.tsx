export default function Home() {
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 sm:items-start">
      <section className="flex flex-1 flex-col w-full items-center justify-center">
        <div className="text-3xl">
          Hi, I&apos;m <span className="font-semibold">Habibi Gusti Pangestu</span>
        </div>
        <div className="text-gray-500">
          Thank you for giving me the opportunity
        </div>
        <div className="mt-6">
          You can check the progress of the take home test in the <span className="font-semibold">users</span> menu in the top right corner of the navbar.
        </div>
      </section>
    </main>
  );
}
