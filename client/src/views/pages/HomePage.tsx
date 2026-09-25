import { appViewModel } from '../../viewmodels/AppViewModel'

function HomePage() {
  const app = appViewModel()

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:pt-28">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Core Coding Committee · VCET
          </p>
          <h1 className="mt-5 max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
            Ideas worth reading, written by our campus.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            Discover thoughtful student and teacher perspectives on technology,
            academics, culture, campus life, and the ideas shaping tomorrow.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#latest"
              className="rounded-lg bg-slate-950 px-5 py-3 font-medium text-white dark:bg-white dark:text-slate-950"
            >
              Explore articles
            </a>
            <a
              href="/register"
              className="rounded-lg border border-slate-300 px-5 py-3 font-medium dark:border-slate-700"
            >
              Join the publication
            </a>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Editorial note
          </p>
          <h2 className="mt-5 text-2xl font-bold">
            A serious home for campus voices.
          </h2>
          <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
            CCC brings campus writing together with a clear editorial process,
            comfortable reading, and room for every approved topic.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-slate-200 pt-5 text-sm dark:border-slate-800">
            <div>
              <strong className="block text-xl">15+</strong>
              <span className="text-slate-500">topics</span>
            </div>
            <div>
              <strong className="block text-xl">VCET</strong>
              <span className="text-slate-500">community</span>
            </div>
            <div>
              <strong className="block text-xl">C3</strong>
              <span className="text-slate-500">publication</span>
            </div>
          </div>
        </div>
      </section>
      <section id="latest" className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">
            Coming next
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            The editorial feed is taking shape.
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">
            Article discovery, categories, review, and publishing are being
            built in the next CCC phases.
          </p>
        </div>
      </section>
      <span className="sr-only">Version {app.version}</span>
    </main>
  )
}

export default HomePage