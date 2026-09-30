const ClanGrid = ({ clubs }) => (
  <section className='clan-grid'>
    {Array.isArray(clubs) && clubs.length ? clubs.map((club) => <div key={club.id}>{club.name}</div>) : <p>No clans  yet.</p>}
  </section>
);

export default ClanGrid;
