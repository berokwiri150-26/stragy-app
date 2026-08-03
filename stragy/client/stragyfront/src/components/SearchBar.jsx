export default function SearchBar({ query, onQueryChange, onRefresh }) {
  return (
    <section className="search-row">
      <input
        placeholder="Search vehicles (make or model)"
        value={query}
        onChange={onQueryChange}
      />
      <button type="button" onClick={onRefresh}>Refresh</button>
    </section>
  )
}
