const ClanGrid = ({ clans }) => (
  <section className='clan-grid'>
    {Array.isArray(clans) && clans.length ? clans.map((clan) => <div key={clan.id}>{clan.name}</div>) : <p>No clans yet.</p>}
  </section>
);

export default ClanGrid;
