const polaroids = [
  { id: 1, caption: 'Aloha Hawaii', rotate: '-rotate-3', bg: 'bg-amber-100' },
  { id: 2, caption: 'PCH Drive', rotate: 'rotate-2', bg: 'bg-sky-100' },
  { id: 3, caption: 'Angkor Wat', rotate: '-rotate-1', bg: 'bg-emerald-100' },
  { id: 4, caption: 'Colorado Snow', rotate: 'rotate-3', bg: 'bg-indigo-100' },
  { id: 5, caption: 'Just Us', rotate: '-rotate-2', bg: 'bg-rose-100' },
]

export default function Polaroids() {
  return (
    <section className="bg-cream py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-earth uppercase tracking-[0.2em] text-xs mb-2">Snapshots</p>
          <h2 className="font-serif text-4xl text-navy font-bold">Memory Wall</h2>
          <div className="w-16 h-0.5 bg-warmtan mx-auto mt-4" />
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {polaroids.map((photo) => (
            <div key={photo.id} className={`polaroid ${photo.rotate} hover:rotate-0 transition-transform duration-300 cursor-pointer w-44`}>
              <div className={`w-full h-40 ${photo.bg} flex items-center justify-center`}>
                <span className="text-4xl opacity-30">&#10084;</span>
              </div>
              <p className="text-center text-earth font-serif italic text-sm mt-3 px-1">{photo.caption}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <p className="text-earth/60 font-serif italic text-base">&quot;Not all those who wander are lost — some are just finding new favorites.&quot;</p>
        </div>
      </div>
    </section>
  )
}
