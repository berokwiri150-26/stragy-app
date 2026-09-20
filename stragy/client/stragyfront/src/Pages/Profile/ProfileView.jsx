



const getProfileImage = (profile = {}) =>
  profile.profile_image_url ||
  profile.profileImageUrl ||
  profile.avatar_url ||
  profile.avatarUrl ||
  profile.image_url ||
  profile.imageUrl ||
  '';

const ProfileView = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [watched, setWatched] = useState([]);
  const [mutual, setMutual] = useState([]);

  useEffect(() => {
    let active = true;

    getProfile(id)
      .then(({ data }) => {
        if (!active) return;
        setProfile(data?.user || data);
      })
      .catch(() => {
        if (!active) return;
        setError('Could not load this profile.');
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!profile) return;

    let active = true;
    getMutual(profile.id || id)
      .then(({ data }) => {
        if (!active) return;
        setMutual(Array.isArray(data) ? data : data?.items || []);
      })
      .catch(() => {
        if (!active) return;
        setMutual([]);
      });

    return () => {
      active = false;
    };
  }, [profile, id]);

  useEffect(() => {
    if (!profile) return;
    const isOwn = Number(user?.id) === Number(profile.id || id);
    if (!isOwn) return;

    let active = true;
    getWatched()
      .then(({ data }) => {
        if (!active) return;
        setWatched((data?.items || data || []).slice(0, 6));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [profile, user, id]);

  if (error) {
    return (
      <section className="page-panel">
        <p className="error-message">{error}</p>
      </section>
    );
  }

  if (!profile) {
    return (
      <section className="page-panel">
        <p className="muted">Loading profile...</p>
      </section>
    );
  }

  const name =
    profile.username ||
    profile.name ||
    profile.email ||
    'Movie fan';

  const isOwnProfile =
    Number(user?.id) === Number(profile.id || id);

  return (
    <section className="page-panel profile-page">
      <div className="profile-hero">
        <div className="profile-hero__avatar-wrap">
          <UserAvatar name={name} imageUrl={getProfileImage(profile)} size={256} className="profile-avatar" />
        </div>

        <div className="profile-hero__content">
          <h1>{name}</h1>
          <p className="profile-bio">
            {profile.bio || 'Cinema enthusiast'}
          </p>

          <div className="profile-stats">
            <div className="profile-stat">
              <strong>{profile.post_count ?? profile.posts_count ?? 0}</strong>
              <span>Posts</span>
            </div>
            <div className="profile-stat">
              <strong>{profile.follower_count ?? profile.followers_count ?? 0}</strong>
              <span>Followers</span>
            </div>
            <div className="profile-stat">
              <strong>{profile.following_count ?? profile.following?.length ?? 0}</strong>
              <span>Following</span>
            </div>
          </div>

          <div className="profile-actions">
            {!isOwnProfile && <FollowButton userId={profile.id || id} />}
            {isOwnProfile && (
              <Link className="button" to={`/profile/${id}/edit`}>
                Edit profile
              </Link>
            )}
          </div>
        </div>
      </div>