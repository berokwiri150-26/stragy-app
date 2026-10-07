const styles = {
  wrap: { display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--amber)', fontSize: 14 },
  score: { fontWeight: 700 },
  outOf: { color: 'var(--text-dim)', fontSize: 12 },
};


function RecordRating({ rating }) {
  if (rating == null) return null;
  return (
    <span style={styles.wrap}>
      ★ <span style={styles.score}>{rating.toFixed(1)}</span>
      <span style={styles.outOf}>/10</span>
    </span>
  );
}

export default RecordRating;
