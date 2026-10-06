const RecordDetails = ({ record = {} }) => {
  const imageUrl = record.poster_url || record.backdrop_url || record.image_url;
  const imageAlt = `${record.title || record.title || 'Movie'} poster`;

  export default RecordDetails;